import Marquee from 'react-fast-marquee'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import CategoriesHorizontalChips from '@/features/explore/ui/categories-horizontal-chips'
import QuizVerticalSwipe from '@/features/explore/ui/quiz-vertical-swipe'

import { useGetCategories } from '@/entities/category/api/hooks'

import { IcChevronRight, IcLibrary, IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import QuestionBox from '@/shared/components/items/question-box-item'
import { Text } from '@/shared/components/ui/text'
import { Link } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const exampleQuestions = [
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠 ', question: '프로세스는 무엇인가요?' },
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
  { emoji: '👠 ', question: '프로세스는 무엇인가요?' },
  { emoji: '🪶', question: '숏 전략은 매수하는 전략이다' },
]

const ExplorePage = () => {
  const { data } = useGetCategories()

  return (
    <>
      <Header
        className={cn('transition-all duration-300 ease-in-out', 'bg-surface-2 py-[9px] px-[8px]')}
        left={
          <button className="size-[40px] flex-center">
            <IcProfile className="size-[24px]" />
          </button>
        }
        right={
          <Link to={'/explore/search'} className="size-[40px] flex-center">
            <IcSearch className="size-[24px]" />
          </Link>
        }
        content={
          <div className="center">
            <IcLogo className="w-[102px] h-[26px]" />
          </div>
        }
      />

      <HeaderOffsetLayout>
        <div
          className="py-[55px] flex flex-col gap-[10px] bg-[radial-gradient(closest-side,_var(--tw-gradient-stops))]"
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

        <div className="pt-[56px]">
          <Text as="h2" typo="h3" className="px-[16px] mb-[12px]">
            실시간 퀴즈
          </Text>

          <CategoriesHorizontalChips categories={data} />

          <button
            type="button"
            className="self-stretch h-[48px] w-full min-w-28 px-[24px] py-[12px] mt-[8px] bg-transparent inline-flex justify-between items-center"
          >
            <div className="flex-1 flex items-center">
              <div className="flex items-center gap-2">
                <IcLibrary className="size-[20px] text-icon-accent" />
                <Text typo="body-1-bold" color="secondary" className="w-fit shrink-0">
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

          <QuizVerticalSwipe />
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExplorePage, {
  activeTab: '탐험',
  navClassName: 'border-t border-divider z-40',
  backgroundClassName: 'bg-surface-2 h-fit',
})
