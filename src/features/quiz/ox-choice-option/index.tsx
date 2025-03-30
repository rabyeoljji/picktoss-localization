import * as React from 'react'

import { CircleIcon, XIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export interface OXChoiceOptionProps extends React.HTMLAttributes<HTMLButtonElement> {
  O: boolean
  X: boolean
  selectedOption: string | null
  className?: HTMLButtonElement['className']
}

export const OXChoiceOption = ({ O, X, selectedOption, className, ...props }: OXChoiceOptionProps) => {
  // const isSelected = selectedOption === (O ? 'correct' : 'incorrect')

  return (
    <button
      className={cn(
        selectedOption != null && 'cursor-default',
        'transition-all flex-center rounded-[20px] aspect-[165/126]',
        O && 'bg-blue-strong text-icon-inverse',
        X && 'bg-orange-strong text-icon-inverse',
        className,
      )}
      {...props}
    >
      {O && <CircleIcon className="size-16 stroke-[3]" />}
      {X && <XIcon className="size-16 stroke-[3]" />}
    </button>
  )
}
