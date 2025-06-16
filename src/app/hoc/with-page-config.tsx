import { isMobile } from 'react-device-detect'

import { TabNavigation } from '@/shared/components/tab-navigation'
import { cn } from '@/shared/lib/utils'

interface Props {
  backgroundClassName?: HTMLElement['className']
  activeTab?: React.ComponentProps<typeof TabNavigation>['activeTab']
  navClassName?: HTMLElement['className']
}

export function withHOC<P extends object>(Component: React.ComponentType<P>, config: Props) {
  const backgroundClass = config.backgroundClassName ?? 'bg-surface-1'

  const checkPWA = () => {
    const isIOSStandalone =
      typeof window !== 'undefined' && 'standalone' in window.navigator && window.navigator.standalone
    const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches

    return isIOSStandalone || isStandaloneMedia
  }

  const accessMobileWeb = !checkPWA() && isMobile

  return (props: P) => (
    <div
      id="hoc"
      className={cn(
        'relative size-full safe-area-space overscroll-none',
        backgroundClass,
        config.activeTab && !accessMobileWeb && 'pb-[var(--spacing-tab-navigation)]',
        // before pseudo-element에 필요한 클래스들
        "before:content-['']",
        'before:absolute before:top-0 before:left-0 before:z-50',
        'before:h-[env(safe-area-inset-top)] before:w-full',
        `before:${backgroundClass}`,
      )}
    >
      <Component {...props} />

      {config.activeTab && !accessMobileWeb && (
        <TabNavigation activeTab={config.activeTab} className={config.navClassName} />
      )}
    </div>
  )
}
