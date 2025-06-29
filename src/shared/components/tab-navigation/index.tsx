import { useState } from 'react'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'

import { IcDaily, IcExplore, IcLibrary } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { usePWA } from '@/shared/hooks/use-pwa'
import { RoutePath } from '@/shared/lib/router'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const navItems = [
  {
    label: '데일리',
    to: RoutePath.root,
    icon: <IcDaily />,
  },
  {
    label: '탐험',
    to: RoutePath.explore,
    icon: <IcExplore />,
  },
  {
    label: '도서관',
    to: RoutePath.library,
    icon: <IcLibrary />,
  },
] as const

interface TabNavigationProps {
  activeTab: (typeof navItems)[number]['label']
  className?: HTMLElement['className']
}

export const TabNavigation = ({ activeTab = '데일리', className }: TabNavigationProps) => {
  const token = useStore(useAuthStore, (state) => state.token)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { trackEvent } = useAmplitude()

  const router = useRouter()
  const { isPWA } = usePWA()

  const handleNavigation = (to: (typeof navItems)[number]['to']) => {
    if (!token) {
      setIsLoginOpen(true)
      return
    }

    if (to === '/') {
      trackEvent('daily_click')
    } else if (to === '/explore') {
      trackEvent('explore_click')
    } else if (to === '/library') {
      trackEvent('library_click')
    }

    if (isPWA) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }

  return (
    <>
      <div className={cn('h-tab-navigation bg-surface-2 fixed bottom-0 w-full max-w-xl', className)}>
        <div className="mx-auto flex max-w-[500px] justify-between px-[52px] pt-2.5">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === activeTab} handleNavigation={handleNavigation} />
          ))}
        </div>
      </div>
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}

interface NavItemProps {
  label: string
  to: (typeof navItems)[number]['to']
  icon: React.ReactNode
  active?: boolean
  handleNavigation: (to: (typeof navItems)[number]['to']) => void
}

const NavItem = ({ icon, to, label, active = false, handleNavigation }: NavItemProps) => {
  return (
    <button
      onClick={() => handleNavigation(to)}
      className={cn(
        'flex-center text-icon-sub h-[46px] w-[48px] flex-col gap-1 [&_svg]:size-6',
        active && 'text-primary',
      )}
    >
      {icon}
      <Text typo="body-2-medium" color={active ? 'primary' : 'sub'}>
        {label}
      </Text>
    </button>
  )
}
