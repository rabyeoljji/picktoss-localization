import * as React from 'react'

import { cn } from '@/shared/lib/utils'

interface SelectCardProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  selected?: boolean
  disabled?: boolean
}

function SelectCard({ className, children, selected, disabled, ...props }: SelectCardProps) {
  return (
    <label
      {...props}
      className={cn(
        'peer flex-center px-[20px] pt-[20px] pb-[12px] shrink-0 m-0 cursor-pointer rounded-[16px] border border-outline bg-white text-secondary outline-none ',
        selected && 'border-accent bg-accent text-accent',
        disabled && 'cursor-default border-gray-100 bg-gray-50 text-disabled',
        className,
      )}
    >
      {children}
    </label>
  )
}

export { SelectCard }
