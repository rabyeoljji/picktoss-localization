import React from 'react'

import { cn } from '@/shared/lib/utils'

import { Text } from '../ui/text'

type HeaderOwnProps = {
  left?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  right?: React.ReactNode
  className?: string
}

type HeaderProps<T extends React.ElementType> = HeaderOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof HeaderOwnProps> & {
    as?: T
  }

export const Header = <T extends React.ElementType = 'div'>({
  left,
  title,
  content,
  right,
  className,
  as,
  ...props
}: HeaderProps<T>) => {
  const Comp = as || 'div'

  return (
    <Comp
      className={cn(
        'w-full max-w-xl px-2 header-h-safe flex flex-col justify-end fixed z-50 top-0 bg-base-1',
        className,
      )}
      {...props}
    >
      <div className={cn('relative h-[var(--header-height)] flex items-center [&_svg]:text-icon-primary')}>
        {left && left}
        {title && (
          <div className="center">
            <Text typo="subtitle-2-medium" color="primary">
              {title}
            </Text>
          </div>
        )}
        {content && <div className="flex-1">{content}</div>}
        {right && <div className="absolute right-0">{right}</div>}
      </div>
    </Comp>
  )
}
