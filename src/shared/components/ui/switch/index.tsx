import * as React from 'react'

import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/shared/lib/utils'

function Switch({
  className,
  size = 'md',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'md'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex shrink-0 items-center rounded-full outline-none disabled:cursor-default disabled:bg-gray-100 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-200',
        [size === 'md' && 'h-5 w-9'],
        [size === 'sm' && 'h-4 w-[30px]'],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-gray-white pointer-events-none block rounded-full transition-transform',
          [size === 'md' && 'size-4 data-[state=checked]:translate-x-[2px] data-[state=unchecked]:translate-x-[18px]'],
          [size === 'sm' && 'size-3 data-[state=checked]:translate-x-[2px] data-[state=unchecked]:translate-x-[16px]'],
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
