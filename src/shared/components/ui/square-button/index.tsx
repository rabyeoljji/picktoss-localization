import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const squareButtonVariants = cva(
  "relative inline-flex items-center cursor-pointer justify-center whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200",

  {
    variants: {
      variant: {
        primary:
          "bg-orange-500 text-gray-white hover:bg-orange-600 active:bg-orange-700",
        secondary:
          "text-orange-500 bg-orange-100 hover:bg-orange-200 active:bg-orange-300",
        tertiary:
          "border border-gray-100 bg-gray-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
      },
      size: {
        lg: "typo-button-2 h-[48px] w-full rounded-[12px]",
        md: "typo-button-4 h-[44px] w-full rounded-[8px]",
        sm: "typo-button-5 h-[28px] min-w-[48px] px-2 w-fit rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
)

function SquareButton({
  className,
  variant,
  size,
  asChild = false,
  left,
  right,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof squareButtonVariants> & {
    left?: React.ReactNode
    right?: React.ReactNode
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(squareButtonVariants({ variant, size, className }))}
      {...props}
    >
      {left && (
        <div
          className={cn("[&_svg]:size-4!]", [
            size === "lg" && "[&_svg]:size-5!",
          ])}
        >
          {left}
        </div>
      )}
      <div className={cn([size === "lg" && "px-2"], [size === "md" && "px-1"])}>
        {children}
      </div>
      {right && <div className="[&_svg]:size-4!">{right}</div>}
    </Comp>
  )
}

export { SquareButton, squareButtonVariants }
