import * as React from 'react'

import { CheckIcon, XIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export interface MultipleChoiceOptionProps extends React.HTMLAttributes<HTMLButtonElement> {
  label?: string
  option: string
  selectedOption: string | null
  isCorrect: boolean
}

export const MultipleChoiceOption = ({
  label,
  option,
  selectedOption,
  isCorrect,
  ...props
}: MultipleChoiceOptionProps) => {
  const isSelected = selectedOption === option

  return (
    <button
      className={cn(
        'w-full transition-all flex items-center gap-3 py-3 px-2.5 rounded-[16px] ring-1',
        isCorrect ? 'bg-correct ring-success text-correct' : 'bg-disabled ring-outline text-disabled',
        selectedOption === null && 'bg-base-1 ring-outline text-secondary',
      )}
      {...props}
    >
      {selectedOption ? (
        <>
          {isCorrect && (
            <div className="flex items-center justify-center rounded-full bg-green-500 text-white size-[32px]">
              <CheckIcon className="size-5" />
            </div>
          )}
          {isSelected && !isCorrect && (
            <div className="flex items-center justify-center rounded-full bg-red-500 text-white size-[32px]">
              <XIcon className="size-5" />
            </div>
          )}
          {!isCorrect && !isSelected && (
            <div className="flex items-center justify-center rounded-full bg-gray-100 text-gray-900 size-[32px]">
              <span className="typo-button-3">{label}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center rounded-full bg-gray-100 text-gray-900 size-[32px]">
          <span className="typo-button-3">{label}</span>
        </div>
      )}

      <span className="typo-body-2 text-start flex-1">{option}</span>
    </button>
  )
}
