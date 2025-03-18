import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const tagVariants = cva(
  'inline-flex size-fit items-center justify-center whitespace-nowrap rounded-[4px] px-[6px] py-[2px] transition-colors',
  {
    variants: {
      colors: {
        special: 'bg-gradient-to-r from-orange-500 to-blue-400 text-inverse !font-bold',
        primary: 'bg-orange-strong text-inverse !font-bold',
        'primary-hover': 'bg-orange-600 text-inverse',
        'primary-loading': 'bg-orange-400 text-inverse',
        info: 'bg-blue-strong text-inverse',
        disabled: 'bg-disabled text-icon-disabled',
        secondary: 'bg-accent text-accent',
        tertiary: 'bg-surface-3 text-secondary',
        right: 'bg-correct text-correct',
        wrong: 'bg-incorrect text-incorrect',
      },
      size: {
        md: 'typo-body-1-medium',
        sm: 'typo-caption-medium',
      },
    },
    defaultVariants: {
      colors: 'primary',
      size: 'sm',
    },
  },
)

interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({ className, colors, size, children, ...props }) => {
  return (
    <span className={cn(tagVariants({ colors, size }), className)} {...props}>
      {children}
    </span>
  )
})
Tag.displayName = 'Tag'

export default Tag
