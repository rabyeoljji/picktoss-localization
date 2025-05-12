import { useState } from 'react'

import { useAnimation } from 'framer-motion'

/**
 * Pull-to-refresh 기능을 위한 로직을 제공하는 커스텀 훅
 */
export const usePullToRefresh = <T>(onRefresh: () => Promise<T>) => {
  const refreshIndicatorControls = useAnimation()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  // 드래그 중 처리
  const handleDrag = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 0) {
      setPullDistance(Math.min(info.offset.y, 60))
      refreshIndicatorControls.start({
        opacity: Math.min(info.offset.y / 60, 1),
        rotate: Math.min(info.offset.y * 2, 360),
        y: Math.min(info.offset.y / 3, 30),
      })
    }
  }

  // 드래그 종료 처리
  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 80) {
      setIsRefreshing(true)
      refreshIndicatorControls.start({
        opacity: 1,
        rotate: 360,
        transition: { duration: 0.5, repeat: Infinity, ease: 'linear' },
      })

      onRefresh().finally(() => {
        setIsRefreshing(false)
        setPullDistance(0)
        refreshIndicatorControls.start({
          opacity: 0,
          y: 0,
          transition: { duration: 0.3 },
        })
      })
    } else {
      setPullDistance(0)
      refreshIndicatorControls.start({
        opacity: 0,
        y: 0,
        transition: { duration: 0.3 },
      })
    }
  }

  return {
    refreshIndicatorControls,
    isRefreshing,
    pullDistance,
    handleDrag,
    handleDragEnd,
  }
}
