import { useEffect } from 'react'

import { QuizResultCardData } from '@/pages/progress-quiz-page'

import { ImgCheckbadge, ImgMedal, ImgSpeechbubble, ImgStopwatch } from '@/shared/assets/images'
import { QuestionCard } from '@/shared/components/cards/question-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Button } from '@/shared/components/ui/button'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

export const QuizResultView = ({
  totalElapsedTime,
  quizWithResultData,
}: {
  totalElapsedTime: number
  quizWithResultData: QuizResultCardData[]
}) => {
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()
  useEffect(() => {
    trackEvent('quiz_complete_view')
  }, [])

  const [prevUrl] = useQueryParam('/progress-quiz/:quizSetId', 'prevUrl')

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
              {t('progressQuiz.quiz_result_view.complete_title')}
            </Text>
          </div>
          <div className="text-center mt-2">
            <Text typo="h2">
              <span className="text-info">{correctAnswers}</span>/{totalQuizCount}
            </Text>
          </div>
          <div className="flex mt-10 items-center justify-around px-[28px]">
            <div className="px-[20px] flex flex-col items-center">
              <ImgSpeechbubble className="w-[32px]" />
              <Text typo="subtitle-2-bold" className="mt-1">
                {totalQuizCount}
                {t('progressQuiz.quiz_result_view.question_count')}
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                {t('progressQuiz.quiz_result_view.question_count')}
              </Text>
            </div>
            <div className="h-[80px] w-px bg-[#E3E9EF]" />
            <div className="px-[20px] flex flex-col items-center">
              <ImgStopwatch className="w-[32px]" />
              <Text typo="subtitle-2-bold" className="mt-1">
                {Math.ceil(totalElapsedTime / 1000 / 60)}분
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                {t('progressQuiz.quiz_result_view.time_spent')}
              </Text>
            </div>
            <div className="h-[80px] w-px bg-[#E3E9EF]" />
            <div className="px-[20px] flex flex-col items-center">
              <ImgCheckbadge className="w-[32px]" />
              <Text typo="subtitle-2-bold" className="mt-1">
                {correctAnswerRate}%
              </Text>
              <Text typo="body-2-medium" color="sub" className="mt-0.5">
                {t('progressQuiz.quiz_result_view.accuracy_rate')}
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
                      {quizWithResult.isCorrect
                        ? t('progressQuiz.quiz_page.correct_answer')
                        : t('progressQuiz.quiz_page.incorrect_answer')}
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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Button onClick={() => (prevUrl ? router.replace(prevUrl as any, {}) : router.back())}>
          {t('common.confirm')}
        </Button>
      </FixedBottom>
    </div>
  )
}
