import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Text } from "../text"
import { Label } from "@/shared/components/ui/label"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  hasError?: boolean
  helperText?: string
}

function Input({ className, type, hasError = false, label, required = false, helperText, ...props }: InputProps) {
  const id = React.useId()

  return (
    <div className={"flex flex-col text-gray-900"}>
      {label && (
        <div className="flex items-start gap-0.5">
          <Label htmlFor={id} className={cn(hasError && "text-text-error")}>
            {label}
          </Label>
          {required && (
            <div className="text-orange-500">
              <svg
                width="5"
                height="6"
                viewBox="0 0 5 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5"
              >
                <path
                  d="M2.928 0.5V2.276L4.584 1.748L4.884 2.672L3.228 3.2L4.296 4.664L3.528 5.264L2.436 3.776L1.356 5.264L0.6 4.652L1.668 3.2L0 2.672L0.3 1.748L1.956 2.276L1.944 0.5H2.928Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      )}
      <input
        id={id}
        type={type}
        data-slot="input"
        className={cn(
          "bg-background-base-01 text-primary typo-subtitle-2-medium placeholder:text-text-placeholder mt-2 h-12 rounded-[8px] border border-gray-200 px-3 outline-none",
          hasError && "border-border-error",
          className,
        )}
        {...props}
      />
      {helperText && (
        <div className={cn("text-text-caption mt-2 flex items-center gap-[5px]", hasError && "text-text-error")}>
          {hasError && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="8" fill="#F4502C" />
              <path d="M5.3335 10.6668L10.6668 5.3335" stroke="white" stroke-linecap="square" stroke-linejoin="round" />
              <path d="M5.3335 5.33317L10.6668 10.6665" stroke="white" strokeLinecap="square" strokeLinejoin="round" />
            </svg>
          )}
          <Text typo="body-2-medium">{helperText}</Text>
        </div>
      )}
    </div>
  )
}

export { Input }
