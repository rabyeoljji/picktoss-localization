import { TabNavigation } from '@/shared/components/tab-navigation'

interface Props {
  activeTab?: React.ComponentProps<typeof TabNavigation>['activeTab']
}

export function withHOC<P extends object>(Component: React.ComponentType<P>, config: Props) {
  return (props: P) => (
    <>
      <div className="pb-tab-navigation h-screen">
        <Component {...props} />
      </div>
      {config.activeTab && <TabNavigation activeTab={config.activeTab} />}
    </>
  )
}
