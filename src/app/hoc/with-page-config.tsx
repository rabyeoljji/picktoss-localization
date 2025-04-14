import { TabNavigation } from '@/shared/components/tab-navigation'
import { cn } from '@/shared/lib/utils'

interface Props {
  backgroundClassName?: HTMLElement['className']
  activeTab?: React.ComponentProps<typeof TabNavigation>['activeTab']
  navClassName?: HTMLElement['className']
}

export function withHOC<P extends object>(Component: React.ComponentType<P>, config: Props) {
  const backgroundClass = config.backgroundClassName ?? 'bg-surface-1'

  return (props: P) => (
    <div
      className={cn(
        'relative size-full safe-area-space',
        backgroundClass,
        config.activeTab && 'pb-[var(--spacing-tab-navigation)]',
        // before pseudo-element에 필요한 클래스들
        "before:content-['']",
        'before:absolute before:top-0 before:left-0 before:z-50',
        'before:h-[env(safe-area-inset-top)] before:w-full',
        `before:${backgroundClass}`,
      )}
    >
      <Component {...props} />

      {config.activeTab && <TabNavigation activeTab={config.activeTab} className={config.navClassName} />}
    </div>
  )
}
