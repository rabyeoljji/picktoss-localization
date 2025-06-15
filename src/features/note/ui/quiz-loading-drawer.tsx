import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { toast } from 'sonner'

import { useProgressAnimation } from '@/features/quiz/model/use-progress-animation'
import { useQuizGenerationPolling } from '@/features/quiz/model/use-quiz-generation-polling'
import QuizLoadingProgressBar from '@/features/quiz/ui/quiz-loading-progress-bar'

import { useDeleteDocument } from '@/entities/document/api/hooks'

import { ImgQuizEmpty, ImgQuizcard } from '@/shared/assets/images'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Button } from '@/shared/components/ui/button'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useOnceEffect } from '@/shared/hooks'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useQueryParam, useRouter } from '@/shared/lib/router'

import { useCreateNoteContext } from '../model/create-note-context'

// 예상 로딩 시간 (ms) - 이 값에 따라 프로그레스바 속도가 조절됨
const ESTIMATED_LOADING_TIME = 40000 // 40초

export const QuizLoadingDrawer = () => {
  const { trackEvent } = useAmplitude()
  const { pathname } = useLocation()
  const router = useRouter()
  const { documentType } = useCreateNoteContext()

  // 로딩 상태를 queryParam으로 관리
  const [{ isLoading, documentId }, setParams] = useQueryParam('/note/create')

  // 단계적 진행 타임라인 정의
  const progressTimeline = [
    { time: 2000, target: 10 }, // 2초 후 10%
    { time: 4000, target: 20 }, // 4초 후 20%
    { time: 7000, target: 35 }, // 7초 후 35%
    { time: 10000, target: 45 }, // 10초 후 45%
    { time: 15000, target: 60 }, // 15초 후 60%
    { time: 22000, target: 75 }, // 22초 후 75%
    { time: 30000, target: 85 }, // 30초 후 85%
    { time: 40000, target: 92 }, // 40초 후 92%
    { time: 50000, target: 99 }, // 50초 후 99%
  ]

  // 프로그레스 애니메이션 훅 사용
  const {
    progress,
    complete: completeAnimation,
    reset: resetProgressAnimation,
    startAnimation,
  } = useProgressAnimation({
    timeline: progressTimeline,
    estimatedLoadingTime: ESTIMATED_LOADING_TIME,
  })

  const { mutate: deleteDocument } = useDeleteDocument()

  useEffect(() => {
    if (isLoading) {
      startAnimation()
    }
  }, [isLoading])

  // 문서 퀴즈 상태 폴링 훅 사용 (로딩 중일 때만 활성화)
  const { error, quizSetId, clearError } = useQuizGenerationPolling(
    { documentId },
    {
      pollingInterval: 2000,
      maxPollingCount: 60,
      autoCompleteTime: 70000,
    },
  )

  // 로딩 상태 토글 함수
  const toggleLoading = (state: boolean) => {
    setParams((prev) => ({ ...prev, isLoading: state, documentId: state ? documentId : 0 }))
  }

  useOnceEffect(() => {
    if (quizSetId != null) {
      toast.success('문서가 생성되었습니다.')
    }
  }, [quizSetId])

  useOnceEffect(() => {
    if (error != null) {
      deleteDocument({ documentIds: [documentId] })
    }
  }, [error])

  const renderQuizLoadingDrawerContent = () => {
    // 에러 발생 시 에러 화면 표시
    if (error != null) {
      return (
        <div className="px-[57px] w-full center">
          <div className="flex-center flex-col">
            <ImgQuizEmpty className="w-[120px]" />
            <Text typo="subtitle-1-bold" color="primary" className="mt-4">
              퀴즈를 만드는 중 문제가 생겼어요
            </Text>
            <Text typo="body-1-medium" color="sub" className="mt-1">
              아래 내용을 확인하신 후 다시 시도해보세요
            </Text>
          </div>

          <div className="my-8 py-6 px-5 bg-surface-2 rounded-[12px]">
            <Text typo="body-1-bold" color="secondary">
              좋은 퀴즈를 위한 노트 Tip
            </Text>
            <ul className="mt-2.5 list-disc pl-5">
              <Text as="li" typo="body-1-medium" color="sub">
                충분한 정보가 있는지 확인해주세요
              </Text>
              <Text as="li" typo="body-1-medium" color="sub">
                같은 내용이 반복되지 않도록 해주세요
              </Text>
            </ul>
          </div>

          <Button
            onClick={() => {
              toggleLoading(false)
              clearError()
              resetProgressAnimation()
            }}
          >
            노트 수정하러 가기
          </Button>
        </div>
      )
    }

    if (quizSetId != null) {
      return (
        <div className="px-[57px] w-full center">
          <div className="flex-center flex-col">
            <ImgQuizcard className="w-[120px]" />
            <Text typo="h4" color="primary" className="mt-4">
              퀴즈 생성 완료!
            </Text>
            <Text typo="subtitle-2-medium" color="sub" className="mt-2">
              새로 생긴 문제를 지금 확인해보세요
            </Text>
          </div>

          <div className="mt-10 w-full flex flex-col items-center">
            <Button
              onClick={() => {
                trackEvent('generate_confirm_click', {
                  location: pathname.startsWith('/note/create') ? '생성 페이지' : '상세 페이지',
                  format: documentType === 'TEXT' ? '텍스트' : '파일',
                  type: '전체',
                })
                completeAnimation()
                setTimeout(() => {
                  router.replace('/progress-quiz/:quizSetId', {
                    params: [String(quizSetId)],
                    search: {
                      documentId,
                      prevUrl: `/library/${documentId}`,
                    },
                  })
                }, 500)
              }}
            >
              시작하기
            </Button>
            <TextButton
              onClick={() => {
                trackEvent('generate_quiz_later_click')
                router.replace('/library/:noteId', { params: [String(documentId)] })
              }}
              size="lg"
              className="text-secondary mt-[24px]"
            >
              다음에
            </TextButton>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-center center w-full">
        <div className="flex-center flex-col gap-[32px] w-full">
          <Loading size="small" />

          <QuizLoadingProgressBar
            progressOverride={progress}
            text={
              progress < 20
                ? '내용을 읽고 있어요'
                : progress < 60
                  ? '퀴즈로 만들 내용을 고르고 있어요'
                  : '질문을 만들고 있어요'
            }
          />
        </div>
      </div>
    )
  }

  return (
    <AlertDrawer
      open={isLoading}
      onOpenChange={toggleLoading}
      height="full"
      hasClose={false}
      body={renderQuizLoadingDrawerContent()}
      contentClassName="bg-surface-1 p-0 rounded-t-none"
    />
  )
}
