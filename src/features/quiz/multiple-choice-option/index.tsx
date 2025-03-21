import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'
import { CheckIcon, XIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const multipleChoiceOptionVariants = cva(
  'relative flex items-center cursor-pointer gap-3 typo-subtitle-2-medium text-secondary bg-base-1 border-outline rounded-[16px] border py-3 px-[10px] transition-all disabled:text-disabled disabled:bg-disabled',
  {
    variants: {
      state: {
        default: 'hover:bg-active',
        correct: 'bg-correct border-correct text-correct',
        incorrect: 'bg-disabled text-disabled',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

export interface MultipleChoiceOptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multipleChoiceOptionVariants> {
  label?: string
  content: string
  showIcon?: boolean
}

export const MultipleChoiceOption = ({
  className,
  state,
  label,
  content,
  showIcon = true,
  ...props
}: MultipleChoiceOptionProps) => {
  return (
    <div className={cn(multipleChoiceOptionVariants({ state, className }))} {...props}>
      {label && (
        <div className="flex items-center justify-center rounded-full bg-gray-100 text-gray-900 size-[32px]">
          <span className="typo-button-3">{label}</span>
        </div>
      )}
      <span className="typo-body-2 flex-1">{content}</span>
      {showIcon && state === 'correct' && (
        <div className="flex items-center justify-center rounded-full bg-green-500 text-white size-[32px]">
          <CheckIcon className="size-5" />
        </div>
      )}
      {showIcon && state === 'incorrect' && (
        <div className="flex items-center justify-center rounded-full bg-red-500 text-white size-[32px]">
          <XIcon className="size-5" />
        </div>
      )}
    </div>
  )
}
