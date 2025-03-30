import { useState } from 'react'
import { useParams } from 'react-router'

import { MultipleChoiceOption } from '@/features/quiz/multiple-choice-option'
import { ProgressBar } from '@/features/quiz/progress-bar'
import { StopWatch } from '@/features/quiz/stop-watch'

import { useGetDocumentQuizzes } from '@/entities/document/api/hooks'
import { Question } from '@/entities/quiz/ui/question'

import { IcControl } from '@/shared/assets/icon'
import { ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { PeekingDrawer, PeekingDrawerContent } from '@/shared/components/drawers/peeking-drawer'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

type Quiz = {
  id: number
  question: string
  answer: string
  explanation: string
  options: string[]
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
  document: {
    id: number
    name: string
  }
  directory: {
    id: number
    name: string
  }
}

export const ProgressQuizPage = () => {
  const { quizId } = useParams()

  const [params, setParams] = useQueryParam('/progress-quiz/:quizId')
  const { quizIndex, selectedOption } = params

  const { data: quizzes } = useGetDocumentQuizzes({
    documentId: Number(quizId),
  })

  const handleOptionSelect = (option: string) => {
    // 옵션을 선택하면 즉시 결과 보여주기
    setParams({ ...params, selectedOption: option })
  }

  const handleNextQuestion = () => {
    setParams({ ...params, quizIndex: quizIndex + 1, selectedOption: null })
  }

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
              <StopWatch isRunning={selectedOption === null} />
            </div>
            <IcControl className="size-6 ml-auto" />
          </div>
        }
      />
      <ProgressBar current={quizIndex + 1} totalQuizCount={quizzes.length} />

      {/* 퀴즈 콘텐츠 영역 */}
      <div className="pt-10">
        <Question order={quizIndex + 1} question={currentQuiz.question} />
        <>
          {currentQuiz.quizType === 'MULTIPLE_CHOICE' && (
            <div className="pt-10 grid gap-2.5">
              {currentQuiz.options.map((option, index) => (
                <MultipleChoiceOption
                  key={option}
                  label={String.fromCharCode(65 + index)}
                  option={option}
                  isCorrect={option === currentQuiz.answer}
                  selectedOption={selectedOption}
                  onClick={() => handleOptionSelect(option)}
                />
              ))}
            </div>
          )}
          {currentQuiz.quizType === 'MIX_UP' && <div></div>}
        </>
      </div>

      {selectedOption && (
        <ResultPeekingDrawer
          currentQuiz={currentQuiz}
          handleNextQuestion={handleNextQuestion}
          selectedOption={selectedOption}
        />
      )}
    </div>
  )
}

const ResultPeekingDrawer = ({
  currentQuiz,
  handleNextQuestion,
  selectedOption,
}: {
  currentQuiz: Quiz
  handleNextQuestion: () => void
  selectedOption: string | null
}) => {
  const [open, setOpen] = useState(true)

  return (
    <PeekingDrawer
      open={open}
      onOpenChange={setOpen}
      fixedContent={
        <div className="pb-12">
          <Button onClick={handleNextQuestion}>다음</Button>
        </div>
      }
      className={cn(open ? (selectedOption === currentQuiz.answer ? 'bg-correct' : 'bg-incorrect') : 'bg-base-1')}
    >
      <PeekingDrawerContent>
        {selectedOption === currentQuiz.answer ? (
          <div className="px-5">
            <div className="flex items-center gap-3">
              <ImgRoundCorrect className="size-[48px]" />
              <Text typo="h2" color="correct">
                정답
              </Text>
            </div>
            <div className="pt-5">
              <Text typo="subtitle-2-bold" color="primary">
                정답: {currentQuiz.answer}
              </Text>
              <Text typo="body-1-medium" as="p" color="secondary">
                {currentQuiz.explanation}
              </Text>
            </div>
          </div>
        ) : (
          <div className="px-5">
            <div className="flex items-center gap-3">
              <ImgRoundIncorrect className="size-[48px]" />
              <Text typo="h2" color="incorrect">
                오답
              </Text>
            </div>
            <div className="pt-5">
              <Text typo="subtitle-2-bold" color="primary">
                정답: {currentQuiz.answer}
              </Text>
              <Text typo="body-1-medium" as="p" color="secondary">
                {currentQuiz.explanation}
              </Text>
            </div>
          </div>
        )}
      </PeekingDrawerContent>
    </PeekingDrawer>
  )
}
