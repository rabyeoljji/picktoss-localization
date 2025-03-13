import { usePWA } from "@/shared/hooks/use-pwa"
import { useRouter } from "@/shared/hooks/use-router"
import { Text } from "@/shared/components/ui/text"
import { cn } from "@/shared/lib/utils"
import { AppRoutes } from "@/app/routes/config"
import { IcCollection, IcHome, IcMy, IcQuiznote } from "@/shared/assets/icon"

const navItems = [
  {
    label: "홈",
    to: AppRoutes.root,
    icon: <IcHome />,
  },
  {
    label: "퀴즈노트",
    to: AppRoutes.notes,
    icon: <IcQuiznote />,
  },
  {
    label: "컬렉션",
    to: AppRoutes.collections,
    icon: <IcCollection />,
  },
  {
    label: "마이",
    to: AppRoutes.account,
    icon: <IcMy />,
  },
] as const

interface TabNavigationProps {
  activeTab: (typeof navItems)[number]["label"]
}

export const TabNavigation = ({ activeTab = "홈" }: TabNavigationProps) => {
  return (
    <div className="h-tab-navigation fixed bottom-0 w-full max-w-xl">
      <div className="flex justify-between px-[30px] pt-2.5">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} active={item.label === activeTab} />
        ))}
      </div>
    </div>
  )
}

interface NavItemProps {
  label: string
  to: string
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
        "flex-center text-icon-disabled h-[46px] w-[48px] flex-col gap-1 [&_svg]:size-6",
        active && "text-text-accent",
      )}
    >
      {icon}
      <Text typo="body-2-medium">{label}</Text>
    </button>
  )
}
