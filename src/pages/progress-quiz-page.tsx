import { SetStateAction, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { MultipleChoiceOption } from '@/features/quiz/ui/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ui/ox-choice-option'
import { ProgressBar } from '@/features/quiz/ui/progress-bar'
import { QuizResultView } from '@/features/quiz/ui/quiz-result-view'
import { ResultIcon } from '@/features/quiz/ui/result-icon'
import { StopWatch } from '@/features/quiz/ui/stop-watch'

import { useGetQuizSet, useUpdateQuizResult } from '@/entities/quiz/api/hooks'
import { GetQuizSetQuizDto } from '@/entities/quiz/api/index'
import { Question } from '@/entities/quiz/ui/question'

import { IcControl } from '@/shared/assets/icon'
import { ImgExit, ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { PeekingDrawer, PeekingDrawerContent } from '@/shared/components/drawers/peeking-drawer'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogCTA, DialogContent } from '@/shared/components/ui/dialog'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { getLocalStorageItem, setLocalStorageItem } from '@/shared/lib/storage/lib'
import { cn } from '@/shared/lib/utils'

/**
 * 퀴즈 세트 타입
 */
export type QuizSetType = 'DOCUMENT_QUIZ_SET' | 'EXPLORE_QUIZ_SET' | 'FIRST_QUIZ_SET'

export type QuizResultCardData = {
  id: number
  question: string
  answer: string
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
  explanation?: string
  options?: string[]
  userAnswer: string
  elapsedTime: number
  isCorrect: boolean
}

// 각 퀴즈 결과 저장을 위한 타입
type QuizResult = {
  id: number
  answer: boolean
  choseAnswer: string
  elapsedTime: number
}

export const ProgressQuizPage = () => {
  const { quizSetId } = useParams()

  const [params, setParams] = useQueryParam('/progress-quiz/:quizSetId')
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  // 퀴즈 결과 저장
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])

  // 총 소요 시간
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0)

  const [quizResultCardDatas, setQuizResultCardDatas] = useState<QuizResultCardData[] | null>(null)

  // 현재 퀴즈 시작 시간
  const startTimeRef = useRef<number>(Date.now())

  // 결과 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: quizSetData } = useGetQuizSet(Number(quizSetId))

  const { mutateAsync: updateQuizResult } = useUpdateQuizResult(Number(params.documentId), Number(quizSetId))

  const [quizSetting, setQuizSetting] = useState<{
    autoNext: boolean
    hideTimeSpent: boolean
  }>(() => {
    const localQuizSetting = getLocalStorageItem('quizSetting')
    if (localQuizSetting) {
      return localQuizSetting as {
        autoNext: boolean
        hideTimeSpent: boolean
      }
    } else {
      return {
        autoNext: false,
        hideTimeSpent: false,
      }
    }
  })

  useEffect(() => {
    setLocalStorageItem('quizSetting', quizSetting)
  }, [quizSetting])

  const [resultIconState, setResultIconState] = useState({
    show: false,
    correct: false,
  })

  // 새로고침하면 처음으로 돌아감
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      quizIndex: 0,
      selectedOption: null,
    }))
  }, [])

  // 퀴즈 시작 시 시간 초기화
  useEffect(() => {
    if (params.selectedOption === null) {
      startTimeRef.current = Date.now()
    }
  }, [params.quizIndex, params.selectedOption])

  const handleOptionSelect = (option: string) => {
    if (params.selectedOption !== null || !quizSetData?.quizzes) return

    const currentQuiz = quizSetData.quizzes[params.quizIndex]
    const elapsedTime = Date.now() - startTimeRef.current
    const isCorrect = option === currentQuiz.answer

    if (isCorrect) {
      setResultIconState({ show: true, correct: true })
      setTimeout(() => {
        setResultIconState((prev) => ({
          ...prev,
          show: false,
        }))
      }, 400)
    } else {
      setResultIconState({ show: true, correct: false })
      setTimeout(() => {
        setResultIconState((prev) => ({
          ...prev,
          show: false,
        }))
      }, 400)
    }

    const quizResult: QuizResult = {
      id: currentQuiz.id,
      answer: isCorrect,
      choseAnswer: option,
      elapsedTime,
    }

    // 결과 상태 업데이트
    setQuizResults((prev) => {
      const newResults = [...prev, quizResult]

      // 마지막 문제이고 자동 넘김이 활성화된 경우
      if (params.quizIndex === quizSetData.quizzes.length - 1 && quizSetting.autoNext) {
        // 약간의 디레이 후 결과 제출 (상태 업데이트가 완료된 후)
        setTimeout(() => {
          submitQuizResults()
        }, 500)
      }

      return newResults
    })

    // 선택 결과 반영
    setParams({ ...params, selectedOption: option })

    if (quizSetting.autoNext) {
      setTimeout(() => {
        handleNextQuestion()
      }, 400)
    }
  }

  const handleNextQuestion = () => {
    if (!quizSetData?.quizzes) return

    // 마지막 문제라면 결과를 제출하고 보여줌
    if (params.quizIndex === quizSetData.quizzes.length - 1) {
      // 이미 선택한 문제의 결과가 quizResults에 있는지 확인
      // 마지막 문제의 결과가 이미 추가되었는지 확인
      const lastQuizResult = quizResults.find((result) => result.id === quizSetData.quizzes[params.quizIndex].id)

      if (lastQuizResult) {
        submitQuizResults()
      } else {
        // 마지막 문제의 결과가 없는 경우 - 이 경우는 발생하지 않아야 함
        console.warn('마지막 문제의 결과가 없습니다')
      }
      return
    }

    setParams({ ...params, quizIndex: params.quizIndex + 1, selectedOption: null })
  }

  // 퀴즈 결과 제출
  const submitQuizResults = async () => {
    if (isSubmitting || !quizSetData?.quizzes) return

    try {
      setIsSubmitting(true)

      const requestData = {
        quizSetId: quizSetId || '',
        quizSetType: params.quizSetType,
        quizzes: quizResults,
      }

      const result = await updateQuizResult(requestData)

      // 총 소요 시간 저장
      setTotalElapsedTime(result.totalElapsedTime)

      // 퀴즈 결과 데이터 생성
      const quizResultCardDatas = quizSetData.quizzes.map((quiz) => {
        const userResult = quizResults.find((qr) => qr.id === quiz.id)
        if (!userResult) {
          console.error(`퀴즈 ID ${quiz.id}에 대한 결과가 없습니다`)
          // 오류 대신 기본값 사용
          return {
            ...quiz,
            userAnswer: '',
            elapsedTime: 0,
            isCorrect: false,
          }
        }
        return {
          ...quiz,
          userAnswer: userResult.choseAnswer,
          elapsedTime: userResult.elapsedTime,
          isCorrect: userResult.answer,
        }
      })

      // 결과 데이터 설정
      setQuizResultCardDatas(quizResultCardDatas)
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

  return !!quizResultCardDatas ? (
    <QuizResultView totalElapsedTime={totalElapsedTime} quizWithResultData={quizResultCardDatas} />
  ) : (
    <div className="min-h-screen bg-surface-1">
      <Header
        left={<BackButton type="close" onClick={() => setExitDialogOpen(true)} />}
        content={
          <div>
            {!quizSetting.hideTimeSpent && (
              <div className="center">
                <StopWatch isRunning={params.selectedOption === null} />
              </div>
            )}
            <QuizSettingDrawer quizSetting={quizSetting} setQuizSetting={setQuizSetting} />
          </div>
        }
      />

      <HeaderOffsetLayout className="pt-[var(--header-height-safe)]">
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
                    animationDelay={index * 60}
                    onClick={() => handleOptionSelect(option)}
                    className={cn(params.selectedOption !== null && 'pointer-events-none')}
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

        {params.selectedOption && !quizSetting.autoNext && (
          <ResultPeekingDrawer
            currentQuiz={currentQuiz}
            handleNextQuestion={handleNextQuestion}
            selectedOption={params.selectedOption}
          />
        )}

        <ExitDialog exitDialogOpen={exitDialogOpen} setExitDialogOpen={setExitDialogOpen} />

        {resultIconState.show && <ResultIcon correct={resultIconState.correct} />}
      </HeaderOffsetLayout>
    </div>
  )
}

const QuizSettingDrawer = ({
  quizSetting,
  setQuizSetting,
}: {
  quizSetting: { autoNext: boolean; hideTimeSpent: boolean }
  setQuizSetting: React.Dispatch<SetStateAction<{ autoNext: boolean; hideTimeSpent: boolean }>>
}) => {
  const [params] = useQueryParam('/progress-quiz/:quizSetId')
  const [isOpen, setIsOpen] = useState(false)

  const [tempSettings, setTempSettings] = useState({
    autoNext: quizSetting.autoNext,
    hideTimeSpent: quizSetting.hideTimeSpent,
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setTempSettings({
        autoNext: quizSetting.autoNext,
        hideTimeSpent: quizSetting.hideTimeSpent,
      })
    }
  }

  // 해설이 존재하는 상태에서는 바로 autoNext를 on시키지 않는다. 이때는 다음 문제부터 적용된다.
  const applySettings = () => {
    setIsOpen(false)

    if (params.selectedOption != null) {
      setQuizSetting((prev) => ({
        ...prev,
        hideTimeSpent: tempSettings.hideTimeSpent,
      }))
    } else {
      setQuizSetting({
        autoNext: tempSettings.autoNext,
        hideTimeSpent: tempSettings.hideTimeSpent,
      })
    }
  }
  // 해설이 존재하는 상태에서는 바로 autoNext를 on시키지 않는다. 이때는 다음 문제부터 적용된다.
  useEffect(() => {
    if (params.selectedOption === null) {
      setQuizSetting((prev) => ({
        ...prev,
        autoNext: tempSettings.autoNext,
      }))
    }
  }, [params.selectedOption])

  return (
    <AlertDrawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={<IcControl role="button" className="size-6 ml-auto cursor-pointer" />}
      title="퀴즈 설정"
      hasClose={false}
      height="md"
      body={
        <div className="py-8 grid gap-5">
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
      }
      footer={
        <div className="h-[114px] pt-[14px]">
          <Button onClick={applySettings}>적용하기</Button>
        </div>
      }
    />
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
