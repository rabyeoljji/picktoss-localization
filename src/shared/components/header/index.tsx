import React from 'react'

import { cn } from '@/shared/lib/utils'

import { Text } from '../ui/text'

interface HeaderProps {
  left?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  right?: React.ReactNode
  className?: HTMLElement['className']
}

export const Header = ({ left, title, content, right, className }: HeaderProps) => {
  return (
    <div className={cn('w-full max-w-xl header-h-safe flex flex-col justify-end fixed top-0 bg-base-1', className)}>
      <div className={cn('relative h-[var(--header-height)] flex items-center', left ? 'pl-2 pr-4' : 'px-4')}>
        {left && left}
        {title && (
          <div className="center">
            <Text typo="subtitle-2-medium" color="primary">
              {title}
            </Text>
          </div>
        )}
        {content && <div className="flex-1">{content}</div>}
        {right && <div className="place-self-end">{right}</div>}
      </div>
    </div>
  )
}
