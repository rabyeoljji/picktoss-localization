import { HTMLAttributes } from 'react'

import { ImgRoundCorrect, ImgRoundIncorrect } from '@/shared/assets/images'
import { cn } from '@/shared/lib/utils'

export interface MultipleChoiceOptionProps extends HTMLAttributes<HTMLButtonElement> {
  label?: string
  option: string
  selectedOption: string | null
  isCorrect: boolean
  animationDelay?: number
}

export const MultipleChoiceOption = ({
  label,
  option,
  selectedOption,
  isCorrect,
  className,
  animationDelay,
  ...props
}: MultipleChoiceOptionProps) => {
  const isSelected = selectedOption === option

  return (
    <button
      className={cn(
        'w-full transition-all flex items-center gap-3 py-3 px-2.5 rounded-[16px] ring-1',
        isCorrect ? 'bg-correct ring-success text-correct' : 'bg-disabled ring-outline text-disabled',
        selectedOption === null && 'bg-base-1 ring-outline text-secondary',
        className,
      )}
      style={{
        opacity: 0,
        animation: 'slide-in 0.5s cubic-bezier(0.34, 0.56, 0.3, 1) forwards',
        animationDelay: `${animationDelay}ms`,
      }}
      {...props}
    >
      {selectedOption ? (
        <>
          {isCorrect && (
            <div className="flex items-center justify-center rounded-full bg-green-500 text-white size-[32px]">
              <ImgRoundCorrect className="size-8" />
            </div>
          )}
          {isSelected && !isCorrect && (
            <div className="flex items-center justify-center rounded-full bg-red-500 text-white size-[32px]">
              <ImgRoundIncorrect className="size-8" />
            </div>
          )}
          {!isCorrect && !isSelected && (
            <div className="flex items-center justify-center rounded-full bg-gray-100 text-disabled size-[32px]">
              <span className="typo-button-3 font-[800]!">{label}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center rounded-full bg-gray-100 text-sub size-[32px]">
          <span className="typo-button-3 font-[800]!">{label}</span>
        </div>
      )}

      <span className="typo-body-1-medium text-start flex-1">{option}</span>
    </button>
  )
}
