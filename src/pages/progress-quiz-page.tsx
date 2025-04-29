import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { MultipleChoiceOption } from '@/features/quiz/ui/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ui/ox-choice-option'
import { ProgressBar } from '@/features/quiz/ui/progress-bar'
import { StopWatch } from '@/features/quiz/ui/stop-watch'

import { useGetQuizSet, useUpdateQuizResult } from '@/entities/quiz/api/hooks'
import { GetQuizSetQuizDto } from '@/entities/quiz/api/index'
import { Question } from '@/entities/quiz/ui/question'

import { IcControl } from '@/shared/assets/icon'
import { ImgExit, ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { PeekingDrawer, PeekingDrawerContent } from '@/shared/components/drawers/peeking-drawer'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogCTA,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

/**
 * 퀴즈 세트 타입
 */
export type QuizSetType = 'TODAY_QUIZ_SET' | 'DOCUMENT_QUIZ_SET' | 'COLLECTION_QUIZ_SET' | 'FIRST_QUIZ_SET'

// 각 퀴즈 결과 저장을 위한 타입
type QuizResult = {
  id: number
  answer: boolean
  choseAnswer: string
  elapsedTime: number
}

export const ProgressQuizPage = () => {
  const { quizSetId } = useParams()
  const router = useRouter()

  const [params, setParams] = useQueryParam('/progress-quiz/:quizSetId')
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  // 퀴즈 결과 저장
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])

  // 마지막 문제 선택 완료 여부 플래그
  const [isQuizComplete, setIsQuizComplete] = useState(false)

  // 현재 퀴즈 시작 시간
  const startTimeRef = useRef<number>(Date.now())

  // 결과 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: quizSetData } = useGetQuizSet(Number(quizSetId))

  const { mutateAsync: updateQuizResult } = useUpdateQuizResult(Number(params.documentId), Number(quizSetId))

  // 퀴즈 시작 시 시간 초기화
  useEffect(() => {
    if (params.selectedOption === null) {
      startTimeRef.current = Date.now()
    }
  }, [params.quizIndex, params.selectedOption])

  // 마지막 문제 결과가 모두 채워졌을 때 제출 처리
  useEffect(() => {
    if (isQuizComplete && quizSetData?.quizzes && quizResults.length === quizSetData.quizzes.length && !isSubmitting) {
      submitQuizResults()
    }
  }, [isQuizComplete, quizResults, quizSetData, isSubmitting])

  const handleOptionSelect = (option: string) => {
    if (params.selectedOption !== null || !quizSetData?.quizzes) return

    const currentQuiz = quizSetData.quizzes[params.quizIndex]
    const elapsedTime = Date.now() - startTimeRef.current
    const isCorrect = option === currentQuiz.answer

    const quizResult: QuizResult = {
      id: currentQuiz.id,
      answer: isCorrect,
      choseAnswer: option,
      elapsedTime,
    }

    // 결과 상태 업데이트
    setQuizResults((prev) => [...prev, quizResult])
    // 선택 결과 반영
    setParams({ ...params, selectedOption: option })

    // 마지막 문제인 경우 완료 플래그 설정
    if (params.quizIndex === quizSetData.quizzes.length - 1) {
      setIsQuizComplete(true)
    } else if (params.autoNext) {
      setTimeout(() => {
        handleNextQuestion()
      }, 400)
    }
  }

  const handleNextQuestion = () => {
    if (!quizSetData?.quizzes) return

    // 마지막 문제라면 제출 플래그를 설정 (useEffect에서 제출)
    if (params.quizIndex === quizSetData.quizzes.length - 1) {
      setIsQuizComplete(true)
      return
    }

    setParams({ ...params, quizIndex: params.quizIndex + 1, selectedOption: null })
  }

  // 퀴즈 결과 제출 (quizResults 상태를 그대로 사용)
  const submitQuizResults = async () => {
    if (isSubmitting || !quizSetData?.quizzes || quizResults.length === 0) return

    try {
      setIsSubmitting(true)

      const requestData = {
        quizSetId: quizSetId || '',
        quizSetType: params.quizSetType,
        quizzes: quizResults,
      }

      const result = await updateQuizResult(requestData)

      const quizWithResults = quizSetData.quizzes.map((quiz) => {
        const userResult = quizResults.find((qr) => qr.id === quiz.id)
        if (!userResult) {
          throw new Error('User result not found')
        }
        return {
          ...quiz,
          totalElapsedTime: result.totalElapsedTime,
          userAnswer: userResult.choseAnswer,
          isCorrect: userResult.answer,
        }
      })

      const quizWithResultDataEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(quizWithResults))))

      router.replace('/quiz-result', {
        search: {
          quizSetId: Number(quizSetId ?? 0),
          quizSetType: params.quizSetType,
          totalElapsedTime: result.totalElapsedTime,
          quizWithResultDataEncoded: quizWithResultDataEncoded,
        },
      })
    } catch (error) {
      console.error('퀴즈 결과 제출 실패:', error)
      alert('퀴즈 결과 제출에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!quizSetData?.quizzes) {
    return <div className="center">Loading...</div>
  }

  const currentQuiz = quizSetData.quizzes[params.quizIndex]

  return (
    <div className="min-h-screen bg-surface-1">
      <Header
        left={<BackButton type="close" onClick={() => setExitDialogOpen(true)} />}
        content={
          <div>
            {!params.hideTimeSpent && (
              <div className="center">
                <StopWatch isRunning={params.selectedOption === null} />
              </div>
            )}
            <QuizSettingDialog />
          </div>
        }
      />

      <HeaderOffsetLayout>
        <div className="px-4">
          <ProgressBar current={params.quizIndex + 1} totalQuizCount={quizSetData.quizzes.length} />
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
                    isCorrect={currentQuiz.answer === (index === 0 ? 'correct' : 'incorrect')}
                    selectedOption={params.selectedOption}
                    onClick={() => handleOptionSelect(index === 0 ? 'correct' : 'incorrect')}
                    className="flex-1"
                  />
                ))}
              </div>
            )}
          </>
        </div>

        {params.selectedOption && !params.autoNext && (
          <ResultPeekingDrawer
            currentQuiz={currentQuiz}
            handleNextQuestion={handleNextQuestion}
            selectedOption={params.selectedOption}
          />
        )}

        <ExitDialog exitDialogOpen={exitDialogOpen} setExitDialogOpen={setExitDialogOpen} />
      </HeaderOffsetLayout>
    </div>
  )
}

const QuizSettingDialog = () => {
  const [params, setParams] = useQueryParam('/progress-quiz/:quizSetId')
  const [isOpen, setIsOpen] = useState(false)

  const [tempSettings, setTempSettings] = useState({
    autoNext: params.autoNext,
    hideTimeSpent: params.hideTimeSpent,
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setTempSettings({
        autoNext: params.autoNext,
        hideTimeSpent: params.hideTimeSpent,
      })
    }
  }

  const applySettings = () => {
    setParams({
      ...params,
      autoNext: tempSettings.autoNext,
      hideTimeSpent: tempSettings.hideTimeSpent,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <IcControl role="button" className="size-6 ml-auto cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="text-center w-[308px]">
        <DialogTitle>퀴즈 설정</DialogTitle>
        <DialogDescription>설정은 이번 문제부터 적용돼요</DialogDescription>

        <div className="mt-4 py-5 px-10 grid gap-4">
          <div className="flex items-center justify-between">
            <Text typo="subtitle-2-medium" color="primary">
              문제 바로 넘기기
            </Text>
            <Switch
              checked={tempSettings.autoNext}
              onCheckedChange={(checked) => setTempSettings({ ...tempSettings, autoNext: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Text typo="subtitle-2-medium" color="primary">
              소요시간 숨기기
            </Text>
            <Switch
              checked={tempSettings.hideTimeSpent}
              onCheckedChange={(checked) => setTempSettings({ ...tempSettings, hideTimeSpent: checked })}
            />
          </div>
        </div>

        <DialogCTA label="적용하기" onClick={applySettings} className="mt-[60px]" />
      </DialogContent>
    </Dialog>
  )
}

const ResultPeekingDrawer = ({
  currentQuiz,
  handleNextQuestion,
  selectedOption,
}: {
  currentQuiz: GetQuizSetQuizDto
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
