import { ImgCheckbadge, ImgMedal, ImgSpeechbubble, ImgStopwatch } from '@/shared/assets/images'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'

// 퀴즈 결과 아이템 타입 정의
interface QuizItem {
  id: number
  question: string
  answer: string
  explanation?: string
  options?: string[]
  userAnswer: string | null
  elapsedTime: number
  isCorrect: boolean
}

const QuizResultPage = () => {
  const [params] = useQueryParam('/quiz-result')
  const quizDataDecoded = atob(params.quizDataEncoded)
  const quizData = JSON.parse(quizDataDecoded) as QuizItem[]

  // 전체 통계 계산
  const totalQuizCount = quizData.length

  // 정답률 계산
  const correctAnswers = quizData.filter((quiz: QuizItem) => quiz.isCorrect).length
  const correctAnswerRate = totalQuizCount > 0 ? Math.round((correctAnswers / totalQuizCount) * 100) : 0

  // 총 소요 시간 계산 (밀리초 단위)
  const totalElapsedTimeMs = quizData.reduce((total: number, quiz: QuizItem) => total + (quiz.elapsedTime || 0), 0)
  // 분 단위로 변환하고 소수점 첫째 자리까지 표시
  const totalElapsedTime = (totalElapsedTimeMs / 60000).toFixed(1)

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="px-4">
        <div>
          <div>
            <ImgMedal className="w-[100px]" />
            <Text typo="h2" color="primary">
              퀴즈 완료!
            </Text>
          </div>
          <div className="flex items-center justify-around">
            <div className="px-[20px] flex flex-col items-center">
              <ImgSpeechbubble className="w-[32px]" />
              <Text typo="subtitle-2-bold" className="mt-1">
                {totalQuizCount}문제
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                문제 수
              </Text>
            </div>
            <div className="h-[80px] w-px bg-[#E3E9EF]" />
            <div className="px-[20px] flex flex-col items-center">
              <ImgStopwatch className="w-[32px]" />
              <Text typo="subtitle-2-bold" className="mt-1">
                {totalElapsedTime}분
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                소요시간
              </Text>
            </div>
            <div className="px-[20px] flex flex-col items-center">
              <ImgCheckbadge className="w-[32px]" />
              <Text typo="subtitle-2-bold" className="mt-1">
                {correctAnswerRate}%
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                정답률
              </Text>
            </div>
          </div>
        </div>

        <div>{/* 여기에 퀴즈 개별 결과를 보여주는 컴포넌트 추가 예정 */}</div>
      </div>
    </div>
  )
}

export default QuizResultPage
