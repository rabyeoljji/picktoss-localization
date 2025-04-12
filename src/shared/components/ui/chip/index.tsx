import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const chipVariants = cva(
  "relative size-fit inline-flex items-center rounded-full cursor-pointer justify-center typo-button-3 whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none disabled:bg-disabled disabled:text-disabled group data-[state=loading]:cursor-default py-[8px] px-[10px]",
  {
    variants: {
      variant: {
        default: 'bg-base-1 text-secondary hover:bg-base-2 border border-outline data-[state=loading]:bg-base-2',
        selected: 'text-inverse bg-inverse',
        activated: 'bg-base-1 text-accent border border-accent',
        darken: 'text-secondary bg-base-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Chip({
  className,
  variant,
  asChild = false,
  left,
  right,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof chipVariants> & {
    left?: React.ReactNode
    right?: React.ReactNode
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp data-slot="button" className={cn(chipVariants({ variant, className }))} {...props}>
      {left && <div>{left}</div>}
      <div className={cn('px-1')}>{children}</div>
      {right && <div>{right}</div>}
    </Comp>
  )
}

export { Chip, chipVariants }
