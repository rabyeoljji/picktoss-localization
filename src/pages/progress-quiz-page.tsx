import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { MultipleChoiceOption } from '@/features/quiz/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ox-choice-option'
import { ProgressBar } from '@/features/quiz/progress-bar'
import { StopWatch } from '@/features/quiz/stop-watch'

import { useGetDocumentQuizzes } from '@/entities/document/api/hooks'
import { updateQuizResult } from '@/entities/quiz/api'
import { Question } from '@/entities/quiz/ui/question'

import { IcControl } from '@/shared/assets/icon'
import { ImgExit, ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { PeekingDrawer, PeekingDrawerContent } from '@/shared/components/drawers/peeking-drawer'
import { Header } from '@/shared/components/header/header'
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

export type QuizSetType = 'TODAY_QUIZ_SET' | 'DOCUMENT_QUIZ_SET' | 'COLLECTION_QUIZ_SET' | 'FIRST_QUIZ_SET'

// 각 퀴즈 결과 저장을 위한 타입
type QuizResult = {
  id: number
  answer: boolean
  choseAnswer: string
  elapsedTime: number
}

export const ProgressQuizPage = () => {
  const { quizId } = useParams()
  const router = useRouter()

  const [params, setParams] = useQueryParam('/progress-quiz/:quizId')
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  // 퀴즈 결과 저장
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])

  // 현재 퀴즈 시작 시간
  const startTimeRef = useRef<number>(Date.now())

  // 결과 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: quizzes } = useGetDocumentQuizzes({
    documentId: Number(quizId),
  })

  // 퀴즈 시작 시 시간 초기화
  useEffect(() => {
    if (params.selectedOption === null) {
      startTimeRef.current = Date.now()
    }
  }, [params.quizIndex, params.selectedOption])

  const handleOptionSelect = (option: string) => {
    if (params.selectedOption !== null || !quizzes) return

    // 현재 퀴즈
    const currentQuiz = quizzes[params.quizIndex]

    // 소요 시간 계산 (밀리초)
    const elapsedTime = Date.now() - startTimeRef.current

    // 정답 여부 확인
    const isCorrect =
      currentQuiz.quizType === 'MULTIPLE_CHOICE' ? option === currentQuiz.answer : option === currentQuiz.answer

    // 퀴즈 결과 저장
    const quizResult: QuizResult = {
      id: currentQuiz.id,
      answer: isCorrect,
      choseAnswer: option,
      elapsedTime,
    }

    setQuizResults((prev) => [...prev, quizResult])

    // 옵션을 선택하면 즉시 결과 보여주기
    setParams({ ...params, selectedOption: option })

    if (params.autoNext) {
      setTimeout(() => {
        handleNextQuestion()
      }, 400)
    }
  }

  const handleNextQuestion = () => {
    if (!quizzes) return

    // 마지막 문제인 경우
    if (params.quizIndex === quizzes.length - 1) {
      submitQuizResults()
      return
    }

    setParams({ ...params, quizIndex: params.quizIndex + 1, selectedOption: null })
  }

  // 퀴즈 결과 제출
  const submitQuizResults = async () => {
    if (isSubmitting || !quizzes || quizResults.length === 0) return

    try {
      setIsSubmitting(true)

      // API 요청 데이터 구성
      const requestData = {
        quizSetId: quizId || '',
        quizSetType: 'DOCUMENT_QUIZ_SET' as QuizSetType, // 문서 기반 퀴즈
        quizzes: quizResults,
      }

      // 결과 제출 API 호출
      const result = await updateQuizResult({ data: requestData })

      // 퀴즈 데이터와 사용자 응답을 함께 전달
      const quizWithResults = quizzes.map((quiz) => {
        const userResult = quizResults.find((qr) => qr.id === quiz.id)
        return {
          ...quiz,
          userAnswer: userResult?.choseAnswer || null,
          elapsedTime: userResult?.elapsedTime || 0,
          isCorrect: userResult?.answer || false,
        }
      })

      // 퀴즈 데이터를 Base64로 인코딩
      const quizDataEncoded = btoa(JSON.stringify(quizWithResults))

      // 결과 페이지로 이동
      router.push('/quiz-result', {
        search: {
          quizSetId: quizId,
          quizSetType: 'DOCUMENT_QUIZ_SET',
          reward: result.reward,
          quizDataEncoded: quizDataEncoded,
        },
      })
    } catch (error) {
      console.error('퀴즈 결과 제출 실패:', error)
      alert('퀴즈 결과 제출에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!quizzes) {
    return <div className="center">Loading...</div>
  }

  const currentQuiz = quizzes[params.quizIndex]

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
    </div>
  )
}

const QuizSettingDialog = () => {
  const [params, setParams] = useQueryParam('/progress-quiz/:quizId')
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
