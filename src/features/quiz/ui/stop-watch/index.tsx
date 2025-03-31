import { useEffect, useState } from 'react'

import { intervalToDuration } from 'date-fns'

import { IcStopwatch } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

export interface StopWatchProps {
  isRunning?: boolean
  elapsedTime?: number
}

export const StopWatch = ({ isRunning = false, elapsedTime }: StopWatchProps) => {
  const [timeElapsed, setTimeElapsed] = useState<number>(elapsedTime || 0)

  useEffect(() => {
    if (elapsedTime !== undefined && !isRunning) {
      setTimeElapsed(elapsedTime)
    }
  }, [elapsedTime, isRunning])

  // 실행/정지 상태 변경 감지
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isRunning) {
      // 시작 시간 설정 (현재 시간 - 이미 경과한 시간)
      const startTime = Date.now() - timeElapsed

      intervalId = setInterval(() => {
        const current = Date.now() - startTime
        setTimeElapsed(current)
      }, 100)
    } else {
      // 정지 시 interval 제거
      if (intervalId) {
        clearInterval(intervalId)
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, timeElapsed])

  // 시간 형식 포맷팅 (HH:mm:ss)
  const formatTime = (milliseconds: number): string => {
    const duration = intervalToDuration({ start: 0, end: milliseconds })

    const hours = String(duration.hours || 0).padStart(2, '0')
    const minutes = String(duration.minutes || 0).padStart(2, '0')
    const seconds = String(duration.seconds || 0).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div
      className={cn(
        'rounded-full py-1 px-3 flex items-center gap-2',
        isRunning
          ? '[&_svg]:text-icon-accent text-accent bg-accent'
          : '[&_svg]:text-icon-disabled text-disabled bg-surface-1',
      )}
    >
      <IcStopwatch className="size-4" />
      <Text typo="body-1-medium">{formatTime(timeElapsed)}</Text>
    </div>
  )
}
