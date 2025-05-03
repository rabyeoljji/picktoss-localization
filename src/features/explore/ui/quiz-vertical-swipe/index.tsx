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
  const [safeAreaInsetTop, setSafeAreaInsetTop] = useState(0)
  const [isTopReached, setIsTopReached] = useState(false)
  const swiperRef = useRef<SwiperCore>(null)
  const swiperContainerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)

  // root요소 스크롤 제어 + HOC에서 safe-area-inset-top을 계산하기 위해서 사용
  useEffect(() => {
    const root = document.getElementById('root')
    const hocElement = document.getElementById('hoc')
    if (!root || !hocElement) return

    root.classList.add('overscroll-none')

    const computedStyle = window.getComputedStyle(hocElement)
    const paddingTopValue = computedStyle.getPropertyValue('padding-top')

    const safeAreaInsetTop = parseFloat(paddingTopValue) || 0
    setSafeAreaInsetTop(safeAreaInsetTop)

    return () => {
      root.classList.remove('overscroll-none')
    }
  }, [])

  // 퀴즈 카드 스와이프 영역 스크롤 제어
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (!swiperContainerRef.current || !swiperRef.current) return

      const topOffset = swiperContainerRef.current.getBoundingClientRect().top

      setIsTopReached(topOffset <= 110 + safeAreaInsetTop)
    }

    const handleWheelEvent = (e: WheelEvent) => {
      if (!swiperRef.current) return

      const isWheelUp = e.deltaY < 0
      const isSwiperAtBeginning = swiperRef.current.isBeginning // 스와이프 카드 시작 지점 (첫번째 카드)

      // isSwiperAtBeginning 상태일 때, 위로 이동하는 경우
      if (isSwiperAtBeginning && isWheelUp) {
        setIsTopReached(false)
        return
      }
    }

    const handleTouchMoveEvent = (e: TouchEvent) => {
      if (!swiperRef.current) return

      const touchMoveY = e.touches[0].clientY
      const isSwiperAtBeginning = swiperRef.current.isBeginning

      // 터치 시작 위치가 없으면 처리하지 않음
      if (touchStartY.current === null) return

      const deltaY = touchStartY.current - touchMoveY // 이동한 거리 계산
      const isSwipeDown = deltaY < -60 // 아래로 스와이프
      // isSwiperAtBeginning 상태일 때, 터치로 아래로 스와이프하는 경우 (위로 이동)
      if (isSwiperAtBeginning && isSwipeDown) {
        setIsTopReached(false)
        return
      }
    }

    const handleTouchStartEvent = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY // 터치 시작 Y 좌표 저장
    }

    const root = document.getElementById('root')

    if (!root) return

    handleScrollOrResize()
    root.addEventListener('scroll', handleScrollOrResize)
    root.addEventListener('wheel', handleWheelEvent)
    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('touchstart', handleTouchStartEvent)
    window.addEventListener('touchmove', handleTouchMoveEvent)

    return () => {
      root.removeEventListener('scroll', handleScrollOrResize)
      root.removeEventListener('wheel', handleWheelEvent)
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('touchstart', handleTouchStartEvent)
      window.removeEventListener('touchmove', handleTouchMoveEvent)
    }
  }, [safeAreaInsetTop])

  return (
    <div
      ref={swiperContainerRef}
      style={{
        height: 'calc(100vh - env(safe-area-inset-top) - 184px)',
        touchAction: 'pan-y',
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      className="relative w-full p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden bg-base-2"
    >
      {!isTopReached && (
        <div className="absolute inset-0 z-30" style={{ background: 'transparent', pointerEvents: 'all' }} />
      )}

      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0.01}
        mousewheel={{ forceToAxis: true, enabled: true }}
        allowTouchMove={true}
        cssMode={false}
        simulateTouch={true}
        touchStartPreventDefault={false}
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
                  owner="picktoss"
                  isBookmarked={false}
                  onClickShare={() => {}}
                  onClickBookmark={() => {}}
                />
              }
              content={
                <ExploreQuizCard.Content
                  emoji="🪶"
                  title="인지주의 심리학 관련 퀴즈 모음"
                  category="IT·개발"
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
