import { cn } from "@/shared/lib/utils"
import { ElementType, HTMLAttributes } from "react"

const typographyStyles = {
  h1: "typo-h1",
  h2: "typo-h2",
  h3: "typo-h3",
  h4: "typo-h4",
  "subtitle-1-bold": "typo-subtitle-1-bold",
  "subtitle-2-bold": "typo-subtitle-2-bold",
  "subtitle-2-medium": "typo-subtitle-2-medium",
  "body-1-bold": "typo-body-1-bold",
  "body-1-medium": "typo-body-1-medium",
  "body-1-regular": "typo-body-1-regular",
  "body-2-bold": "typo-body-2-bold",
  "body-2-medium": "typo-body-2-medium",
  "caption-bold": "typo-caption-bold",
  "caption-medium": "typo-caption-medium",
  "button-1": "typo-button-1",
  "button-2": "typo-button-2",
  "button-3": "typo-button-3",
  "button-4": "typo-button-4",
  "button-5": "typo-button-5",
  question: "typo-question",
}

const textColorStyles = {
  white: "text-gray-white",
  "gray-50": "text-gray-50",
  "gray-100": "text-gray-100",
  "gray-200": "text-gray-200",
  "gray-300": "text-gray-300",
  "gray-400": "text-gray-400",
  "gray-500": "text-gray-500",
  "gray-600": "text-gray-600",
  "gray-700": "text-gray-700",
  "gray-800": "text-gray-800",
  "gray-900": "text-gray-900",
  black: "text-gray-black",

  // Blue 계열
  "blue-50": "text-blue-50",
  "blue-100": "text-blue-100",
  "blue-200": "text-blue-200",
  "blue-300": "text-blue-300",
  "blue-400": "text-blue-400",
  "blue-500": "text-blue-500",
  "blue-600": "text-blue-600",
  "blue-700": "text-blue-700",
  "blue-800": "text-blue-800",
  "blue-900": "text-blue-900",

  // Orange 계열
  "orange-50": "text-orange-50",
  "orange-100": "text-orange-100",
  "orange-200": "text-orange-200",
  "orange-300": "text-orange-300",
  "orange-400": "text-orange-400",
  "orange-500": "text-orange-500",
  "orange-600": "text-orange-600",
  "orange-700": "text-orange-700",

  primary: "text-primary",
  inverse: "text-inverse",
  secondary: "text-secondary",
  "secondary-inverse": "text-secondary-inverse",
  sub: "text-sub",
  caption: "text-caption",
  success: "text-success",
  critical: "text-critical",
  info: "text-info",
  accent: "text-accent",
  selected: "text-selected",
  placeholder: "text-placeholder",
  disabled: "text-disabled",
  right: "text-right",
  wrong: "text-wrong",
  error: "text-error",
}

type Typo = keyof typeof typographyStyles
type TextColor = keyof typeof textColorStyles

type TextProps<T extends ElementType> = {
  typo: Typo
  color?: TextColor
  as?: T
  htmlFor?: string
  ref?: React.Ref<T>
} & HTMLAttributes<T>

export function Text<T extends ElementType = "div">({
  typo,
  color,
  className,
  as,
  children,
  ref,
  ...props
}: TextProps<T>) {
  const Component = as || ("div" as ElementType)

  return (
    <Component
      ref={ref}
      className={cn(typographyStyles[typo], color ? textColorStyles[color] : "text-inherit", className)}
      {...props}
    >
      {children}
    </Component>
  )
}
