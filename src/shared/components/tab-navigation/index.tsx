import { useState } from 'react'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'

import { IcDaily, IcExplore, IcLibrary, IcMy } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { usePWA } from '@/shared/hooks/use-pwa'
import { Pathname, RoutePath } from '@/shared/lib/router'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface TabNavigationProps {
  activeTab: 'DAILY' | 'EXPLORE' | 'LIBRARY' | 'MY'
  className?: HTMLElement['className']
}

export const TabNavigation = ({ activeTab = 'DAILY', className }: TabNavigationProps) => {
  const token = useStore(useAuthStore, (state) => state.token)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()

  const router = useRouter()
  const { isPWA } = usePWA()

  const navItems = [
    {
      enum: 'DAILY',
      label: t('etc.데일리'),
      to: RoutePath.root,
      icon: <IcDaily />,
    },
    {
      enum: 'EXPLORE',
      label: t('etc.탐험'),
      to: RoutePath.explore,
      icon: <IcExplore />,
    },
    {
      enum: 'LIBRARY',
      label: t('etc.도서관'),
      to: RoutePath.library,
      icon: <IcLibrary />,
    },
    {
      enum: 'MY',
      label: t('etc.마이'),
      to: RoutePath.account,
      icon: <IcMy />,
    },
  ] as const

  const handleNavigation = (to: Pathname) => {
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
      router.replace(to, {})
    } else {
      router.push(to, {})
    }
  }

  return (
    <>
      <div
        className={cn(
          'h-tab-navigation bg-surface-2 border-t border-divider fixed bottom-0 w-full max-w-xl',
          className,
        )}
      >
        <div className="mx-auto flex max-w-[500px] justify-between px-[32px] pt-2.5">
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} active={item.enum === activeTab} handleNavigation={handleNavigation} />
          ))}
        </div>
      </div>
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}

interface NavItemProps {
  label: string
  to: Pathname
  icon: React.ReactNode
  active?: boolean
  handleNavigation: (to: Pathname) => void
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
      <Text typo="caption-medium" color={active ? 'primary' : 'sub'}>
        {label}
      </Text>
    </button>
  )
}
