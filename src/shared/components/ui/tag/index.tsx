import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const tagVariants = cva('inline-flex py-[2px]', {
  variants: {
    color: {
      special: 'text-inverse bg-gradient-to-r from-orange-500 from-30% to-blue-400',
      ['orange-strong']: 'bg-orange-strong text-inverse',
      ['blue-strong']: 'bg-blue-strong text-inverse',
      orange: 'bg-orange text-inverse',
      ['orange-weak']: 'bg-accent text-accent',
      gray: 'bg-surface-2 text-secondary',
      green: 'bg-correct text-correct',
      red: 'bg-incorrect text-incorrect',
    },
    size: {
      md: 'px-[8px] rounded-[8px] typo-body-2-bold',
      sm: 'px-[6px] rounded-[4px] typo-caption-medium',
    },
  },
  defaultVariants: {
    color: 'gray',
    size: 'sm',
  },
})

const Tag = ({
  className,
  color,
  size,
  children,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof tagVariants>) => {
  return (
    <div data-slot="tag" className={cn(tagVariants({ color, size, className }))} {...props}>
      {children}
    </div>
  )
}

export { Tag, tagVariants }
