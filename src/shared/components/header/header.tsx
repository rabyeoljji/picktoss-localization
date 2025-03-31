import { cn } from '@/shared/lib/utils'

import { Text } from '../ui/text'

interface HeaderProps {
  left?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  className?: HTMLElement['className']
}

export const Header = ({ left, title, content, className }: HeaderProps) => {
  return (
    <div className="header-h-safe flex flex-col justify-end fixed top-0 bg-base-1">
      <div className={cn('h-[54px] flex items-center', left ? 'pl-2 pr-4' : 'px-4', className)}>
        {left && left}
        {title && (
          <div className="center">
            <Text typo="subtitle-2-medium" color="primary">
              {title}
            </Text>
          </div>
        )}
        {content && <div className="flex-1">{content}</div>}
      </div>
    </div>
  )
}
