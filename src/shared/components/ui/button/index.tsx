import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center rounded-full cursor-pointer justify-center whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200",
  {
    variants: {
      variant: {
        primary:
          "bg-orange-500 text-gray-white hover:bg-orange-600 active:bg-orange-700 data-[state=loading]:bg-orange-400",
        special:
          "text-gray-white bg-linear-110 from-orange-500 from-40% to-blue-400",
        secondary1:
          "text-orange-500 bg-orange-100 hover:bg-orange-200 active:bg-orange-300",
        secondary2:
          "text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
        tertiary:
          "border border-gray-100 bg-gray-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
      },
      size: {
        lg: "typo-button-1 h-[52px] w-full",
        md: "typo-button-2 h-[44px] w-full",
        sm: "typo-button-3 h-[32px] min-w-[60px] px-2.5 w-fit",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  left,
  right,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    left?: React.ReactNode
    right?: React.ReactNode
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {left && (
        <div className={cn(size === "sm" && "[&_svg]:size-4!")}>{left}</div>
      )}
      <div className={cn(size === "md" && "px-2", size === "sm" && "px-1")}>
        {children}
      </div>
      {right && (
        <div className={cn(size === "sm" && "[&_svg]:size-3!")}>{right}</div>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
