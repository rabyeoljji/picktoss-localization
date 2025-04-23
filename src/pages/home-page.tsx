import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { MultipleChoiceOption } from '@/features/quiz/ui/multiple-choice-option'
import { OXChoiceOption } from '@/features/quiz/ui/ox-choice-option'

import { useGetQuizzes } from '@/entities/quiz/api/hooks'

import { IcFile, IcProfile, IcSearch } from '@/shared/assets/icon'
import { ImgDaily1, ImgDaily2, ImgDaily3, ImgStar } from '@/shared/assets/images'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/shared/components/ui/carousel'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useMessaging } from '@/shared/hooks/use-messaging'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const HomePage = () => {
  const router = useRouter()

  const { data: quizzes, isLoading } = useGetQuizzes()
  const { setupMessaging, isReadyNotification } = useMessaging()

  useEffect(() => {
    console.log('알림 준비: ' + isReadyNotification)
  }, [isReadyNotification])

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

      {quizzes && quizzes.length > 0 && (
        <HeaderOffsetLayout className="px-3">
          <div className="mt-1 shadow-md rounded-[20px] px-5 pt-7 pb-6 bg-surface-1 min-h-[500px]">
            <motion.div
              className="h-[152px] w-[80%] mx-auto flex flex-col items-center pt-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tag>{quizzes?.[0].name}</Tag>
              <Text typo="question" className="mt-3 text-center">
                {quizzes?.[0].question}
              </Text>
            </motion.div>

            <div className="mt-2">
              {quizzes?.[0].quizType === 'MIX_UP' ? (
                <div className="flex items-center gap-3 pt-10">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <OXChoiceOption
                      key={index}
                      O={index === 0}
                      X={index === 1}
                      isCorrect={quizzes?.[0].answer === (index === 0 ? 'correct' : 'incorrect')}
                      selectedOption={null}
                      onClick={() => {}}
                      className="flex-1"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-2">
                  {quizzes?.[0].options.map((option, index) => (
                    <MultipleChoiceOption
                      key={option}
                      label={String.fromCharCode(65 + index)}
                      option={option}
                      isCorrect={option === quizzes?.[0].answer}
                      selectedOption={null}
                      animationDelay={index * 0.03}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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

export default withHOC(HomePage, {
  activeTab: '데일리',
  backgroundClassName: 'bg-surface-2',
})
