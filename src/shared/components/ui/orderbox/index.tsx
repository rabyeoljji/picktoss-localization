import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

interface Props extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  order?: number
}

function Orderbox({ className, order = 1, ...props }: Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-[24px] shrink-0 cursor-pointer rounded-full border border-gray-200 bg-white outline-none disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex-center transition-none p-[1px]">
        {order > 0 && (
          <Text typo="body-2-bold" color="inverse">
            {order}
          </Text>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Orderbox }
