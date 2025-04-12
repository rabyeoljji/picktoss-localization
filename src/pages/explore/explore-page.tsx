import Marquee from 'react-fast-marquee'
import { useSearchParams } from 'react-router'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Chip } from '@/shared/components/ui/chip'
import HorizontalScrollContainer from '@/shared/components/ui/horizontal-scroll-container'
import { Text } from '@/shared/components/ui/text'
import { Link, RoutePath } from '@/shared/lib/router'
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

type Tab = '전체' | '학문·전공' | '자격증·수험' | 'IT·개발' | '재테크·시사' | '상식·교양' | '언어'
const TabValues = ['전체', '학문·전공', '자격증·수험', 'IT·개발', '재테크·시사', '상식·교양', '언어']

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsTab = searchParams.get('tab') ?? ''

  const activeTab = TabValues.includes(paramsTab) ? (paramsTab as Tab) : '전체'

  const setTab = (tab: Tab) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('tab', tab)
    setSearchParams(newSearchParams)
  }

  return (
    <>
      <Header
        className="bg-surface-2 py-[9px] px-[8px]"
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

          <div className="w-full py-[8px]">
            <HorizontalScrollContainer
              gap={6}
              moveRatio={0.5}
              items={categories.map((category, index) => (
                <Chip
                  key={index}
                  variant={category.name === activeTab ? 'selected' : 'darken'}
                  left={category.name === activeTab ? category.emoji : undefined}
                  onClick={() => TabValues.includes(category.name) && setTab(category.name as Tab)}
                  className={cn(index === 0 && 'ml-[16px]')}
                >
                  {category.name}
                </Chip>
              ))}
            />
          </div>
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExplorePage, {
  activeTab: '탐험',
  navClassName: 'border-t border-divider',
  backgroundColor: 'bg-surface-2',
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
