import { Loader2 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

type SpinnerProps = {
  className?: HTMLElement['className']
}

export const Spinner = ({ className }: SpinnerProps) => {
  return <Loader2 className={cn('animate-spin size-3', className)} />
}
