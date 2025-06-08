import { forwardRef } from 'react'

import { cn } from '@/shared/lib/utils'

const HeaderOffsetLayout = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('pt-[var(--header-height)]', className)} {...props}>
        {children}
      </div>
    )
  },
)

HeaderOffsetLayout.displayName = 'HeaderOffsetLayout'

export default HeaderOffsetLayout
