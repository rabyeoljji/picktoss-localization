import { useState } from 'react'
import { useParams } from 'react-router'

import { MultipleChoiceOption } from '@/features/quiz/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ox-choice-option'
import { ProgressBar } from '@/features/quiz/progress-bar'
import { StopWatch } from '@/features/quiz/stop-watch'

import { useGetDocumentQuizzes } from '@/entities/document/api/hooks'
import { Question } from '@/entities/quiz/ui/question'

import { IcControl } from '@/shared/assets/icon'
import { ImgExit, ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { PeekingDrawer, PeekingDrawerContent } from '@/shared/components/drawers/peeking-drawer'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogCTA, DialogContent } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'
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
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  const { data: quizzes } = useGetDocumentQuizzes({
    documentId: Number(quizId),
  })

  const handleOptionSelect = (option: string) => {
    // 옵션을 선택하면 즉시 결과 보여주기
    setParams({ ...params, selectedOption: option })
  }

  const handleNextQuestion = () => {
    setParams({ ...params, quizIndex: params.quizIndex + 1, selectedOption: null })
  }

  if (!quizzes) {
    return <div className="center">Loading...</div>
  }

  const currentQuiz = quizzes[params.quizIndex]
  console.log(currentQuiz)

  return (
    <div className="min-h-screen bg-surface-1">
      <Header
        left={<BackButton type="close" onClick={() => setExitDialogOpen(true)} />}
        content={
          <div>
            <div className="center">
              <StopWatch isRunning={params.selectedOption === null} />
            </div>
            <IcControl className="size-6 ml-auto" />
          </div>
        }
      />
      <div className="px-4">
        <ProgressBar current={params.quizIndex + 1} totalQuizCount={quizzes.length} />
      </div>

      {/* 퀴즈 콘텐츠 영역 */}
      <div className="pt-10 px-4">
        <Question order={params.quizIndex + 1} question={currentQuiz.question} />
        <>
          {currentQuiz.quizType === 'MULTIPLE_CHOICE' && (
            <div className="pt-10 grid gap-2.5">
              {currentQuiz.options.map((option, index) => (
                <MultipleChoiceOption
                  key={option}
                  label={String.fromCharCode(65 + index)}
                  option={option}
                  isCorrect={option === currentQuiz.answer}
                  selectedOption={params.selectedOption}
                  onClick={() => handleOptionSelect(option)}
                />
              ))}
            </div>
          )}
          {currentQuiz.quizType === 'MIX_UP' && (
            <div className="flex items-center gap-3 pt-10">
              {Array.from({ length: 2 }).map((_, index) => (
                <OXChoiceOption
                  key={index}
                  O={index === 0}
                  X={index === 1}
                  selectedOption={params.selectedOption}
                  onClick={() => handleOptionSelect(currentQuiz.answer)}
                  className="flex-1"
                />
              ))}
            </div>
          )}
        </>
      </div>

      {params.selectedOption && (
        <ResultPeekingDrawer
          currentQuiz={currentQuiz}
          handleNextQuestion={handleNextQuestion}
          selectedOption={params.selectedOption}
        />
      )}

      <ExitDialog exitDialogOpen={exitDialogOpen} setExitDialogOpen={setExitDialogOpen} />
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

const ExitDialog = ({
  exitDialogOpen,
  setExitDialogOpen,
}: {
  exitDialogOpen: boolean
  setExitDialogOpen: (open: boolean) => void
}) => {
  const router = useRouter()

  return (
    <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
      <DialogContent>
        <div className="flex-center flex-col text-center gap-4">
          <ImgExit className="size-[120px]" />
          <div className="grid gap-2">
            <Text typo="h4" color="primary">
              퀴즈에서 나가시겠어요?
            </Text>
            <Text typo="subtitle-2-medium" color="sub">
              현재까지 푼 퀴즈는 기록되지 않아요
            </Text>
          </div>
        </div>

        <DialogCTA.B
          className="pt-10"
          onPrimaryButtonClick={() => router.back()}
          onSecondaryButtonClick={() => setExitDialogOpen(false)}
          primaryButtonLabel="나가기"
          secondaryButtonLabel="계속하기"
        />
      </DialogContent>
    </Dialog>
  )
}
