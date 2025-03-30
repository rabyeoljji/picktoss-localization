import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const textButtonVariants = cva(
  "inline-flex items-center w-fit cursor-pointer justify-center whitespace-nowrap disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        secondary: 'text-gray-700',
        primary: 'text-orange-500',
        critical: 'text-red-500',
        sub: 'text-gray-500',
      },
      size: {
        lg: 'typo-button-2 gap-2 [&_svg]:size-5',
        md: 'typo-button-3 gap-1 [&_svg]:size-4',
        sm: 'typo-button-4 gap-1 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

function TextButton({
  className,
  variant,
  size,
  asChild = false,
  left,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof textButtonVariants> & {
    left?: React.ReactNode
    right?: React.ReactNode
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp data-slot="button" className={cn(textButtonVariants({ variant, size, className }))} {...props}>
      {left}
      {children}
    </Comp>
  )
}

export { TextButton, textButtonVariants }
