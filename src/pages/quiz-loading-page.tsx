import { useCallback, useEffect } from 'react'

import { useProgressAnimation } from '@/features/quiz/model/use-progress-animation'
import { useQuizGenerationPolling } from '@/features/quiz/model/use-quiz-generation-polling'
import { QuizLoadingProgressBar } from '@/features/quiz/quiz-loading-progress-bar'

import { useGetSingleDocument } from '@/entities/document/api/hooks'

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
  const {
    progress,
    startAnimation,
    complete: completeAnimation,
  } = useProgressAnimation({
    timeline: progressTimeline,
    estimatedLoadingTime: ESTIMATED_LOADING_TIME,
  })

  // 폴링 훅 사용
  const {
    pollingResult: { quizId, isComplete },
    generateQuiz,
  } = useQuizGenerationPolling(documentId, {
    pollingInterval: 2000,
    maxPollingCount: 60,
    autoCompleteTime: 70000,
  })

  // 문서 조회 훅 - 필요시 documentData 사용 가능
  const { refetch: refetchDocument } = useGetSingleDocument(documentId)

  // 퀴즈 생성 완료 후 퀴즈 페이지로 이동
  const handleQuizGenerationComplete = useCallback(() => {
    if (quizId) {
      // 라우터를 사용하여 퀴즈 페이지로 이동
      router.push('/progress-quiz/:quizId', {
        params: [quizId],
        search: {
          quizIndex: 0,
          selectedOption: null,
          autoNext: true,
        },
      })
    }
  }, [quizId, router])

  // 퀴즈 생성 성공 시 진행률 100%로 설정
  const handleQuizGenerationSuccess = useCallback(
    (_id: string) => {
      // 진행률 100%로 설정
      completeAnimation()
      // 문서 정보 리프레시
      refetchDocument()
    },
    [completeAnimation, refetchDocument],
  )

  // 컴포넌트 마운트 시 퀴즈 생성 및 애니메이션 시작
  useEffect(() => {
    // 애니메이션 시작
    startAnimation()
    // 퀴즈 생성 시작
    generateQuiz(handleQuizGenerationSuccess)
  }, [startAnimation, generateQuiz, handleQuizGenerationSuccess])

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

        <QuizLoadingProgressBar
          completed={isComplete}
          onComplete={handleQuizGenerationComplete}
          progressOverride={progress}
          text="내용을 읽고 있어요"
        />
      </div>
    </div>
  )
}

export default QuizLoadingPage
