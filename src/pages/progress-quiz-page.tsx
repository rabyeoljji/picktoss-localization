import { useState } from 'react'
import { useParams } from 'react-router'

import { MultipleChoiceOption } from '@/features/quiz/multiple-choice-option'
import { ProgressBar } from '@/features/quiz/progress-bar'
import { StopWatch } from '@/features/quiz/stop-watch'

import { useGetDocumentQuizzes } from '@/entities/document/api/hooks'
import { Question } from '@/entities/quiz/ui/question'

import { IcControl } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { useQueryParam } from '@/shared/lib/router'

export const ProgressQuizPage = () => {
  const { quizId } = useParams()
  const [currentQuestion, _setCurrentQuestion] = useState(2)
  const [quizIndex, setQuizIndex] = useQueryParam('/progress-quiz/:quizId', 'index')

  const { data: quizzes } = useGetDocumentQuizzes({
    documentId: Number(quizId),
  })

  if (!quizzes) {
    return <div className="center">Loading...</div>
  }

  const currentQuiz = quizzes[quizIndex]

  return (
    <div className="min-h-screen bg-surface-1">
      <Header
        left={<BackButton type="close" />}
        content={
          <div>
            <div className="center">
              <StopWatch isRunning={true} />
            </div>
            <IcControl className="size-6 ml-auto" />
          </div>
        }
      />
      <ProgressBar current={4} totalQuizCount={quizzes.length} />

      {/* 퀴즈 콘텐츠 영역 */}
      <div className="pt-10">
        <Question order={quizIndex + 1} question={currentQuiz.question} />
        <>
          {currentQuiz.quizType === 'MULTIPLE_CHOICE' && (
            <div className="pt-10 grid gap-2.5">
              {currentQuiz.options.map((option, index) => (
                <MultipleChoiceOption key={option} label={String.fromCharCode(65 + index)} content={option} />
              ))}
            </div>
          )}
          {currentQuiz.quizType === 'MIX_UP' && <div></div>}
        </>
      </div>
    </div>
  )
}
