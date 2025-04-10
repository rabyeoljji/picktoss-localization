import { useEffect, useState } from 'react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { IcProfile, IcSearch } from '@/shared/assets/icon'
import { ImgDaily1, ImgDaily2, ImgDaily3, ImgStar } from '@/shared/assets/images'
import { Header } from '@/shared/components/header'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/shared/components/ui/carousel'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

const HomePage = () => {
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

      <HeaderOffsetLayout className="px-3">
        <div className="mt-1 shadow-md rounded-[20px] px-5 pt-7 pb-6 bg-surface-1">
          <Carousel setApi={setApi}>
            <CarouselContent>
              <CarouselItem>
                <ImgDaily1 className="w-full max-w-[400px] mx-auto" />

                <div className="text-center mt-15">
                  <Text typo="h3">내 퀴즈 생성하기</Text>
                  <Text as="p" typo="subtitle-2-medium" color="sub">
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
    </>
  )
}

export default withHOC(HomePage, {
  activeTab: '데일리',
  backgroundColor: 'bg-surface-2',
})
