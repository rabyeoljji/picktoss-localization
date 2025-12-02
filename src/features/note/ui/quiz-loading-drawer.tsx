import { useEffect, useState } from 'react'

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
import { useTranslation } from '@/shared/locales/use-translation'

// 예상 로딩 시간 (ms) - 이 값에 따라 프로그레스바 속도가 조절됨
const ESTIMATED_LOADING_TIME = 40000 // 40초

export const QuizLoadingDrawer = () => {
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()
  const router = useRouter()

  // 로딩 상태를 queryParam으로 관리
  const [{ isLoading, documentId }, setParams] = useQueryParam('/note/create')
  const [complete, setComplete] = useState(false)

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
      pollingInterval: 3500,
      maxPollingCount: 120,
      autoCompleteTime: 100000,
    },
  )

  // 로딩 상태 토글 함수
  const toggleLoading = (state: boolean) => {
    setParams((prev) => ({ ...prev, isLoading: state, documentId: state ? documentId : 0 }))
  }

  useOnceEffect(() => {
    if (quizSetId != null) {
      completeAnimation()
      setTimeout(() => {
        setComplete(true)
        toast.success(`${t('createQuiz.toast.document_created')}.`)
      }, 500)
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
              {t('createQuiz.quiz_loading_drawer.error_title')}
            </Text>
            <Text typo="body-1-medium" color="sub" className="mt-1">
              {t('createQuiz.quiz_loading_drawer.error_description')}
            </Text>
          </div>

          <div className="my-8 py-6 px-5 bg-surface-2 rounded-[12px]">
            <Text typo="body-1-bold" color="secondary">
              {t('createQuiz.quiz_loading_drawer.tip_title')}
            </Text>
            <ul className="mt-2.5 list-disc pl-5">
              <Text as="li" typo="body-1-medium" color="sub">
                {t('createQuiz.quiz_loading_drawer.tip_check_info')}
              </Text>
              <Text as="li" typo="body-1-medium" color="sub">
                {t('createQuiz.quiz_loading_drawer.tip_avoid_repeat')}
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
            {t('createQuiz.quiz_loading_drawer.edit_note_button')}
          </Button>
        </div>
      )
    }

    if (complete) {
      return (
        <div className="px-[57px] w-full center">
          <div className="flex-center flex-col">
            <ImgQuizcard className="w-[120px]" />
            <Text typo="h4" color="primary" className="mt-4">
              {t('createQuiz.quiz_loading_drawer.complete_title')}!
            </Text>
            <Text typo="subtitle-2-medium" color="sub" className="mt-2">
              {t('createQuiz.quiz_loading_drawer.complete_description')}
            </Text>
          </div>

          <div className="mt-10 w-full flex flex-col items-center">
            <Button
              onClick={() => {
                trackEvent('generate_quiz_start_click')
                router.replace('/progress-quiz/:quizSetId', {
                  params: [String(quizSetId)],
                  search: {
                    documentId,
                    prevUrl: `/quiz-detail/${documentId}`,
                  },
                })
              }}
            >
              {t('createQuiz.quiz_loading_drawer.start_button')}
            </Button>
            <TextButton
              onClick={() => {
                trackEvent('generate_quiz_later_click')
                router.replace('/quiz-detail/:noteId', { params: [String(documentId)] })
              }}
              size="lg"
              className="text-secondary mt-[24px]"
            >
              {t('createQuiz.quiz_loading_drawer.later_button')}
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
                ? t('createQuiz.quiz_loading_drawer.progress_reading')
                : progress < 60
                  ? t('createQuiz.quiz_loading_drawer.progress_selecting')
                  : t('createQuiz.quiz_loading_drawer.progress_creating')
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
