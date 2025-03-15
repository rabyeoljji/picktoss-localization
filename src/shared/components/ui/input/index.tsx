import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Text } from "../text"
import { Label } from "@/shared/components/ui/label"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  hasError?: boolean
  helperText?: string
  right?: React.ReactNode
}

function Input({
  className,
  type,
  hasError = false,
  label,
  right,
  required = false,
  helperText,
  ...props
}: InputProps) {
  const id = React.useId()

  return (
    <div className={"flex flex-col"}>
      {label && <InputLabel id={id} hasError={hasError} label={label} required={required} />}
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          data-slot="input"
          className={cn(
            "bg-surface-1 border-container placeholder:text-caption text-primary typo-subtitle-2-medium focus:border-active disabled:text-disabled disabled:bg-disabled disabled:placeholder:text-disabled h-12 w-full rounded-[8px] border px-3 outline-none disabled:border-none",
            hasError && "border-error focus:border-error",
            className,
          )}
          {...props}
        />
        <div className="absolute right-3 bottom-1/2 translate-y-1/2">{right}</div>
      </div>
      {helperText && <InputHelper hasError={hasError} helperText={helperText} />}
    </div>
  )
}

const InputLabel = ({
  id,
  hasError,
  label,
  required,
}: {
  id: string
  hasError: boolean
  label: string
  required: boolean
}) => {
  return (
    <div className="mb-2 flex items-start gap-0.5">
      <Label htmlFor={id} className={cn(hasError && "text-error")}>
        {label}
      </Label>
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
  )
}

const InputHelper = ({ hasError, helperText }: { hasError: boolean; helperText: string }) => {
  return (
    <div className={cn("text-caption mt-2 flex items-center gap-[5px]", hasError && "text-error")}>
      {hasError && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="6" fill="#F4502C" />
          <path d="M4 8L8 4" stroke="white" strokeWidth="0.75" strokeLinecap="square" strokeLinejoin="round" />
          <path d="M4 4L8 8" stroke="white" strokeWidth="0.75" strokeLinecap="square" strokeLinejoin="round" />
        </svg>
      )}
      <Text typo="body-2-medium">{helperText}</Text>
    </div>
  )
}

export { Input }
