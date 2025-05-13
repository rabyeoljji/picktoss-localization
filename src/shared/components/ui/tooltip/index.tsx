import * as React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/shared/lib/utils'

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  arrowPosition = 'left',
  children,
  color = 'blue',
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  arrowPosition?: 'left' | 'right' | 'center'
  color?: 'inverse' | 'blue'
}) {
  const arrowRef = React.useRef<SVGSVGElement | null>(null)

  React.useEffect(() => {
    if (arrowPosition === 'center') return

    const styleTimer = setTimeout(() => {
      if (!arrowRef.current) return

      const containerSpan = arrowRef.current.parentElement
      if (containerSpan) {
        if (arrowPosition === 'left') {
          containerSpan.style.left = '36px'
          containerSpan.style.right = ''
        } else if (arrowPosition === 'right') {
          containerSpan.style.right = '36px'
          containerSpan.style.left = ''
        }
      }
    }, 0)

    return () => {
      clearTimeout(styleTimer)
    }
  }, [arrowPosition])

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-tooltip-content-transform-origin) typo-body-2-medium text-balance text-inverse size-fit px-[16px] py-[7px] relative rounded-[8px] inline-flex justify-center items-center gap-2.5 leading-none',
          className,
          color === 'blue' ? 'bg-blue-strong' : 'bg-inverse',
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          ref={arrowRef}
          className={cn(
            'z-50 size-2.5 translate-y-[calc(-50%_-_0px)] rotate-45',
            color === 'blue'
              ? 'bg-blue-strong fill-[var(--color-blue-500)]'
              : 'bg-inverse fill-[var(--color-gray-800)]',
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
