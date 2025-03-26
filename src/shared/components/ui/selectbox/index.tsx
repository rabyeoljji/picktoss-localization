import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/shared/lib/utils'

function Selectbox({ className, children, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer flex-center px-[20px] pt-[20px] pb-[12px] shrink-0 m-0 cursor-pointer rounded-[20px] border border-outline bg-white text-secondary outline-none disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-50 disabled:text-disabled data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </CheckboxPrimitive.Root>
  )
}

export { Selectbox }
