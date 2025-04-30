import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const buttonSolidIconVariants = cva(
  "relative inline-flex items-center rounded-full cursor-pointer justify-center whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200 group data-[state=loading]:cursor-default",
  {
    variants: {
      variant: {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 data-[state=loading]:bg-orange-400',
        special: 'text-white bg-[linear-gradient(300deg,_var(--color-orange-500)_20%,_var(--color-blue-400)_93%)]',
        secondary: 'text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
        tertiary: 'border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100',
      },
      size: {
        lg: 'size-[52px]',
        md: 'size-[40px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

function ButtonSolidIcon({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonSolidIconVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp data-slot="button" className={cn(buttonSolidIconVariants({ variant, size, className }))} {...props}>
      {children}
    </Comp>
  )
}

export { ButtonSolidIcon, buttonSolidIconVariants }
