import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/shared/lib/utils'

function Selectbox({ className, children, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer flex-center w-full px-[16px] py-[14px] m-0 cursor-pointer rounded-[10px] border border-outline bg-base-1 text-secondary typo-body-1-medium outline-none disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-50 disabled:text-disabled data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </CheckboxPrimitive.Root>
  )
}

export { Selectbox }
