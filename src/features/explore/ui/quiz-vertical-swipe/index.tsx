import { useEffect, useRef, useState } from 'react'

import SwiperCore from 'swiper'
import { Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { GetAllQuizzesDto } from '@/entities/quiz/api'

import { ExploreQuizCard } from '@/shared/components/cards/explore-quiz-card'

// mock
const quizzes = [
  {
    id: 0,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
  {
    id: 1,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
  {
    id: 2,
    name: 'picktoss',
    question: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수인가요?',
    answer: 'correct',
    explanation: '데킬라의 주 원료는 멕시코 할리스코 주에 서식하는 옥수수',
    quizType: 'MIX_UP',
  },
] as GetAllQuizzesDto[]

const QuizVerticalSwipe = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperCore>(null)
  const startYRef = useRef<number>(0)

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        startYRef.current = event.touches[0].clientY
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (startYRef.current !== null && event.touches.length > 0) {
        const currentY = event.touches[0].clientY
        const scrollingUp = currentY < startYRef.current
        const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
        updateSwiperLock(swiperTopOffset, scrollingUp)
      }
    }

    const handleWheel = (event: WheelEvent) => {
      const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
      const scrollingUp = event.deltaY < 0
      updateSwiperLock(swiperTopOffset, scrollingUp)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [activeIndex])

  // 처음에는 페이지 스크롤이 동작하게, swiper영역이 상단에 도달했을 시 swipe기능 동작하도록
  const updateSwiperLock = (swiperTopOffset: number, scrollingUp: boolean) => {
    if (!swiperRef.current) return

    const safeAreaInsetTop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0',
    )
    const isBeyond = swiperTopOffset > 150 + safeAreaInsetTop
    const isAtTop = activeIndex === 0

    if (isBeyond) {
      swiperRef.current.mousewheel.disable()
      swiperRef.current.allowTouchMove = false
    } else {
      if (isAtTop && scrollingUp) {
        swiperRef.current.mousewheel.disable()
        swiperRef.current.allowTouchMove = false
      } else {
        swiperRef.current.mousewheel.enable()
        swiperRef.current.allowTouchMove = true
        swiperRef.current.update()
      }
    }
  }

  return (
    <div className="sticky top-[calc(var(--header-height-safe)+46px)] w-full h-[calc(100dvh-184px)] p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0.01}
        mousewheel={{
          forceToAxis: true,
          enabled: false, // 초기에 비활성화
        }}
        modules={[Mousewheel]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <SwiperSlide key={index}>
            <ExploreQuizCard
              index={index}
              activeIndex={activeIndex}
              header={
                <ExploreQuizCard.Header
                  owner={'picktoss'}
                  isBookmarked={false}
                  onClickShare={() => {}}
                  onClickBookmark={() => {}}
                />
              }
              content={
                <ExploreQuizCard.Content
                  emoji={'🪶'}
                  title={'인지주의 심리학 관련 퀴즈 모음'}
                  category={'IT·개발'}
                  playedCount={345}
                  bookmarkCount={28}
                />
              }
              quizzes={
                <ExploreQuizCard.Quizzes
                  quizzes={quizzes}
                  totalQuizCount={quizzes.length}
                  onClickViewAllBtn={() => {}}
                />
              }
              footer={<ExploreQuizCard.Footer onClickStartQuiz={() => {}} />}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default QuizVerticalSwipe
