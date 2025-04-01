import { useProgressAnimation } from '@/features/quiz/model/use-progress-animation'
import { useQuizGenerationPolling } from '@/features/quiz/model/use-quiz-generation-polling'
import { QuizLoadingProgressBar } from '@/features/quiz/ui/quiz-loading-progress-bar'

import { ImgQuizEmpty } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'

// 예상 로딩 시간 (ms) - 이 값에 따라 프로그레스바 속도가 조절됨
const ESTIMATED_LOADING_TIME = 40000 // 40초

const QuizLoadingPage = () => {
  const [params] = useQueryParam('/quiz-loading')
  const { documentId, documentName, star } = params

  const router = useRouter()

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
  const { progress, complete: completeAnimation } = useProgressAnimation({
    timeline: progressTimeline,
    estimatedLoadingTime: ESTIMATED_LOADING_TIME,
  })

  // 문서 퀴즈 상태 폴링 훅 사용
  const { error } = useQuizGenerationPolling(documentId, {
    pollingInterval: 2000,
    maxPollingCount: 60,
    autoCompleteTime: 70000,
    onSuccess: ({ quizSetId, quizSetType }) => {
      completeAnimation()
      setTimeout(() => {
        router.push('/progress-quiz/:quizSetId', {
          params: [quizSetId],
          search: {
            quizSetType,
          },
        })
      }, 500)
    },
  })

  // 에러 발생 시 에러 화면 표시
  if (error != null) {
    return (
      <div className="relative h-svh bg-surface-1">
        <div className="center flex-center flex-col w-full px-[43px]">
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

          <Button>노트 수정하러 가기</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="border-divider border">
        <div className="pt-[14px] pb-[2px] pl-[17px] pr-[18px] flex items-center gap-2.5">
          <Text typo="subtitle-2-bold" color="primary">
            {documentName}
          </Text>
          <Text typo="body-1-medium" color="sub">
            {star} 문제
          </Text>
        </div>

        <QuizLoadingProgressBar progressOverride={progress} text="내용을 읽고 있어요" />
      </div>
    </div>
  )
}

export default QuizLoadingPage
