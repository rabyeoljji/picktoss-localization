import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { usePullToRefresh } from '@/features/quiz/hooks/use-pull-to-refresh'
import { InfoCarousel } from '@/features/quiz/ui/banner'
import { DailyQuizTooltip } from '@/features/quiz/ui/daliy-quiz-tooltip'
import { MultipleChoiceOption } from '@/features/quiz/ui/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ui/ox-choice-option'
import { QuizSettingDrawer } from '@/features/quiz/ui/quiz-setting-drawer'
import { ResultIcon } from '@/features/quiz/ui/result-icon'

import { CreateDailyQuizRecordResponse, GetAllQuizzesResponse } from '@/entities/quiz/api'
import { useCreateDailyQuizRecord, useGetConsecutiveSolvedDailyQuiz, useGetQuizzes } from '@/entities/quiz/api/hooks'

import { IcFile, IcPagelink, IcProfile, IcRefresh, IcSearch } from '@/shared/assets/icon'
import { ImgPush, ImgRoundIncorrect, ImgStar } from '@/shared/assets/images'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/shared/components/ui/drawer'
import Loading from '@/shared/components/ui/loading'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useMessaging } from '@/shared/hooks/use-messaging'
import { usePWA } from '@/shared/hooks/use-pwa'
import { checkNotificationPermission } from '@/shared/lib/notification'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

type Quiz = GetAllQuizzesResponse['quizzes'][number]

const HomePage = () => {
  const router = useRouter()

  // 알림 관련 설정
  const [openNotification, setOpenNotification] = useState(false)
  const { isPWA } = usePWA()

  // 메인 퀴즈 상태 관리
  const [quizzes, setQuizzes] = useState<Quiz[]>()
  // 백그라운드 퀴즈 캐시 (리페치된 퀴즈를 임시 저장)
  const backgroundQuizzesRef = useRef<Quiz[]>([])

  const [displayQuizType] = useQueryParam('/', 'displayQuizType')

  const { data: quizData, isLoading, refetch } = useGetQuizzes()

  useEffect(() => {
    setQuizState((prev) => ({
      ...prev,
      status: 'idle',
      selectedAnswer: null,
    }))
    setQuizzes(quizData?.quizzes.filter((quiz) => quiz.quizType === displayQuizType || displayQuizType === 'ALL') ?? [])
  }, [quizData, displayQuizType])

  const { isRefreshing, pullDistance, handleDrag, handleDragEnd } = usePullToRefresh(() => refetch())

  // 백그라운드 리페치 상태 관리
  const isBackgroundRefetchingRef = useRef(false)
  // 퀴즈 전환 애니메이션 상태
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [dailyQuizRecord, setDailyQuizRecord] = useState<Partial<CreateDailyQuizRecordResponse>>()
  const { data: consecutiveSolvedDailyQuiz } = useGetConsecutiveSolvedDailyQuiz()

  useEffect(() => {
    setDailyQuizRecord({
      consecutiveSolvedDailyQuizDays: consecutiveSolvedDailyQuiz ?? 0,
    })
  }, [consecutiveSolvedDailyQuiz])

  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false)
  const [quizState, setQuizState] = useState<{
    selectedAnswer: string | null
    status: 'idle' | 'selected' | 'incorrect'
  }>({
    selectedAnswer: null,
    status: 'idle',
  })

  // 결과 아이콘 표시 상태를 관리하는 state
  const [resultIconState, setResultIconState] = useState({
    show: false,
    correct: false,
  })

  const [rewardDrawerOpen, setRewardDrawerOpen] = useState(false)

  useEffect(() => {
    if (dailyQuizRecord && (dailyQuizRecord.reward ?? 0) > 0) {
      setRewardDrawerOpen(true)
    }
  }, [dailyQuizRecord])

  const { mutate: createDailyQuizRecord } = useCreateDailyQuizRecord()

  // 문제를 거의 다 풀었을 때 백그라운드에서 새로운 문제를 가져오는 함수
  const fetchMoreQuizzesInBackground = async () => {
    // 이미 백그라운드 리페치가 진행 중이면 중복 실행 방지
    if (isBackgroundRefetchingRef.current) return

    isBackgroundRefetchingRef.current = true

    try {
      const newQuizzesData = await refetch()

      if (newQuizzesData.data) {
        // 백그라운드 캐시에 새 퀴즈 저장 (화면 깜빡임 방지)
        const currentQuizzes = quizzes || []

        // 중복 퀴즈 필터링
        const newQuizzes = newQuizzesData.data.quizzes.filter(
          (newQuiz) => !currentQuizzes.some((existingQuiz) => existingQuiz.id === newQuiz.id),
        )

        // 백그라운드 캐시 업데이트
        backgroundQuizzesRef.current = newQuizzes
      }
    } catch (error) {
      console.error('백그라운드 문제 가져오기 실패:', error)
    } finally {
      isBackgroundRefetchingRef.current = false
    }
  }

  const moveToNextQuiz = (quiz: Quiz) => {
    // 전환 애니메이션 시작
    setIsTransitioning(true)

    // 애니메이션 완료 후 상태 업데이트 (깜빡임 방지)
    setTimeout(() => {
      setQuizzes((prev) => {
        if (!prev) return prev

        // 현재 문제를 제거한 후 남은 문제 수 확인
        const remainingQuizzes = prev.filter((q) => q.id !== quiz.id)

        // 남은 문제가 2개 이하일 경우 백그라운드에서 새 문제 가져오기
        if (remainingQuizzes.length <= 2 && !isBackgroundRefetchingRef.current) {
          fetchMoreQuizzesInBackground()
        }

        // 남은 문제가 1개이고 백그라운드 캐시에 문제가 있으면 병합
        if (remainingQuizzes.length <= 1 && backgroundQuizzesRef.current.length > 0) {
          return [...remainingQuizzes, ...backgroundQuizzesRef.current]
        }

        return remainingQuizzes
      })

      setQuizState((prev) => ({
        ...prev,
        status: 'idle',
        selectedAnswer: null,
      }))

      // 전환 애니메이션 종료
      setIsTransitioning(false)
    }, 300) // 애니메이션 지속 시간과 일치시킴
  }

  const handleClickOption = ({ quiz, selectOption }: { quiz: Quiz; selectOption: string }) => {
    createDailyQuizRecord(
      {
        quizId: quiz.id,
        choseAnswer: selectOption,
        isAnswer: quiz.answer === selectOption,
      },
      {
        onSuccess: (data) => setDailyQuizRecord(data),
        onSettled: () => {
          if (checkNotificationPermission() || !isPWA) return // 이미 권한 설정을 한 경우라면 알림 요청하지 않음
          setOpenNotification(true)
        },
      },
    )

    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: selectOption,
      status: 'selected',
    }))

    if (quiz.answer === selectOption) {
      setResultIconState({ show: true, correct: true })
      setTimeout(() => {
        moveToNextQuiz(quiz)
      }, 1000)
    } else {
      setResultIconState({ show: true, correct: false })
      setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          selectedAnswer: selectOption,
          status: 'incorrect',
        }))
      }, 1000)
    }
  }

  const currQuiz = quizzes?.[0]

  const consecutiveSolvedDailyQuizDays = dailyQuizRecord?.consecutiveSolvedDailyQuizDays
  const todaySolvedDailyQuizCount = dailyQuizRecord?.todaySolvedDailyQuizCount

  // 정답/오답 아이콘 표시 후 ~초 후에 사라지게 하는 효과
  useEffect(() => {
    if (resultIconState.show) {
      const timer = setTimeout(() => {
        setResultIconState({ show: false, correct: false })
      }, 550)

      return () => clearTimeout(timer)
    }
  }, [resultIconState.show])

  return (
    <>
      <Header
        content={
          <div className="flex items-center">
            <div className="flex items-center">
              <button className="p-2 flex-center">
                <IcProfile className="size-6 text-icon-secondary" />
              </button>

              <DailyQuizTooltip
                consecutiveSolvedDailyQuizDays={consecutiveSolvedDailyQuizDays ?? 0}
                todaySolvedDailyQuizCount={todaySolvedDailyQuizCount ?? 0}
              />
            </div>
            <div className="ml-auto">
              <button className="p-2 flex-center">
                <IcSearch className="size-6 text-icon-secondary" />
              </button>
            </div>
          </div>
        }
        className="bg-surface-2"
      />

      {!isLoading && quizzes?.length === 0 && <InfoCarousel />}

      {currQuiz && (
        <HeaderOffsetLayout className="px-3">
          {!isRefreshing ? (
            <Text
              typo="subtitle-1-bold"
              color="sub"
              className="absolute right-1/2 translate-x-1/2 pt-[16px] whitespace-nowrap"
            >
              당겨서 새 문제 가져오기...💡
            </Text>
          ) : (
            <div className="absolute right-1/2 translate-x-1/2 pt-[16px] flex items-center gap-2">
              <Loading size="xs" />
            </div>
          )}

          <motion.div
            className={cn(
              'mt-1 shadow-[var(--shadow-md)] rounded-[24px] px-4 pt-7 pb-6 bg-surface-1 relative overflow-hidden z-50 h-[62svh]',
              quizState.status === 'incorrect' && 'px-[32px] pt-[64px] pb-6',
            )}
            key={currQuiz.id}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            initial={{ opacity: isTransitioning ? 0 : 1, x: isTransitioning ? 100 : 0 }}
            animate={{
              opacity: 1,
              x: 0,
              y: isRefreshing ? pullDistance : 0,
            }}
            transition={{
              opacity: { duration: 0.3 },
              x: { duration: 0.3 },
              y: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
              },
            }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <QuizSettingDrawer open={settingDrawerOpen} onOpenChange={setSettingDrawerOpen} />

            {quizState.status !== 'incorrect' ? (
              <>
                <motion.div
                  className="h-[152px] w-[80%] mx-auto flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tag size="md">{currQuiz.name}</Tag>
                  <Text typo="question" className="mt-3 text-center whitespace-pre-wrap break-keep">
                    {currQuiz.question}
                  </Text>
                </motion.div>

                <div className="mt-2">
                  {currQuiz.quizType === 'MIX_UP' ? (
                    <div className="flex items-center gap-3 pt-10">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <OXChoiceOption
                          key={index}
                          O={index === 0}
                          X={index === 1}
                          isCorrect={currQuiz.answer === (index === 0 ? 'correct' : 'incorrect')}
                          selectedOption={quizState.selectedAnswer}
                          onClick={() =>
                            handleClickOption({ quiz: currQuiz, selectOption: index === 0 ? 'correct' : 'incorrect' })
                          }
                          className={cn(
                            'flex-1 aspect-[153.5/126]',
                            quizState.status !== 'idle' && 'pointer-events-none',
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {currQuiz.options.map((option, index) => (
                        <MultipleChoiceOption
                          key={option}
                          label={String.fromCharCode(65 + index)}
                          option={option}
                          isCorrect={option === currQuiz.answer}
                          selectedOption={quizState.selectedAnswer}
                          animationDelay={index * 60}
                          onClick={() => handleClickOption({ quiz: currQuiz, selectOption: option })}
                          className={cn(quizState.status !== 'idle' && 'pointer-events-none')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <IncorrectAnswerBody
                currQuiz={currQuiz}
                moveToNextQuiz={moveToNextQuiz}
                settingDrawerOpen={settingDrawerOpen}
                setSettingDrawerOpen={setSettingDrawerOpen}
              />
            )}
            {resultIconState.show && <ResultIcon correct={resultIconState.correct} />}
          </motion.div>
        </HeaderOffsetLayout>
      )}

      {/* 알림 권한 허용 drawer */}
      <NotificationDrawer open={openNotification} onOpenChange={setOpenNotification} />

      <div className="px-4">
        <button
          className="absolute bg-base-3 rounded-full bottom-[calc(var(--spacing-tab-navigation)+12px)] h-[48px] w-[calc(100%-32px)]"
          onClick={() =>
            router.push('/note/create', {
              search: {
                documentType: 'TEXT',
              },
            })
          }
        >
          <Text typo="subtitle-2-medium" color="sub" className="center">
            새로운 퀴즈 만들기...
          </Text>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push('/note/create', {
                search: {
                  documentType: 'FILE',
                },
              })
            }}
            className="flex-center bg-orange-500 rounded-full size-10 absolute right-1 bottom-1/2 translate-y-1/2"
          >
            <IcFile className="size-5 text-white" />
          </button>
        </button>
      </div>

      <AlertDrawer
        open={rewardDrawerOpen}
        onOpenChange={setRewardDrawerOpen}
        hasClose={false}
        body={
          <div className="pt-5">
            <ImgStar className="size-[120px] mx-auto" />
            <Text typo="h2" className="mt-4 text-center">
              연속 <span className="text-accent">{dailyQuizRecord?.consecutiveSolvedDailyQuizDays}일</span> 완료
            </Text>
            <Text typo="body-1-medium" color="sub" className="mt-2 text-center">
              <span className="text-accent">{dailyQuizRecord?.reward}개</span>의 별을 획득했어요!
            </Text>
            <div className="mt-10 px-4">
              <Button onClick={() => setRewardDrawerOpen(false)}>확인</Button>
            </div>
          </div>
        }
      />
    </>
  )
}

const IncorrectAnswerBody = ({
  currQuiz,
  moveToNextQuiz,
}: {
  currQuiz: Quiz
  moveToNextQuiz: (currQuiz: Quiz) => void
  settingDrawerOpen: boolean
  setSettingDrawerOpen: (open: boolean) => void
}) => {
  return (
    <>
      <div className="flex items-center justify-start gap-3 w-fit">
        <ImgRoundIncorrect className="size-[48px]" />
        <Text typo="h2" color="incorrect">
          오답
        </Text>
      </div>

      <div className="py-[24px]">
        <div className="w-full h-px bg-gray-100" />
      </div>

      <div className="grid gap-3">
        <Text typo="subtitle-1-bold">
          정답: {currQuiz.quizType === 'MULTIPLE_CHOICE' ? currQuiz.answer : currQuiz.answer === 'correct' ? 'O' : 'X'}
        </Text>
        <Text typo="body-1-medium" as="p" color="secondary">
          {currQuiz.explanation}
        </Text>
        <div className="mt-[24px] flex items-center">
          <Text typo="body-1-medium" color="sub">
            출처
          </Text>

          <div className="h-[12px] w-px bg-gray-100 mx-2" />

          <div className="flex items-center gap-1">
            <Text typo="body-1-medium" color="sub">
              {currQuiz.name}
            </Text>
            <IcPagelink className="size-4 text-icon-sub" />
          </div>
        </div>
      </div>

      <Button
        variant="tertiary"
        left={<IcRefresh />}
        size="md"
        className="absolute bottom-[80px] w-[120px] right-1/2 translate-x-1/2"
        onClick={() => {
          moveToNextQuiz(currQuiz!)
        }}
      >
        문제 전환
      </Button>
    </>
  )
}

const NotificationDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) => {
  const { setupMessaging, isReadyNotification } = useMessaging()

  useEffect(() => {
    console.log('알림 준비: ' + isReadyNotification)
  }, [isReadyNotification])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent height="md" hasHandle={false} className="flex flex-col items-center">
        <DrawerHeader className="w-full flex-center flex-col gap-[8px] py-[10px]">
          <Text typo="h4" className="text-center">
            푸시 알림 허용 안내
          </Text>
          <Text typo="subtitle-2-medium" color="sub" className="text-center">
            다음 단계에서 알림을 허용하시면
            <br />
            매일 잊지 않고 퀴즈를 풀 수 있어요
          </Text>
        </DrawerHeader>

        <ImgPush height={200} width={301.25} />

        <DrawerFooter className="w-full pt-[14px] px-[20px] h-[90px] flex flex-col">
          <Button onClick={async () => await setupMessaging(() => onOpenChange(false))}>설정하기</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default withHOC(HomePage, {
  activeTab: '데일리',
  backgroundClassName: 'bg-surface-2',
})
