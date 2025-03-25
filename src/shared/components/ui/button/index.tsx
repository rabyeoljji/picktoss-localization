import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  "relative inline-flex items-center rounded-full cursor-pointer justify-center whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200 group data-[state=loading]:cursor-default",
  {
    variants: {
      variant: {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 data-[state=loading]:bg-orange-400',
        special: 'text-white bg-linear-110 from-orange-500 from-40% to-blue-400',
        secondary1: 'text-orange-500 bg-orange-100 hover:bg-orange-200 active:bg-orange-300',
        secondary2: 'text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
        tertiary: 'border border-gray-100 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      },
      size: {
        lg: 'typo-button-1 h-[52px] w-full',
        md: 'typo-button-3 h-[44px] w-fit px-4 py-3.5',
        sm: 'typo-button-3 h-[32px] min-w-[60px] px-2.5 py-2 w-fit',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  left,
  right,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    left?: React.ReactNode
    right?: React.ReactNode
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {left && (
        <div className={cn([size === 'sm' && '[&_svg]:size-4!'], [size === 'md' && '[&_svg]:size-5!'])}>{left}</div>
      )}
      <div className={cn('group-data-[state=loading]:hidden px-1')}>{children}</div>
      <div className="center hidden group-data-[state=loading]:block">
        <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="4" fill="#FFF7ED" />
          <circle cx="20" cy="4" r="4" fill="#FFF1D5" />
          <circle cx="36" cy="4" r="4" fill="#FFDEA9" />
        </svg>
      </div>
      {right && (
        <div className={cn([size === 'sm' && '[&_svg]:size-3!'], [size === 'md' && '[&_svg]:size-4!'])}>{right}</div>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
