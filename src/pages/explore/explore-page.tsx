import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { IcLibrary, IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { BookmarkHorizontalCard } from '@/shared/components/cards/bookmark-horizontal-card'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Chip } from '@/shared/components/ui/chip'
import HorizontalScrollContainer from '@/shared/components/ui/horizontal-scroll-container'
import { Text } from '@/shared/components/ui/text'
import { Link, RoutePath, useQueryParam } from '@/shared/lib/router'
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

  const [isHeaderHidden, setIsHeaderHidden] = useState(false)

  type Tab = typeof params.tab

  const setTab = (tab: Tab) => {
    setParams({ ...params, tab })
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        // 스크롤을 내리면 헤더를 숨김
        setIsHeaderHidden(true)
      } else {
        // 스크롤을 올리면 헤더를 보여줌
        setIsHeaderHidden(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Header
        className={cn(
          'transition-all duration-300 ease-in-out',
          isHeaderHidden ? 'opacity-0 pointer-events-none' : 'opacity-100',
          'bg-surface-2 py-[9px] px-[8px]',
        )}
        left={
          <button className="size-[40px] flex-center">
            <IcProfile className="size-[24px] text-icon-secondary" />
          </button>
        }
        right={
          <Link to={RoutePath.exploreSearch} className="size-[40px] flex-center">
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
        <div className="py-[42px] flex flex-col gap-[10px]">
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

        <div className="pt-[22px]">
          <Text as="h2" typo="h4" className="px-[16px] mb-[12px]">
            실시간 퀴즈
          </Text>

          {isHeaderHidden && (
            <div className="fixed top-0 z-50 bg-surface-2 h-[env(safe-area-inset-top)] w-full p-2"></div>
          )}
          <div
            className={cn(
              'w-full py-[8px] sticky z-50 bg-[linear-gradient(to_bottom,#F8F8F7_25%,rgba(245,245,245,0)_100%)]',
              isHeaderHidden ? 'top-[env(safe-area-inset-top)]' : 'top-[var(--header-height-safe)]',
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
          </div>

          <div className="w-full p-[16px] flex flex-col gap-[10px]">
            {/* banner */}
            <div className="self-stretch h-14 w-full min-w-28 px-4 py-3 bg-base-1 rounded-[12px] inline-flex justify-center items-center gap-28">
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
              <Button variant={'secondary1'} size={'xs'}>
                확인하기
              </Button>
            </div>

            {/* content */}
            {Array.from({ length: 10 }).map((_, index) => (
              <Link key={index} to={RoutePath.noteDetail} params={[String(1)]}>
                <BookmarkHorizontalCard>
                  <BookmarkHorizontalCard.Left content="📄" />

                  <BookmarkHorizontalCard.Content>
                    <BookmarkHorizontalCard.Header
                      title="금융투자분석사 노트정리"
                      isBookmarked={true}
                      onClickBookmark={() => alert('click bookmark')}
                    />
                    <BookmarkHorizontalCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
                    <BookmarkHorizontalCard.Detail
                      quizCount={28}
                      playedCount={345}
                      bookmarkCount={21}
                      isShared={true}
                    />
                  </BookmarkHorizontalCard.Content>
                </BookmarkHorizontalCard>
              </Link>
            ))}
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
