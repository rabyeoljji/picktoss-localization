import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { MultipleChoiceOption } from '@/features/quiz/ui/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ui/ox-choice-option'

import { GetAllQuizzesResponse } from '@/entities/quiz/api'
import { useCreateDailyQuizRecord, useGetQuizzes } from '@/entities/quiz/api/hooks'

import { IcControl, IcFile, IcPagelink, IcProfile, IcRefresh, IcSearch } from '@/shared/assets/icon'
import { ImgDaily1, ImgDaily2, ImgDaily3, ImgRoundIncorrect, ImgStar } from '@/shared/assets/images'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/shared/components/ui/carousel'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useMessaging } from '@/shared/hooks/use-messaging'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

type Quiz = GetAllQuizzesResponse['quizzes'][number]

const HomePage = () => {
  const router = useRouter()

  const [quizzes, setQuizzes] = useState<Quiz[]>()
  const { data: quizzesData, isLoading } = useGetQuizzes()

  const [displayQuizType] = useQueryParam('/', 'displayQuizType')
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false)
  const [quizState, setQuizState] = useState<{
    selectedAnswer: string | null
    status: 'idle' | 'selected' | 'wrong'
  }>({
    selectedAnswer: null,
    status: 'idle',
  })

  useEffect(() => {
    if (quizzesData) {
      setQuizzes(quizzesData.quizzes)
    }
  }, [quizzesData])

  const { mutate: createDailyQuizRecord } = useCreateDailyQuizRecord()

  const { setupMessaging, isReadyNotification } = useMessaging()

  useEffect(() => {
    console.log('알림 준비: ' + isReadyNotification)
  }, [isReadyNotification])

  const moveToNextQuiz = (quiz: Quiz) => {
    setQuizzes((prev) => prev?.filter((q) => q.id !== quiz.id))
    setQuizState((prev) => ({
      ...prev,
      status: 'idle',
      selectedAnswer: null,
    }))
  }

  const handleClickOption = ({ quiz, selectOption }: { quiz: Quiz; selectOption: string }) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: selectOption,
      status: 'selected',
    }))

    setTimeout(() => {
      if (quiz.answer === selectOption) {
        moveToNextQuiz(quiz)
      } else {
        setQuizState((prev) => ({
          ...prev,
          selectedAnswer: selectOption,
          status: 'wrong',
        }))
      }
    }, 700)
  }

  const displayQuizzes = quizzes?.filter((quiz) => quiz.quizType === displayQuizType)
  const currQuiz = displayQuizzes?.[0]

  return (
    <>
      <Header
        content={
          <div className="flex items-center">
            <div className="flex items-center">
              <button className="p-2 flex-center">
                <IcProfile className="size-6 text-icon-secondary" />
              </button>
              <div className="p-1.5 flex-center">
                <ImgStar className="size-[28px]" />
              </div>
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

      {!isLoading && quizzes?.length === 0 && <BannerContent />}

      {displayQuizzes && displayQuizzes.length > 0 && (
        <HeaderOffsetLayout className="px-3">
          {quizState.status !== 'wrong' && (
            <div
              className="mt-1 shadow-md rounded-[20px] px-5 pt-7 pb-6 bg-surface-1 min-h-[500px] relative"
              key={currQuiz?.id}
            >
              <QuizSettingDrawer open={settingDrawerOpen} onOpenChange={setSettingDrawerOpen} />

              <motion.div
                className="h-[152px] w-[80%] mx-auto flex flex-col items-center pt-5 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Tag>{currQuiz?.name}</Tag>
                <Text typo="question" className="mt-3 text-center">
                  {currQuiz?.question}
                </Text>
              </motion.div>

              <div className="mt-2">
                {currQuiz?.quizType === 'MIX_UP' ? (
                  <div className="flex items-center gap-3 pt-10">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <OXChoiceOption
                        key={index}
                        O={index === 0}
                        X={index === 1}
                        isCorrect={currQuiz?.answer === (index === 0 ? 'correct' : 'incorrect')}
                        selectedOption={quizState.selectedAnswer}
                        onClick={() =>
                          handleClickOption({ quiz: currQuiz, selectOption: index === 0 ? 'correct' : 'incorrect' })
                        }
                        className="flex-1"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {currQuiz?.options.map((option, index) => (
                      <MultipleChoiceOption
                        key={option}
                        label={String.fromCharCode(65 + index)}
                        option={option}
                        isCorrect={option === currQuiz?.answer}
                        selectedOption={quizState.selectedAnswer}
                        animationDelay={index * 0.03}
                        onClick={() => handleClickOption({ quiz: currQuiz, selectOption: option })}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {quizState.status === 'wrong' && (
            <div className="mt-1 shadow-md rounded-[20px] px-[32px] pt-[64px] pb-6 bg-surface-1 min-h-[500px] relative">
              <QuizSettingDrawer open={settingDrawerOpen} onOpenChange={setSettingDrawerOpen} />

              <div className="flex items-center gap-3 mx-auto w-fit">
                <ImgRoundIncorrect className="size-[48px]" />
                <Text typo="h2" color="incorrect">
                  오답
                </Text>
              </div>

              <div className="py-[24px]">
                <div className="w-full h-px bg-gray-100" />
              </div>

              <div className="grid gap-3">
                <Text typo="subtitle-1-bold" className="text-center">
                  정답:{' '}
                  {currQuiz?.quizType === 'MULTIPLE_CHOICE'
                    ? currQuiz?.answer
                    : currQuiz?.answer === 'correct'
                      ? 'O'
                      : 'X'}
                </Text>
                <Text typo="body-1-medium" as="p" color="secondary" className="text-center">
                  {currQuiz?.explanation}
                </Text>
                <div className="mt-[24px] flex items-center mx-auto">
                  <Text typo="body-1-medium" color="sub">
                    출처
                  </Text>

                  <div className="h-[12px] w-px bg-gray-100 mx-2" />

                  <div className="flex items-center gap-1">
                    <Text typo="body-1-medium" color="sub">
                      {currQuiz?.name}
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
            </div>
          )}
        </HeaderOffsetLayout>
      )}

      <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(var(--spacing-tab-navigation)+12px+52px)] w-[calc(100%-32px)] flex-center flex-col gap-1">
        <Text typo="button-2">테스트용</Text>
        <Button onClick={async () => await setupMessaging()}>
          알림 권한 요청 <br /> <Text typo="button-4">(재요청은 pwa앱 삭제 후 재설치)</Text>
        </Button>
      </div>

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
    </>
  )
}

const BannerContent = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <HeaderOffsetLayout className="px-3">
      <div className="mt-1 shadow-md rounded-[20px] px-5 pt-7 pb-6 bg-surface-1">
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>
              <ImgDaily1 className="w-full max-w-[400px] mx-auto" />

              <div className="text-center mt-15">
                <Text typo="h3">내 퀴즈 생성하기</Text>
                <Text as="p" typo="subtitle-2-medium" color="sub" className="mt-2">
                  쌓아둔 필기, 메모, 저장한 자료 등<br />
                  공부한 내용으로 맞춤형 퀴즈를 생성해요
                </Text>
              </div>
            </CarouselItem>

            <CarouselItem>
              <ImgDaily2 className="w-full max-w-[400px] mx-auto" />

              <div className="text-center mt-15">
                <Text typo="h3">관심 퀴즈 저장하기</Text>
                <Text as="p" typo="subtitle-2-medium" color="sub" className="mt-2">
                  사람들이 만든 다양한 문제를 풀어보고,
                  <br />
                  마음에 드는 퀴즈를 북마크해요
                </Text>
              </div>
            </CarouselItem>

            <CarouselItem>
              <ImgDaily3 className="w-full max-w-[400px] mx-auto" />

              <div className="text-center mt-15">
                <Text typo="h3">데일리로 기억하기!</Text>
                <Text as="p" typo="subtitle-2-medium" color="sub" className="mt-2">
                  내가 생성하거나 북마크한 퀴즈의 문제를
                  <br />
                  여기서 랜덤으로 풀어보며 복습해요
                </Text>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="mt-[65px] mx-auto w-fit flex gap-2 items-center">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={cn('size-2 rounded-full bg-surface-3', current === i + 1 && 'bg-inverse')} />
          ))}
        </div>
      </div>
    </HeaderOffsetLayout>
  )
}

const QuizSettingDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [displayQuizType, setDisplayQuizType] = useQueryParam('/', 'displayQuizType')

  return (
    <AlertDrawer
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <button className="absolute top-4 right-4 p-1 rounded-[8px] border border-outline">
          <IcControl className="size-4 text-icon-secondary" />
        </button>
      }
      title="데일리 퀴즈 설정"
      hasClose
      height="lg"
      body={
        <div className="py-8">
          <form
            id="quiz-settings-form"
            onSubmit={(e) => {
              e.preventDefault()
              const value = (e.target as HTMLFormElement).quizType.value
              setDisplayQuizType(value)
              onOpenChange(false)
            }}
          >
            <div className="grid gap-2">
              <Text typo="subtitle-2-bold" color="secondary">
                문제 유형
              </Text>
              <div className="bg-surface-1 rounded-[12px] py-[10px] px-4">
                <RadioGroup name="quizType" defaultValue={displayQuizType}>
                  <Label className="flex items-center gap-3 w-full py-[10px]">
                    <RadioGroupItem value="ALL" />
                    <Text typo="subtitle-2-medium" color="primary">
                      전체
                    </Text>
                  </Label>
                  <Label className="flex items-center gap-3 w-full py-[10px]">
                    <RadioGroupItem value="MULTIPLE_CHOICE" />
                    <Text typo="subtitle-2-medium" color="primary">
                      객관식
                    </Text>
                  </Label>
                  <Label className="flex items-center gap-3 w-full py-[10px]">
                    <RadioGroupItem value="MIX_UP" />
                    <Text typo="subtitle-2-medium" color="primary">
                      O/X
                    </Text>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          </form>
        </div>
      }
      footer={
        <div className="h-[114px] pt-[14px]">
          <Button type="submit" form="quiz-settings-form">
            적용하기
          </Button>
        </div>
      }
      contentClassName="bg-surface-2"
    />
  )
}

export default withHOC(HomePage, {
  activeTab: '데일리',
  backgroundClassName: 'bg-surface-2',
})
