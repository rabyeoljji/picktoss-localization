import { useEffect, useRef, useState } from 'react'
import Marquee from 'react-fast-marquee'

import { motion } from 'framer-motion'
import SwiperCore from 'swiper'
import { Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { IcChevronRight, IcLibrary, IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Chip } from '@/shared/components/ui/chip'
import HorizontalScrollContainer from '@/shared/components/ui/horizontal-scroll-container'
import { Text } from '@/shared/components/ui/text'
import { Link, useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const exampleQuestions = [
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠 ', question: '프로세스는 무엇인가요?' },
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠 ', question: '프로세스는 무엇인가요?' },
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
]

// 임시 (서버에서 가져오기)
const categories = [
  {
    emoji: '💫',
    name: '전체',
  },
  {
    emoji: '🎓',
    name: '학문·전공',
  },
  {
    emoji: '💯',
    name: '자격증·수험',
  },
  {
    emoji: '🤖',
    name: 'IT·개발',
  },
  {
    emoji: '📊',
    name: '재테크·시사',
  },
  {
    emoji: '🧠',
    name: '상식·교양',
  },
  {
    emoji: '💬',
    name: '언어',
  },
]

const ExplorePage = () => {
  const [params, setParams] = useQueryParam('/explore')
  const activeTab = params.tab

  type Tab = typeof params.tab

  const setTab = (tab: Tab) => {
    setParams({ ...params, tab })
  }

  return (
    <>
      <Header
        className={cn('transition-all duration-300 ease-in-out', 'bg-surface-2 py-[9px] px-[8px]')}
        left={
          <button className="size-[40px] flex-center">
            <IcProfile className="size-[24px] text-icon-secondary" />
          </button>
        }
        right={
          <Link to={'/explore/search'} className="size-[40px] flex-center">
            <IcSearch className="size-[24px] text-icon-secondary" />
          </Link>
        }
        content={
          <div className="center">
            <IcLogo className="w-[102px] h-[26px]" />
          </div>
        }
      />

      <HeaderOffsetLayout>
        {/* banner */}
        <div className="py-[12px] px-[16px] w-full h-fit">
          <button
            type="button"
            className="self-stretch h-14 w-full min-w-28 px-4 py-3 bg-accent rounded-[12px] inline-flex justify-center items-center gap-28"
          >
            <div className="flex-1 flex items-center">
              <div className="flex items-center gap-2">
                <IcLibrary className="size-[20px] text-icon-accent" />
                <Text typo="body-1-bold" color="secondary">
                  공개할 수 있는 퀴즈가{' '}
                  <Text as="span" typo="body-1-bold" color="accent">
                    3개
                  </Text>{' '}
                  있어요
                </Text>
              </div>
            </div>
            <IcChevronRight className="size-[16px] text-icon-secondary" />
          </button>
        </div>

        <div
          className="py-[42px] flex flex-col gap-[10px] bg-[radial-gradient(closest-side,_var(--tw-gradient-stops))]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-gray-100) 0%, var(--color-gray-50) 40%)',
          }}
        >
          <Marquee gradient={false} speed={20} direction="left">
            {exampleQuestions.map((item, index) => (
              <QuestionBox key={index} emoji={item.emoji} question={item.question} className="mr-[8px]" />
            ))}
          </Marquee>
          <Marquee gradient={false} speed={20} direction="right">
            {exampleQuestions.map((item, index) => (
              <QuestionBox key={index} emoji={item.emoji} question={item.question} className="mr-[8px]" />
            ))}
          </Marquee>
          <Marquee gradient={false} speed={20} direction="left">
            {exampleQuestions.map((item, index) => (
              <QuestionBox key={index} emoji={item.emoji} question={item.question} className="mr-[8px]" />
            ))}
          </Marquee>
        </div>

        <div className="pt-[25px]">
          <Text as="h2" typo="h3" className="px-[16px] mb-[12px]">
            오늘의 퀴즈
          </Text>

          <motion.div
            className={cn(
              'w-full py-[8px] sticky z-50 bg-[linear-gradient(to_bottom,#F8F8F7_28%,rgba(245,245,245,0)_100%)] top-[var(--header-height-safe)]',
            )}
          >
            <HorizontalScrollContainer
              gap={6}
              moveRatio={0.5}
              items={categories.map((category, index) => (
                <Chip
                  key={index}
                  variant={category.name === activeTab ? 'selected' : 'darken'}
                  left={category.name === activeTab ? category.emoji : undefined}
                  onClick={() => setTab(category.name as Tab)}
                  className={cn(index === 0 && 'ml-[16px]')}
                >
                  {category.name}
                </Chip>
              ))}
            />
          </motion.div>

          <div className="w-full h-[calc(100vh-184px)] p-[16px] pt-[36px] flex flex-col items-center gap-[10px] overflow-hidden">
            <VerticalSwipeList />
          </div>
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExplorePage, {
  activeTab: '탐험',
  navClassName: 'border-t border-divider',
  backgroundClassName: 'bg-surface-2 h-fit',
})

const QuestionBox = ({
  emoji,
  question,
  className,
}: {
  emoji: string
  question: string
  className?: HTMLElement['className']
}) => {
  return (
    <div
      className={cn('px-2.5 py-1.5 bg-base-1 rounded-lg inline-flex justify-center items-center gap-2.5', className)}
    >
      <div className="flex items-center gap-1">
        <Text typo="body-2-medium" color="secondary" className="leading-none">
          {emoji} {question}
        </Text>
      </div>
    </div>
  )
}

function VerticalSwipeList() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperCore>(null)

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const swiperTopOffset = swiperRef.current?.el?.getBoundingClientRect().top ?? 0
      const scrollingUp = event.deltaY < 0

      if (!swiperRef.current) return

      if (swiperTopOffset <= 136) {
        if (scrollingUp && activeIndex === 0) {
          // 위로 스크롤 + 첫 번째 카드일 때 swiper 비활성화
          swiperRef.current.mousewheel.disable()
          swiperRef.current.allowTouchMove = false
        } else {
          // 그 외에는 swiper 활성화
          swiperRef.current.mousewheel.enable()
          swiperRef.current.allowTouchMove = true
        }
      } else {
        // swiper가 화면 아래쪽이면 swiper 비활성화
        swiperRef.current.mousewheel.disable()
        swiperRef.current.allowTouchMove = false
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleScroll)
    }
  }, [activeIndex])

  return (
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
      style={{ height: '508px', width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <SwiperSlide key={index}>
          <div
            className={cn(
              'w-[311px] h-[462px] relative bg-gradient-to-b from-bg-surface-1 to-bg-accent rounded-[20px] shadow-[0px_4px_28px_0px_rgba(0,0,0,0.10)] overflow-hidden transition-transform duration-300 swiper-slide-active:scale-110',
              activeIndex === index && 'scale-110',
            )}
          >
            card {index + 1}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
