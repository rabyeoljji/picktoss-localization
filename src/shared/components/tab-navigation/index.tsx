import { IcCollection, IcHome, IcMy, IcQuiznote } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { usePWA } from '@/shared/hooks/use-pwa'
import { RoutePath } from '@/shared/lib/router'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const navItems = [
  {
    label: '홈',
    to: RoutePath.root,
    icon: <IcHome />,
  },
  {
    label: '퀴즈노트',
    to: RoutePath.note,
    icon: <IcQuiznote />,
  },
  {
    label: '컬렉션',
    to: RoutePath.collection,
    icon: <IcCollection />,
  },
  {
    label: '마이',
    to: RoutePath.account,
    icon: <IcMy />,
  },
] as const

interface TabNavigationProps {
  activeTab: (typeof navItems)[number]['label']
}

export const TabNavigation = ({ activeTab = '홈' }: TabNavigationProps) => {
  return (
    <div className="h-tab-navigation bg-surface-1 fixed bottom-0 w-full max-w-xl">
      <div className="mx-auto flex max-w-[500px] justify-between px-[30px] pt-2.5">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} active={item.label === activeTab} />
        ))}
      </div>
    </div>
  )
}

interface NavItemProps {
  label: string
  to: (typeof navItems)[number]['to']
  icon: React.ReactNode
  active?: boolean
}

const NavItem = ({ to, icon, label, active = false }: NavItemProps) => {
  const router = useRouter()
  const { isPWA } = usePWA()

  const handleNavigation = () => {
    if (isPWA) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }

  return (
    <button
      onClick={handleNavigation}
      className={cn(
        'flex-center text-icon-disabled h-[46px] w-[48px] flex-col gap-1 [&_svg]:size-6',
        active && 'text-primary',
      )}
    >
      {icon}
      <Text typo="body-2-medium">{label}</Text>
    </button>
  )
}
