import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'
import { CircleIcon, XIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const oxChoiceOptionVariants = cva(
  'relative flex items-center justify-center cursor-pointer rounded-[16px] transition-all size-[120px]',
  {
    variants: {
      variant: {
        blue: 'bg-blue-500 text-white',
        orange: 'bg-orange-500 text-white',
        green: 'bg-green-100 text-green-500',
        red: 'bg-red-100 text-red-500',
        gray: 'bg-gray-100 text-gray-500',
        disabled: 'bg-gray-100 text-gray-300 cursor-default',
      },
      type: {
        o: '',
        x: '',
      },
    },
    defaultVariants: {
      variant: 'blue',
      type: 'o',
    },
  },
)

export interface OXChoiceOptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof oxChoiceOptionVariants> {
  selectable?: boolean
}

export const OXChoiceOption = ({
  className,
  variant,
  type,
  selectable = true,
  ...props
}: OXChoiceOptionProps) => {
  return (
    <div 
      className={cn(
        oxChoiceOptionVariants({ variant, type, className }), 
        !selectable && 'cursor-default'
      )} 
      {...props}
    >
      {type === 'o' ? (
        <CircleIcon className="size-16 stroke-[3]" />
      ) : (
        <XIcon className="size-16 stroke-[3]" />
      )}
    </div>
  )
}
