import * as React from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const labelVariants = cva('typo-body-1-bold text-sub')

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      required?: boolean
    }
>(({ className, required = false, ...props }, ref) => (
  <div className="flex items-start gap-0.5">
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
    {required && (
      <div className="text-orange-500">
        <svg width="5" height="6" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
          <path
            d="M2.928 0.5V2.276L4.584 1.748L4.884 2.672L3.228 3.2L4.296 4.664L3.528 5.264L2.436 3.776L1.356 5.264L0.6 4.652L1.668 3.2L0 2.672L0.3 1.748L1.956 2.276L1.944 0.5H2.928Z"
            fill="currentColor"
          />
        </svg>
      </div>
    )}
  </div>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
