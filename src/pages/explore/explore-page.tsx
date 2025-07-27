import { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'

import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'
import QuizListContainer from '@/features/explore/ui/quiz-list-container'

import { useGetCategories } from '@/entities/category/api/hooks'

import { IcClose, IcFile, IcLogo, IcNotification, IcSearch } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { Chip } from '@/shared/components/ui/chip'
import { Drawer, DrawerContent, DrawerHeader } from '@/shared/components/ui/drawer'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import useBreakpoint from '@/shared/hooks/use-breakpoint'
import { useHorizontalScrollWheel } from '@/shared/hooks/use-horizontal-scroll-wheel'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useScrollRestoration } from '@/shared/hooks/use-scroll-restoration'
import { Link, useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const ExplorePage = () => {
  const { isDesktopSize } = useBreakpoint()

  const token = useStore(useAuthStore, (state) => state.token)

  const router = useRouter()
  const { isPWA, isLoading: isPWALoading } = usePWA()

  const listScrollRef = useScrollRestoration<HTMLDivElement>('explore-page', {
    restoreDelay: 50,
    threshold: 50,
    onRestoreComplete: () => {
      setIsScrollRestoring(false)
    },
  })
  const [hideHeader, setHideHeader] = useState(false)
  const [isScrollRestoring, setIsScrollRestoring] = useState(true)

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isAppDownloadBannerOpen, setIsAppDownloadBannerOpen] = useState(false)
  const [isAppDownloadDrawerOpen, setIsAppDownloadDrawerOpen] = useState(false)

  const handleAppDownloadBannerClick = () => {
    if (!isMobile) {
      setIsAppDownloadDrawerOpen(true)
      return
    }
    router.push('/install-guide')
  }

  const handleNotificationClick = () => {
    if (!token) {
      setIsLoginOpen(true)
      return
    }

    router.push('/account/notification-config')
  }

  useEffect(() => {
    const element = listScrollRef.current
    if (!element) return

    let prevScrollY = element.scrollTop

    const handleScroll = () => {
      // 스크롤 복원 중일 때는 헤더 상태 변경하지 않음
      if (isScrollRestoring) return

      const currentY = element.scrollTop
      if (currentY > prevScrollY && currentY > 0) {
        setHideHeader(true)
      } else {
        setHideHeader(false)
      }
      prevScrollY = currentY
    }

    element.addEventListener('scroll', handleScroll)
    return () => element.removeEventListener('scroll', handleScroll)
  }, [isScrollRestoring])

  useEffect(() => {
    if (isPWALoading) return

    if (!isPWA && (isMobile || !isDesktopSize)) {
      // PWA가 아닌 환경에서, 모바일 기기 또는 pc에서 사이드에 qr을 표시하지 못하는 화면 사이즈일 경우, 앱 다운로드 배너를 열도록 설정
      setIsAppDownloadBannerOpen(true)
    } else {
      setIsAppDownloadBannerOpen(false)
    }
  }, [isPWALoading, isPWA, isMobile, isDesktopSize])

  return (
    <>
      <Header
        className={cn('bg-surface-2', hideHeader ? 'pointer-events-none' : '')}
        style={{
          transition: hideHeader
            ? 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1) 0.15s'
            : 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: hideHeader ? 'translateY(calc(-1 * var(--header-height)))' : 'translateY(0)',
          opacity: hideHeader ? 0 : 1,
        }}
        left={
          <div className="pl-[8px]">
            <IcLogo className="w-[102px] h-[26px]" />
          </div>
        }
        right={
          <div className="flex">
            <Link to={'/explore/search'} className="size-[40px] flex-center">
              <IcSearch className="size-[24px]" />
            </Link>
            <button onClick={handleNotificationClick} className="size-[40px] flex-center">
              <IcNotification className="size-[24px]" />
            </button>
          </div>
        }
      />

      <HeaderOffsetLayout
        ref={listScrollRef}
        className={cn(
          'overscroll-none h-full overflow-y-auto scrollbar-hide',
          isMobile && !isPWA && 'h-[calc(100dvh-var(--safe-area-inset-top)-var(--safe-area-inset-bottom))]',
          hideHeader && 'pt-0',
          hideHeader && !isMobile && 'h-[calc(100vh-var(--spacing-tab-navigation))]',
          hideHeader && isMobile && isPWA && 'h-[calc(100vh-var(--safe-area-inset-top)-var(--spacing-tab-navigation))]',
        )}
      >
        <div className="pt-[48px]">
          {/* 앱 다운로드 배너 */}
          {isAppDownloadBannerOpen && (
            <AppDownloadBanner
              onClick={handleAppDownloadBannerClick}
              onClose={() => setIsAppDownloadBannerOpen(false)}
              hideHeader={hideHeader}
            />
          )}
          {/* pc 화면에서 다운로드 배너 클릭 시 노출될 QR코드 drawer */}
          <DesktopDownloadQRDrawer open={isAppDownloadDrawerOpen} onOpenChange={setIsAppDownloadDrawerOpen} />

          {/* 카테고리 선택 탭 */}
          <CategoryTab hideHeader={hideHeader} />

          {/* 퀴즈 리스트 영역 */}
          <QuizListContainer scrollRef={listScrollRef} />

          {/* 로그인 모달 */}
          <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />

          {/* 새로운 퀴즈 만들기 버튼 */}
          <CreateQuizButton hide={hideHeader} />
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

// 카테고리 선택 탭 컴포넌트
const CategoryTab = ({ hideHeader }: { hideHeader: boolean }) => {
  const { trackEvent } = useAmplitude()

  const { data: categoryData, isLoading } = useGetCategories()

  const [params, setParams] = useQueryParam('/explore')
  const activeCategory = params.category

  const setCategory = (categoryId: number) => {
    setParams({ ...params, category: categoryId })
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalScrollWheel(scrollRef)

  return (
    <div
      ref={scrollRef}
      className={cn(
        'fixed top-[var(--header-height-safe)] left-1/2 -translate-x-1/2 w-full max-w-xl z-10 bg-[linear-gradient(to_bottom,#F8F8F7_25%,rgba(245,245,245,0)_100%)] flex gap-[6px] overflow-x-auto scrollbar-hide px-[8px] py-[8px]',
        'transition-transform duration-300',
        hideHeader ? '-translate-y-[var(--header-height)]' : 'translate-y-0',
      )}
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
            onClick={() => setCategory(0)}
            className={cn('px-[13.5px] ml-[16px]')}
          >
            전체
          </Chip>

          {/* Chip 요소들 */}
          {categoryData &&
            categoryData.map((category, index) => (
              <Chip
                key={index}
                variant={category.id === activeCategory ? 'selected' : 'darken'}
                onClick={() => {
                  setCategory(category.id)
                  trackEvent('explore_category_click', {
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
  )
}

// 새로운 퀴즈 만들기 버튼 컴포넌트
const CreateQuizButton = ({ hide }: { hide: boolean }) => {
  const { trackEvent } = useAmplitude()
  const token = useStore(useAuthStore, (state) => state.token)

  const { isPWA } = usePWA()
  const router = useRouter()

  return (
    <button
      className={cn(
        'absolute bg-base-3 rounded-full bottom-[12px] left-1/2 -translate-x-1/2 h-[48px] w-[calc(100%-32px)] border border-box shadow-[var(--shadow-drop)]',
        'transition-opacity duration-300',
        hide ? 'opacity-0 pointer-events-none' : 'opacity-100',
        (!isMobile || isPWA) && 'bottom-[calc(var(--spacing-tab-navigation)+12px)]',
      )}
      onClick={() => {
        if (!token) {
          router.push('/login')
          return
        }

        router.push('/note/create', {
          search: {
            documentType: 'TEXT',
          },
        })
        trackEvent('generate_new_click', {
          format: '텍스트 버튼',
          location: '데일리 페이지',
        })
      }}
    >
      <Text typo="subtitle-2-medium" color="sub" className="center">
        새로운 퀴즈 만들기...
      </Text>
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (!token) {
            router.push('/login')
            return
          }

          router.push('/note/create', {
            search: {
              documentType: 'FILE',
            },
          })
          trackEvent('generate_new_click', {
            format: '파일 버튼',
            location: '데일리 페이지',
          })
        }}
        className="flex-center bg-orange-500 rounded-full size-10 absolute right-1 bottom-1/2 translate-y-1/2"
      >
        <IcFile className="size-5 text-white" />
      </button>
    </button>
  )
}

// 앱 다운로드 배너 컴포넌트
const AppDownloadBanner = ({
  onClick,
  onClose,
  hideHeader,
}: {
  onClick: () => void
  onClose: () => void
  hideHeader: boolean
}) => {
  return (
    <div
      className={cn(
        'absolute top-[var(--header-height-safe)] z-[9999] w-full flex items-center justify-between px-[16px] h-[72px] bg-surface-1 cursor-pointer',
        'transition-transform duration-300',
        hideHeader ? '-translate-y-[var(--header-height)]' : 'translate-y-0',
      )}
      onClick={onClick}
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
            strokeWidth="1.13953"
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
          onClose()
        }}
      >
        <IcClose className="size-[16px]" />
      </button>
    </div>
  )
}

// pc 화면에서 다운로드 배너 클릭 시 노출될 QR코드 drawer 컴포넌트
const DesktopDownloadQRDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent height="lg" hasHandle={false}>
        <div className="flex justify-end items-center">
          <button onClick={() => onOpenChange(false)}>
            <IcClose className="size-[24px] text-icon-secondary" />
          </button>
        </div>

        <DrawerHeader className="flex-center flex-col gap-[8px]">
          <Text typo="subtitle-1-bold" color="sub" className="text-center">
            픽토스 앱 다운로드
          </Text>
          <Text typo="h3" className="text-center">
            스토어 방문 없이 3초만에 <br />
            픽토스에서 매일 성장해보세요!
          </Text>
        </DrawerHeader>

        <div className="flex-center pt-[20px] pb-[32px]">
          <Text typo="subtitle-2-medium" color="accent">
            * 휴대폰으로 QR코드를 촬영해주세요
          </Text>
        </div>

        <div className="relative size-[250px] w-full flex-center">
          <div className="absolute">
            <FocusBox />
          </div>

          <img
            src="/images/QR_picktoss_app_install.png"
            alt="픽토스 앱 다운로드 QR코드"
            className="w-[208px] h-[208px]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const FocusBox = () => {
  return (
    <svg width="252" height="252" viewBox="0 0 252 252" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.7146 11.1431C14.9807 11.1431 11.1431 14.9807 11.1431 19.7146V35.1431C11.1431 37.9835 8.8406 40.286 6.00028 40.286C3.15996 40.286 0.857422 37.9835 0.857422 35.1431V19.7146C0.857422 9.30003 9.30006 0.857422 19.7146 0.857422H35.1431C37.9835 0.857422 40.286 3.15996 40.286 6.00028C40.286 8.8406 37.9835 11.1431 35.1431 11.1431H19.7146Z"
        fill="#FB8320"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M232.283 11.1431C237.017 11.1431 240.855 14.9807 240.855 19.7146V35.1431C240.855 37.9835 243.157 40.286 245.998 40.286C248.838 40.286 251.141 37.9835 251.141 35.1431V19.7146C251.141 9.30003 242.698 0.857422 232.283 0.857422H216.855C214.015 0.857422 211.712 3.15996 211.712 6.00028C211.712 8.8406 214.015 11.1431 216.855 11.1431H232.283Z"
        fill="#FB8320"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.7146 240.857C14.9807 240.857 11.1431 237.019 11.1431 232.285V216.857C11.1431 214.017 8.8406 211.714 6.00028 211.714C3.15996 211.714 0.857422 214.017 0.857422 216.857V232.285C0.857422 242.7 9.30006 251.143 19.7146 251.143H35.1431C37.9835 251.143 40.286 248.84 40.286 246C40.286 243.159 37.9835 240.857 35.1431 240.857H19.7146Z"
        fill="#FB8320"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M232.283 240.857C237.017 240.857 240.855 237.019 240.855 232.285V216.857C240.855 214.017 243.157 211.714 245.998 211.714C248.838 211.714 251.141 214.017 251.141 216.857V232.285C251.141 242.7 242.698 251.143 232.283 251.143H216.855C214.015 251.143 211.712 248.84 211.712 246C211.712 243.159 214.015 240.857 216.855 240.857H232.283Z"
        fill="#FB8320"
      />
    </svg>
  )
}
