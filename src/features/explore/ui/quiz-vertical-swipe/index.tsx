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
  const [isSwiperActive, setIsSwiperActive] = useState(false)
  const swiperRef = useRef<SwiperCore>(null)
  const swiperContainerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)

  useEffect(() => {
    if (!swiperContainerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSwiperActive(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 1.0,
        rootMargin: '0px 0px -84px 0px',
      },
    )

    observer.observe(swiperContainerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

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
        updateSwiperLock(scrollingUp)
      }
    }

    const handleWheel = (event: WheelEvent) => {
      const scrollingUp = event.deltaY < 0

      // Swiper 영역이 활성화되어있으면 preventDefault
      if (isSwiperActive && !(activeIndex === 0 && scrollingUp)) {
        event.preventDefault()
      }

      updateSwiperLock(scrollingUp)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [activeIndex, isSwiperActive])

  const updateSwiperLock = (scrollingUp: boolean) => {
    if (!swiperRef.current) return

    const isAtTop = activeIndex === 0

    if (!isSwiperActive) {
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
    <div
      ref={swiperContainerRef}
      className="w-full h-[calc(100dvh-184px)] p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden bg-base-2 touch-pan-y overscroll-contain"
    >
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0.01}
        mousewheel={{ forceToAxis: true, enabled: false }}
        allowTouchMove={false}
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

// const QuizVerticalSwipe = () => {
//   const [activeIndex, setActiveIndex] = useState(0)
//   const swiperRef = useRef<SwiperCore>(null)
//   const startYRef = useRef<number>(0)

//   useEffect(() => {
//     const handleTouchStart = (event: TouchEvent) => {
//       if (event.touches.length > 0) {
//         startYRef.current = event.touches[0].clientY
//       }
//     }

//     const handleTouchMove = (event: TouchEvent) => {
//       if (startYRef.current !== null && event.touches.length > 0) {
//         const currentY = event.touches[0].clientY
//         const scrollingUp = currentY < startYRef.current
//         const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
//         updateSwiperLock(swiperTopOffset, scrollingUp)
//       }
//     }

//     const handleWheel = (event: WheelEvent) => {
//       const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
//       const scrollingUp = event.deltaY < 0

//       const safeAreaInsetTop = parseInt(
//         getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0',
//       )
//       const isBeyond = swiperTopOffset > 150 + safeAreaInsetTop

//       if (!isBeyond && !(activeIndex === 0 && scrollingUp)) {
//         event.preventDefault()
//       }

//       updateSwiperLock(swiperTopOffset, scrollingUp)
//     }

//     window.addEventListener('wheel', handleWheel, { passive: false })
//     window.addEventListener('touchstart', handleTouchStart, { passive: false })
//     window.addEventListener('touchmove', handleTouchMove, { passive: false })

//     return () => {
//       window.removeEventListener('wheel', handleWheel)
//       window.removeEventListener('touchstart', handleTouchStart)
//       window.removeEventListener('touchmove', handleTouchMove)
//     }
//   }, [activeIndex])

//   // 처음에는 페이지 스크롤이 동작하게, swiper영역이 상단에 도달했을 시 swipe기능 동작하도록
//   const updateSwiperLock = (swiperTopOffset: number, scrollingUp: boolean) => {
//     if (!swiperRef.current) return

//     const safeAreaInsetTop = parseInt(
//       getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0',
//     )
//     const isBeyond = swiperTopOffset > 150 + safeAreaInsetTop
//     const isAtTop = activeIndex === 0

//     if (isBeyond) {
//       if (!isAtTop && scrollingUp) {
//         swiperRef.current.mousewheel.enable()
//         swiperRef.current.allowTouchMove = true
//         swiperRef.current.update()
//       } else {
//         swiperRef.current.mousewheel.disable()
//         swiperRef.current.allowTouchMove = false
//       }
//     } else {
//       if (isAtTop && scrollingUp) {
//         swiperRef.current.mousewheel.disable()
//         swiperRef.current.allowTouchMove = false
//       } else {
//         swiperRef.current.mousewheel.enable()
//         swiperRef.current.allowTouchMove = true
//         swiperRef.current.update()
//       }
//     }
//   }

//   return (
//     <div className="w-full h-[calc(100dvh-184px)] p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden bg-base-2 touch-pan-y overscroll-contain">
//       <Swiper
//         direction="vertical"
//         slidesPerView={1}
//         spaceBetween={0.01}
//         mousewheel={{
//           forceToAxis: true,
//           enabled: false, // 초기에 비활성화
//         }}
//         allowTouchMove={false} // 초기에는 터치 이동 비활성화
//         cssMode={false} // true일 경우 네이티브 스크롤로 처리되어 충돌 가능
//         simulateTouch={true} // 터치 시뮬레이션 보장
//         touchStartPreventDefault={false} // preventDefault 충돌 방지
//         modules={[Mousewheel]}
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//         style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center' }}
//       >
//         {Array.from({ length: 3 }).map((_, index) => (
//           <SwiperSlide key={index}>
//             <ExploreQuizCard
//               index={index}
//               activeIndex={activeIndex}
//               header={
//                 <ExploreQuizCard.Header
//                   owner={'picktoss'}
//                   isBookmarked={false}
//                   onClickShare={() => {}}
//                   onClickBookmark={() => {}}
//                 />
//               }
//               content={
//                 <ExploreQuizCard.Content
//                   emoji={'🪶'}
//                   title={'인지주의 심리학 관련 퀴즈 모음'}
//                   category={'IT·개발'}
//                   playedCount={345}
//                   bookmarkCount={28}
//                 />
//               }
//               quizzes={
//                 <ExploreQuizCard.Quizzes
//                   quizzes={quizzes}
//                   totalQuizCount={quizzes.length}
//                   onClickViewAllBtn={() => {}}
//                 />
//               }
//               footer={<ExploreQuizCard.Footer onClickStartQuiz={() => {}} />}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   )
// }

export default QuizVerticalSwipe
