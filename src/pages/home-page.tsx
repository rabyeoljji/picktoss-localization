import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'
import OnBoarding from '@/app/on-boarding'

import { useOnboardingStore } from '@/features/onboarding/model/onboarding-store'
import { usePullToRefresh } from '@/features/quiz/hooks/use-pull-to-refresh'
import { DailyGuide } from '@/features/quiz/ui/banner'
import { DailyQuizTooltip } from '@/features/quiz/ui/daliy-quiz-tooltip'
import { MultipleChoiceOption } from '@/features/quiz/ui/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ui/ox-choice-option'
import { QuizSettingDrawer } from '@/features/quiz/ui/quiz-setting-drawer'
import { ResultIcon } from '@/features/quiz/ui/result-icon'

import { useUpdateQuizNotification, useUser } from '@/entities/member/api/hooks'
import { CreateDailyQuizRecordResponse, GetAllQuizzesResponse } from '@/entities/quiz/api'
import { useCreateDailyQuizRecord, useGetConsecutiveSolvedDailyQuiz, useGetQuizzes } from '@/entities/quiz/api/hooks'

import { IcClose, IcFile, IcPagelink, IcRefresh } from '@/shared/assets/icon'
import { ImgPush, ImgPushEng, ImgRoundIncorrect, ImgStar, ImgTutorialRefresh } from '@/shared/assets/images'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/shared/components/ui/drawer'
import Loading from '@/shared/components/ui/loading'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useMessaging } from '@/shared/hooks/use-messaging'
import { usePWA } from '@/shared/hooks/use-pwa'
import { checkNotificationPermission } from '@/shared/lib/notification'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { StorageKey } from '@/shared/lib/storage'
import { useLocalStorage } from '@/shared/lib/storage/model/use-storage'
import { cn } from '@/shared/lib/utils'
import { SUPPORTED_LOCALE } from '@/shared/locales/i18n'
import { useTranslation } from '@/shared/locales/use-translation'

type Quiz = GetAllQuizzesResponse['quizzes'][number]

const HomePage = () => {
  const router = useRouter()
  const [redirectUrl, _, removeRedirectUrl] = useLocalStorage(StorageKey.redirectUrl, '')
  const { trackEvent } = useAmplitude()
  const { t, currentLanguage } = useTranslation()

  // 온보딩 관련
  const [userLoaded, setUserLoaded] = useState(false)
  const { data: user, refetch: refetchUser } = useUser()
  const { shouldShowOnboardingReward, setShouldShowOnboardingReward } = useOnboardingStore()

  // 알림 관련 설정
  const [openNotification, setOpenNotification] = useState(false)
  const { isPWA } = usePWA()

  // 메인 퀴즈 상태 관리
  const [quizzes, setQuizzes] = useState<Quiz[]>()
  // 백그라운드 퀴즈 캐시 (리페치된 퀴즈를 임시 저장)
  const backgroundQuizzesRef = useRef<Quiz[]>([])

  // 튜토리얼 새로고침 표시 여부 관리
  const [tutorialRefreshShown, setTutorialRefreshShown] = useLocalStorage(StorageKey.tutorialRefreshShown, false)

  const [displayQuizType] = useQueryParam('/', 'displayQuizType')
  const [displayQuizScope] = useQueryParam('/', 'displayQuizScope')

  const { data: quizData, isLoading, refetch } = useGetQuizzes()

  useEffect(() => {
    setQuizState((prev) => ({
      ...prev,
      status: 'idle',
      selectedAnswer: null,
    }))
    setQuizzes(() => {
      return (
        quizData?.quizzes.filter((quiz) => {
          if (displayQuizScope === 'ALL') {
            return quiz.quizType === displayQuizType || displayQuizType === 'ALL'
          } else if (displayQuizScope === 'MY') {
            return quiz.isBookmarked && (quiz.quizType === displayQuizType || displayQuizType === 'ALL')
          } else if (displayQuizScope === 'BOOKMARK') {
            return !quiz.isBookmarked && (quiz.quizType === displayQuizType || displayQuizType === 'ALL')
          }
          return false
        }) ?? []
      )
    })
  }, [quizData, displayQuizType, displayQuizScope])

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
      trackEvent('daily_complete_click')
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

  useEffect(() => {
    if (!userLoaded) {
      refetchUser()
      setUserLoaded(true)
    }
  }, [userLoaded, refetchUser])

  useEffect(() => {
    if (!userLoaded || user) {
      return
    }

    if (redirectUrl) {
      removeRedirectUrl()
      router.replace(redirectUrl as any, {
        params: [],
      })
    }
  }, [userLoaded, user])

  if (!user) {
    return null
  }

  // 설정한 카테고리가 없을 경우 온보딩 화면 노출
  if (user && !user.category.id) {
    return <OnBoarding />
  }

  return (
    <>
      <Header
        content={
          <div className="flex items-center py-[7px] justify-between">
            <div className="ml-2">
              <Text typo="subtitle-1-bold" color="secondary">
                {new Date()
                  .toLocaleDateString(
                    currentLanguage === SUPPORTED_LOCALE.KO ? SUPPORTED_LOCALE.KO : SUPPORTED_LOCALE.EN,
                    {
                      month: 'numeric',
                      day: 'numeric',
                      weekday: 'short',
                    },
                  )
                  .replace(/\s/g, '')}
              </Text>
            </div>
            <div className="flex items-center">
              <DailyQuizTooltip
                consecutiveSolvedDailyQuizDays={consecutiveSolvedDailyQuizDays ?? 0}
                todaySolvedDailyQuizCount={todaySolvedDailyQuizCount ?? 0}
              />
            </div>
          </div>
        }
        className="bg-surface-2"
      />
      {!isLoading && quizzes?.length === 0 && quizData?.quizzes.length === 0 && <DailyGuide />}
      {(quizData?.quizzes.length ?? 0) > 0 && (
        <HeaderOffsetLayout className="px-3">
          {!isRefreshing ? (
            <Text
              typo="subtitle-1-bold"
              color="sub"
              className="absolute right-1/2 translate-x-1/2 pt-[16px] whitespace-nowrap"
            >
              {t('daily.home_page.pull_to_refresh')}
            </Text>
          ) : (
            <div className="absolute right-1/2 translate-x-1/2 pt-[16px] flex items-center gap-2">
              <Loading size="xs" />
            </div>
          )}

          {currQuiz ? (
            <motion.div
              className={cn(
                'relative mt-1 shadow-[var(--shadow-md)] rounded-[24px] px-4 pt-7 pb-6 bg-surface-1 relative overflow-hidden z-50 h-[66svh]',
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
              <QuizSettingDrawer quizzes={quizzes} open={settingDrawerOpen} onOpenChange={setSettingDrawerOpen} />

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
                              handleClickOption({
                                quiz: currQuiz,
                                selectOption: index === 0 ? 'correct' : 'incorrect',
                              })
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
          ) : (
            <div className="flex-center mt-1 shadow-[var(--shadow-md)] rounded-[24px] px-4 pt-7 pb-6 bg-surface-1 relative overflow-hidden z-50 h-[62svh]">
              <QuizSettingDrawer
                quizzes={quizData?.quizzes ?? []}
                open={settingDrawerOpen}
                onOpenChange={setSettingDrawerOpen}
              />
              <Text typo="h4" color="sub" className="flex-center">
                {t('daily.home_page.no_quizzes_message')}.
                <br />
                {t('daily.home_page.try_different_conditions')}.
              </Text>
            </div>
          )}
        </HeaderOffsetLayout>
      )}
      {/* 알림 권한 허용 drawer */}
      <NotificationDrawer open={openNotification} onOpenChange={setOpenNotification} />
      <div className="px-4">
        <button
          className="absolute bg-base-3 rounded-full bottom-[calc(var(--spacing-tab-navigation)+12px)] h-[48px] w-[calc(100%-32px)]"
          onClick={() => {
            router.push('/note/create', {
              search: {
                documentType: 'TEXT',
              },
            })
            trackEvent('generate_new_click', {
              format: '텍스트 버튼',
              location: '데일리 페이지',
            })
          }}
        >
          <Text typo="subtitle-2-medium" color="sub" className="center">
            {t('daily.home_page.create_quiz_button')}
          </Text>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push('/note/create', {
                search: {
                  documentType: 'FILE',
                },
              })
              trackEvent('generate_new_click', {
                format: '파일 버튼',
                location: '데일리 페이지',
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
              {t('daily.alert_drawer.title1')}{' '}
              <span className="text-accent">
                {t('daily.alert_drawer.title2', { count: dailyQuizRecord?.consecutiveSolvedDailyQuizDays })}
              </span>{' '}
              {t('daily.alert_drawer.title3')}
            </Text>
            <div className="mt-2 pb-[32px] border-b border-divider">
              <Text typo="body-1-medium" color="sub" className="text-center">
                {t('daily.home_page.notification_permission_message2')}
                <br />
                {t('daily.alert_drawer.description2')}
              </Text>
            </div>
            {dailyQuizRecord?.consecutiveSolvedDailyQuizDays !== 0 && (
              <div className="mt-[24px] px-[28px] pt-[6px] pb-[9px] flex flex-center gap-[20px]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="relative">
                      {/* Bg Star */}
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="20" fill="#F8F8F7" />
                        <path
                          d="M21.5941 9.84L23.8215 14.3354C24.0796 14.8589 24.5821 15.2245 25.1616 15.3058L30.137 16.0279C31.5993 16.24 32.1833 18.0319 31.1239 19.0564L27.5248 22.5543C27.1038 22.9605 26.9136 23.5518 27.0132 24.125L27.8643 29.0672C28.1133 30.516 26.5877 31.6263 25.2793 30.9402L20.829 28.6068C20.3084 28.336 19.6882 28.336 19.1721 28.6068L14.7218 30.9402C13.4134 31.6263 11.8877 30.5205 12.1367 29.0672L12.9879 24.125C13.0875 23.5473 12.8973 22.9605 12.4763 22.5543L8.87714 19.0564C7.81777 18.0273 8.40178 16.24 9.86408 16.0279L14.8395 15.3058C15.419 15.22 15.9215 14.8589 16.1796 14.3354L18.407 9.84C19.0589 8.52208 20.9467 8.52208 21.6032 9.84H21.5941Z"
                          fill="#EBEBE8"
                        />
                      </svg>
                      {/* Complete Star */}
                      {((dailyQuizRecord?.consecutiveSolvedDailyQuizDays ?? 0) % 5 > index ||
                        (dailyQuizRecord?.consecutiveSolvedDailyQuizDays ?? 0) % 5 === 0) && (
                        <motion.div
                          className="absolute inset-0 opacity-0"
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {
                              duration: 0.4,
                              delay: index === 0 ? 0.6 : 0.6 + index * 0.1,
                              type: 'spring',
                              bounce: 0.5,
                            },
                          }}
                        >
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="40" height="40" rx="20" fill="#FDA53A" />
                            <path
                              d="M12.3047 19.5L17.8049 25L27.6962 15"
                              stroke="white"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>

                    <Text typo="body-1-bold" color="caption">
                      {index === 4
                        ? t('daily.alert_drawer.star_count', { count: 20 })
                        : t('daily.alert_drawer.star_count', { count: 5 })}
                    </Text>
                  </div>
                ))}
              </div>
            )}
            <div className="absolute bottom-0 h-[114px] w-[calc(100%-32px)] pt-[14px]">
              <Button
                onClick={() => {
                  setRewardDrawerOpen(false)
                }}
              >
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        }
      />
      {/* Welcome Dialog */}
      <Dialog open={shouldShowOnboardingReward}>
        <DialogContent>
          <div className="relative">
            <ImgStar className="size-[120px] mx-auto" />
            <div className="rounded-full px-2 py-[2px] bg-black text-white typo-subtitle-2-bold absolute bottom-2 left-1/2">
              x200
            </div>
          </div>
          <Text typo="h4" className="mt-4 text-center">
            {t('daily.home_page.welcome_message')}, {t('daily.home_page.user_name', { name: user?.name })}
          </Text>
          <Text typo="subtitle-2-medium" color="sub" className="text-center mt-2">
            {t('daily.home_page.signup_gift_message')}
            <br />
            {t('daily.home_page.available_stars_message')}{' '}
            <span className="text-accent">{t('daily.home_page.stars_unit', { count: 200 })}</span>{' '}
            {t('daily.home_page.gift_message')}
          </Text>
          <Button onClick={() => setShouldShowOnboardingReward(false)} className="mt-[32px]">
            {t('daily.home_page.receive_button')}
          </Button>
        </DialogContent>
      </Dialog>

      {quizzes && quizzes.length > 0 && !tutorialRefreshShown && (
        <TutorialRefresh onClose={() => setTutorialRefreshShown(true)} />
      )}
    </>
  )
}

const TutorialRefresh = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 bg-black/70 z-50 flex-center flex-col">
      <Text typo="subtitle-1-bold" color="inverse" className="text-center">
        {/* 문제를 바꾸고 싶다면 */}
        {t('daily.tutorial.message1')}
        <br />
        {t('daily.tutorial.message2')}
        {/* 카드를 */}
        <span className="text-accent">
          {/* 아래로 */} {t('daily.tutorial.message3')}{' '}
        </span>
        {/* 당겨보세요 */}
        {t('daily.tutorial.message4')}
      </Text>
      <div className="mt-[32px] mb-[40px]">
        <ImgTutorialRefresh className="size-[200px]" />
      </div>
      <button onClick={onClose} className="flex items-center gap-2 text-inverse">
        <IcClose className="size-[20px]" />
        <Text typo="button-1">
          {/* 닫기 */}
          {t('common.close')}
        </Text>
      </button>
    </div>
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
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center justify-start gap-3 w-fit">
        <ImgRoundIncorrect className="size-[48px]" />
        <Text typo="h2" color="incorrect">
          {t('daily.home_page.incorrect_answer')}
        </Text>
      </div>

      <div className="py-[24px]">
        <div className="w-full h-px bg-gray-100" />
      </div>

      <div className="grid gap-3">
        <Text typo="subtitle-1-bold">
          {t('common.answer')}:{' '}
          {currQuiz.quizType === 'MULTIPLE_CHOICE' ? currQuiz.answer : currQuiz.answer === 'correct' ? 'O' : 'X'}
        </Text>
        <Text typo="body-1-medium" as="p" color="secondary">
          {currQuiz.explanation}
        </Text>
        <div className="mt-[24px] flex items-center">
          <Text typo="body-1-medium" color="sub">
            {t('daily.home_page.source')}
          </Text>

          <div className="h-[12px] w-px bg-gray-100 mx-2" />

          <button
            className="flex items-center gap-1"
            onClick={() => router.push(`/quiz-detail/:noteId`, { params: [String(currQuiz.documentId)] })}
          >
            <Text typo="body-1-medium" color="sub">
              {currQuiz.name}
            </Text>
            <IcPagelink className="size-4 text-icon-sub" />
          </button>
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
        {t('daily.home_page.switch_question')}
      </Button>
    </>
  )
}

const NotificationDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) => {
  const { setupMessaging, isReadyNotification } = useMessaging()
  const { mutate: updateNotification } = useUpdateQuizNotification()
  const { t, currentLanguage } = useTranslation()

  const clickNotification = async () => {
    const callbackAfterPermission = (permission?: boolean) => {
      updateNotification({ quizNotificationEnabled: permission ?? false })
      onOpenChange(false)
    }
    await setupMessaging(callbackAfterPermission)
  }

  useEffect(() => {
    console.log('알림 준비: ' + isReadyNotification)
  }, [isReadyNotification])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent height="md" hasHandle={false} className="flex flex-col items-center">
        <DrawerHeader className="w-full flex-center flex-col gap-[8px] py-[10px]">
          <Text typo="h4" className="text-center">
            {t('daily.home_page.notification_permission_guide')}
          </Text>
          <Text typo="subtitle-2-medium" color="sub" className="text-center">
            {t('daily.home_page.notification_permission_message1')}
            <br />
            {t('daily.home_page.notification_permission_message2')}
          </Text>
        </DrawerHeader>

        {currentLanguage === 'ko-KR' ? (
          <ImgPush height={200} width={301.25} />
        ) : (
          <ImgPushEng height={200} width={301.25} />
        )}

        <DrawerFooter className="w-full pt-[14px] px-[20px] h-[90px] flex flex-col">
          <Button onClick={clickNotification}>{t('daily.home_page.setup_button')}</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default withHOC(HomePage, {
  activeTab: 'DAILY',
  backgroundClassName: 'bg-surface-2',
  navClassName: 'border-none',
})
