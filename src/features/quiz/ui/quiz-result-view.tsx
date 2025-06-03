import { useEffect } from 'react'

import { QuizResultCardData } from '@/pages/progress-quiz-page'

import { ImgCheckbadge, ImgMedal, ImgSpeechbubble, ImgStopwatch } from '@/shared/assets/images'
import { QuestionCard } from '@/shared/components/cards/question-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Button } from '@/shared/components/ui/button'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useRouter } from '@/shared/lib/router'

export const QuizResultView = ({
  totalElapsedTime,
  quizWithResultData,
}: {
  totalElapsedTime: number
  quizWithResultData: QuizResultCardData[]
}) => {
  const { trackEvent } = useAmplitude()
  useEffect(() => {
    trackEvent('quiz_complete_view')
  }, [])

  const router = useRouter()

  // 전체 통계 계산
  const totalQuizCount = quizWithResultData.length

  // 정답률 계산
  const correctAnswers = quizWithResultData.filter((quiz: QuizResultCardData) => quiz.isCorrect).length
  const correctAnswerRate = totalQuizCount > 0 ? Math.round((correctAnswers / totalQuizCount) * 100) : 0

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="px-4 pb-[162px]">
        <div>
          <div>
            <ImgMedal className="w-[160px] mx-auto pt-[70px]" />
            <Text typo="h2" color="primary" className="text-center">
              퀴즈 완료!
            </Text>
          </div>
          <div className="flex mt-10 items-center justify-around px-[28px]">
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
                {Math.ceil(totalElapsedTime / 1000 / 60)}분
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                소요시간
              </Text>
            </div>
            <div className="h-[80px] w-px bg-[#E3E9EF]" />
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

        <div className="mt-10 py-5 grid gap-3">
          {quizWithResultData.map((quizWithResult, index) => {
            const showIndexs: number[] = []

            if (quizWithResult.quizType === 'MIX_UP') {
              if (quizWithResult.isCorrect && quizWithResult.userAnswer === 'correct') {
                showIndexs.push(0)
              } else if (quizWithResult.isCorrect && quizWithResult.userAnswer === 'incorrect') {
                showIndexs.push(1)
              } else {
                showIndexs.push(0)
                showIndexs.push(1)
              }
            }

            if (quizWithResult.quizType === 'MULTIPLE_CHOICE') {
              if (quizWithResult.isCorrect) {
                showIndexs.push(quizWithResult.options?.findIndex((option) => option === quizWithResult.answer) || 0)
              } else {
                showIndexs.push(quizWithResult.options?.findIndex((option) => option === quizWithResult.answer) || 0)
                showIndexs.push(
                  quizWithResult.options?.findIndex((option) => option === quizWithResult.userAnswer) || 0,
                )
              }
            }

            return (
              <QuestionCard key={quizWithResult.id}>
                <QuestionCard.Header
                  order={index + 1}
                  right={
                    <Tag size="md" color={quizWithResult.isCorrect ? 'green' : 'red'}>
                      {quizWithResult.isCorrect ? '정답' : '오답'}
                    </Tag>
                  }
                />
                <QuestionCard.Question>{quizWithResult.question}</QuestionCard.Question>
                {quizWithResult.quizType === 'MULTIPLE_CHOICE' && (
                  <QuestionCard.Multiple
                    options={quizWithResult.options || []}
                    answerIndex={
                      quizWithResultData[index].options?.findIndex(
                        (option) => option === quizWithResultData[index].userAnswer,
                      ) || 0
                    }
                    showIndexs={showIndexs}
                  />
                )}
                {quizWithResult.quizType === 'MIX_UP' && (
                  <QuestionCard.OX
                    answerIndex={quizWithResult.answer === 'correct' ? 0 : 1}
                    showIndexs={showIndexs}
                    disabledIndexs={[0, 1].filter((index) => !showIndexs.includes(index))}
                  />
                )}
                <QuestionCard.Explanation children={quizWithResult.explanation || ''} />
              </QuestionCard>
            )
          })}
        </div>
      </div>

      <FixedBottom className="bg-surface-2 h-[114px]">
        <Button onClick={() => router.back()}>확인</Button>
      </FixedBottom>
    </div>
  )
}
