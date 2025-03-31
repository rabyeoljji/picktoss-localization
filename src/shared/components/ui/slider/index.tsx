'use client'

import * as React from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/shared/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-base-3">
      <SliderPrimitive.Range className="absolute h-full bg-orange-strong" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-8 cursor-pointer rounded-full border border-outline bg-base-1 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:cursor-grabbing shadow-[var(--shadow-md)]" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
