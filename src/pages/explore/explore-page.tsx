import { useRef } from 'react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import QuizVerticalSwipe from '@/features/explore/ui/quiz-vertical-swipe'

import { useGetCategories } from '@/entities/category/api/hooks'

import { IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Chip } from '@/shared/components/ui/chip'
import { useHorizontalScrollWheel } from '@/shared/hooks/use-horizontal-scroll-wheel'
import { Link, useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const ExplorePage = () => {
  const { data: categoryData, isLoading } = useGetCategories()

  const [params, setParams] = useQueryParam('/explore')
  const activeCategory = params.category

  const setCategory = (categoryId: number) => {
    setParams({ ...params, category: categoryId })
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalScrollWheel(scrollRef)

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
        <div className="">
          {/* 카테고리 선택 탭 */}
          <div
            ref={scrollRef}
            className="sticky top-[var(--header-height-safe)] z-50 bg-base-2 flex gap-[6px] overflow-x-auto scrollbar-hide px-[8px] py-[8px]"
          >
            {isLoading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <div key={'tab-skeleton-' + index} className="h-[30px] w-[82px] rounded-full bg-base-3 animate-pulse" />
              ))
            ) : (
              <>
                {/* 전체 */}
                <Chip
                  variant={activeCategory === 0 ? 'selected' : 'darken'}
                  left={activeCategory === 0 ? '💫' : undefined}
                  onClick={() => setCategory(0)}
                  className={cn('ml-[16px]')}
                >
                  전체
                </Chip>

                {/* Chip 요소들 */}
                {categoryData &&
                  categoryData.map((category, index) => (
                    <Chip
                      key={index}
                      variant={category.id === activeCategory ? 'selected' : 'darken'}
                      left={category.id === activeCategory ? category.emoji : undefined}
                      onClick={() => setCategory(category.id)}
                    >
                      {category.name}
                    </Chip>
                  ))}
              </>
            )}
          </div>

          {/* 카드 스와이프 영역 */}
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
