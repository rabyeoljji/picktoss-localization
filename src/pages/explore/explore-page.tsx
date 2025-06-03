import { useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import QuizVerticalSwipe from '@/features/explore/ui/quiz-vertical-swipe'

import { useGetCategories } from '@/entities/category/api/hooks'

import { IcClose, IcLogo, IcProfile, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Chip } from '@/shared/components/ui/chip'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useHorizontalScrollWheel } from '@/shared/hooks/use-horizontal-scroll-wheel'
import { usePWA } from '@/shared/hooks/use-pwa'
import { Link, useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const ExplorePage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()
  const { isPWA } = usePWA()
  const [isAppDownloadBannerOpen, setIsAppDownloadBannerOpen] = useState(!isPWA && isMobile)

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
        className={cn('transition-all duration-300 ease-in-out', 'bg-surface-2 px-[8px]')}
        left={
          <button onClick={() => router.push('/account')} className="size-[40px] flex-center">
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
        {isAppDownloadBannerOpen && (
          <div
            className="absolute z-[9999] w-full flex items-center justify-between px-[16px] h-[72px] bg-surface-1"
            onClick={() => router.push('/install-guide')}
          >
            <div className="flex-center gap-[15.5px]">
              <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="4.56977"
                  y="4.56977"
                  width="47.8605"
                  height="47.8605"
                  rx="8.54651"
                  fill="white"
                  stroke="#EBEBE8"
                  stroke-width="1.13953"
                />
                <path
                  d="M39.9492 16.2877C39.9492 16.2877 39.9174 16.2928 39.903 16.2989C33.3133 17.9712 26.2954 20.3001 21.1054 24.9054C18.9004 26.8656 17.1466 29.4193 16.9644 32.4508C16.6796 37.1925 20.2765 41.267 24.9978 41.5506C26.9414 41.6673 28.8907 41.1056 30.4788 39.97C32.0049 38.8764 33.0446 37.2506 33.8917 35.5675C35.2005 32.9589 38.8393 25.8441 38.8393 25.8441C38.9659 25.602 38.7268 25.3274 38.4721 25.4281C37.2661 25.6828 34.5617 26.5122 33.5272 27.1183C33.3857 27.2012 33.2153 27.0644 33.2632 26.909C33.7224 25.3855 34.7711 23.9009 35.5975 22.621C36.9763 20.481 38.5295 18.5272 40.2822 16.691C40.3381 16.6346 40.3947 16.5677 40.3995 16.487C40.4111 16.2943 40.1472 16.2573 39.949 16.2912L39.9492 16.2877Z"
                  fill="url(#paint0_radial_4092_43606)"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial_4092_43606"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(19.6401 39.197) rotate(-68.4287) scale(15.2036 13.0536)"
                  >
                    <stop stop-color="#C7D6FF" />
                    <stop offset="1" stop-color="#FF7B18" />
                  </radialGradient>
                </defs>
              </svg>
              <div>
                <Text typo="body-2-medium" color="sub">
                  앱에서 매일 간편하게 퀴즈를 풀어보세요!
                </Text>
                <Text typo="subtitle-2-bold">픽토스 앱 다운로드</Text>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsAppDownloadBannerOpen(false)
              }}
            >
              <IcClose className="size-[16px]" />
            </button>
          </div>
        )}
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
                      onClick={() => {
                        setCategory(category.id)
                        trackEvent('explore_tab_click', {
                          category: category.name as
                            | '전체'
                            | '자격증·수험'
                            | '학문·전공'
                            | 'IT·개발'
                            | '재테크·시사'
                            | '언어'
                            | '상식·교양',
                        })
                      }}
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
