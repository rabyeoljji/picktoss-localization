import React, { useEffect, useRef, useState } from 'react'

import { PanInfo, motion, useAnimation } from 'framer-motion'

import { cn } from '@/shared/lib/utils'

// 컴포넌트 타입 정의
export type PeekingDrawerProps = {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  peekContent?: React.ReactNode
  fixedContent?: React.ReactNode
  className?: string
}

// 애니메이션 설정값
const ANIMATION_CONFIG = {
  transition: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  drag: {
    elastic: 0.2,
    transition: {
      bounceStiffness: 600,
      bounceDamping: 30,
    },
  },
  fade: {
    duration: 0.3,
  },
}

// 핸들바 높이 (픽셀)
const HANDLE_HEIGHT = 26

export const PeekingDrawer = ({
  children,
  open = false,
  onOpenChange,
  peekContent,
  fixedContent,
  className = 'bg-surface-1',
}: PeekingDrawerProps) => {
  const [isOpen, setIsOpen] = useState(open)
  const controls = useAnimation()

  // 레퍼런스
  const peekContentRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)
  const fixedContentRef = useRef<HTMLDivElement>(null)

  // 높이 상태
  const [actualPeekHeight, setActualPeekHeight] = useState(0)
  const [actualContentHeight, setActualContentHeight] = useState(0)
  const [fixedContentHeight, setFixedContentHeight] = useState(0)

  /**
   * 모든 콘텐츠 요소의 높이를 측정하는 함수
   */
  const measureHeights = () => {
    // 고정 콘텐츠 높이 측정
    if (fixedContentRef.current) {
      const fixedHeight = fixedContentRef.current.getBoundingClientRect().height
      setFixedContentHeight(fixedHeight)
    }

    // peek 콘텐츠 높이 측정
    if (peekContentRef.current) {
      const peekHeight = peekContentRef.current.scrollHeight + HANDLE_HEIGHT
      setActualPeekHeight(peekHeight)
    }

    // drawer 콘텐츠 높이 측정
    if (drawerContentRef.current) {
      const contentHeight = drawerContentRef.current.scrollHeight
      setActualContentHeight(contentHeight)
    }
  }

  /**
   * drawer 상태 변경 처리 함수
   */
  const updateDrawerState = (newIsOpen: boolean) => {
    if (newIsOpen !== isOpen) {
      setIsOpen(newIsOpen)

      if (onOpenChange) {
        onOpenChange(newIsOpen)
      }
    }
  }

  // 컴포넌트 마운트, 콘텐츠 변경 시 높이 측정
  useEffect(() => {
    // 초기 측정
    measureHeights()

    // 콘텐츠가 로드된 후 다시 측정 (이미지 등이 로드된 후)
    const timer = setTimeout(measureHeights, 100)

    // 윈도우 리사이즈 이벤트 핸들러
    const handleResize = () => measureHeights()

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [peekContent, children, fixedContent])

  // 높이 계산 및 애니메이션 업데이트
  useEffect(() => {
    /**
     * 열린/닫힌 상태에 따라 적절한 높이 계산
     */
    const calculateHeights = () => {
      // 최소 peek 높이 (핸들바 + peek 콘텐츠)
      const minimumPeekHeight = actualPeekHeight

      // 드로어 모드 높이 (drawer 콘텐츠 + fixed 콘텐츠)
      const drawerModeHeight = actualContentHeight + fixedContentHeight

      // peek 모드일 때는 peek 높이와 fixed 높이 중 더 큰 값 사용
      const peekModeHeight = Math.max(minimumPeekHeight, fixedContentHeight + HANDLE_HEIGHT)

      return { drawerModeHeight, peekModeHeight }
    }

    const { drawerModeHeight, peekModeHeight } = calculateHeights()

    // 애니메이션 업데이트
    if (isOpen) {
      controls.start({ height: drawerModeHeight })
    } else {
      controls.start({ height: peekModeHeight })
    }
  }, [actualPeekHeight, actualContentHeight, fixedContentHeight, controls, isOpen])

  // 외부 open 상태가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (isOpen !== open) {
      setIsOpen(open)
    }
  }, [open, isOpen])

  // 드래그 종료 시 열림/닫힘 상태 결정
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // 드래그 방향이 위쪽이면 열림, 아래쪽이면 닫힘
    const isDraggingUp = info.velocity.y < 0 || info.offset.y < 0
    updateDrawerState(isDraggingUp)
  }

  // 핸들바 클릭 시 열림/닫힘 상태 토글
  const toggleDrawer = () => {
    updateDrawerState(!isOpen)
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 mx-auto max-w-xl z-50 rounded-t-[20px] overflow-hidden shadow-md',
        className,
      )}
    >
      <motion.div
        initial={{ height: 'auto' }}
        animate={controls}
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={ANIMATION_CONFIG.drag.elastic}
        dragTransition={ANIMATION_CONFIG.drag.transition}
        onDragEnd={handleDragEnd}
        transition={ANIMATION_CONFIG.transition}
      >
        {/* 핸들바 */}
        <div className="pt-[10px] pb-[16px]" onClick={toggleDrawer}>
          <div className="w-[36px] mx-auto h-1 bg-gray-200 rounded-full" />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="relative">
          {/* Peek Content */}
          <motion.div
            key="peek-content"
            animate={{
              opacity: isOpen ? 0 : 1,
              pointerEvents: isOpen ? 'none' : 'auto',
            }}
            transition={{ duration: ANIMATION_CONFIG.fade.duration }}
            style={{
              overflow: 'hidden',
              paddingBottom: fixedContentHeight ? `${fixedContentHeight}px` : '0',
            }}
            ref={peekContentRef}
            className="w-full"
          >
            {peekContent}
          </motion.div>

          {/* Drawer Content */}
          <motion.div
            key="drawer-content"
            animate={{
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
            transition={{ duration: ANIMATION_CONFIG.fade.duration }}
            style={{
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
            }}
          >
            <PeekingDrawerContent ref={drawerContentRef} paddingBottom={fixedContentHeight}>
              {children}
            </PeekingDrawerContent>
          </motion.div>
        </div>
        {/* Fixed Content - 항상 드로어 하단에 고정 */}
        {fixedContent && (
          <div className="absolute left-0 right-0 bottom-0 px-5 w-full" ref={fixedContentRef} style={{ zIndex: 10 }}>
            {fixedContent}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export type PeekingDrawerContentProps = {
  children: React.ReactNode
  className?: string
  paddingBottom?: number
}

export const PeekingDrawerContent = React.forwardRef<HTMLDivElement, PeekingDrawerContentProps>(
  ({ children, className = '', paddingBottom = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full h-full overflow-auto', className)}
        style={{ paddingBottom: `${paddingBottom}px` }}
      >
        {children}
      </div>
    )
  },
)
