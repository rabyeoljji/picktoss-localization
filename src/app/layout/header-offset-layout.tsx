import { cn } from '@/shared/lib/utils'

const HeaderOffsetLayout = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: HTMLElement['className']
}) => {
  return <div className={cn('pt-[var(--header-height)]', className)}>{children}</div>
}

export default HeaderOffsetLayout
