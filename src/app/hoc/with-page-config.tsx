import { TabNavigation } from '@/shared/components/tab-navigation'
import { cn } from '@/shared/lib/utils'

interface Props {
  backgroundColor?: HTMLElement['className']
  activeTab?: React.ComponentProps<typeof TabNavigation>['activeTab']
}

export function withHOC<P extends object>(Component: React.ComponentType<P>, config: Props) {
  return (props: P) => (
    <div
      className={cn(
        'size-full safe-area-space',
        config.backgroundColor ?? 'bg-surface-1',
        config.activeTab && 'pb-tab-navigation',
      )}
    >
      <Component {...props} />

      {config.activeTab && <TabNavigation activeTab={config.activeTab} />}
    </div>
  )
}
