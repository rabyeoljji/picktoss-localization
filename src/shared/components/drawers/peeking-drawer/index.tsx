import React, { useEffect, useRef, useState } from 'react'

import { PanInfo, motion, useAnimation } from 'framer-motion'

import { cn } from '@/shared/lib/utils'

// 컴포넌트 타입 정의 완전히 새로 작성
export type PeekingDrawerProps = {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  peekContent?: React.ReactNode
  fixedContent?: React.ReactNode
  className?: HTMLElement['className']
}

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
  const peekContentRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)
  const fixedContentRef = useRef<HTMLDivElement>(null)

  const [actualPeekHeight, setActualPeekHeight] = useState(0)
  const [actualContentHeight, setActualContentHeight] = useState(0)
  const [fixedContentHeight, setFixedContentHeight] = useState(0)

  // 높이 측정 (컴포넌트 마운트, 콘텐츠 변경 시)
  const measureHeights = () => {
    // fixed 콘텐츠 높이 측정
    if (fixedContentRef.current) {
      const fixedHeight = fixedContentRef.current.getBoundingClientRect().height
      setFixedContentHeight(fixedHeight)
    }

    // peek 콘텐츠 높이 측정
    if (peekContentRef.current) {
      const peekHeight = peekContentRef.current.scrollHeight + 26 // 핸들바 높이 추가
      setActualPeekHeight(peekHeight)
    }

    // drawer 콘텐츠 높이 측정
    if (drawerContentRef.current) {
      const contentHeight = drawerContentRef.current.scrollHeight
      setActualContentHeight(contentHeight)
    }
  }

  // 컴포넌트 마운트, 콘텐츠 변경 시 높이 측정
  useEffect(() => {
    // 초기 측정
    measureHeights()

    // 콘텐츠가 로드된 후 다시 측정 (이미지 등이 로드된 후)
    const timer = setTimeout(measureHeights, 100)

    // window resize 시 높이 재측정
    const handleResize = () => {
      measureHeights()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [peekContent, children, fixedContent])

  // 높이 계산 및 애니메이션 업데이트
  useEffect(() => {
    // 최소 peek 높이 (핸들바 + peek 콘텐츠)
    const minimumPeekHeight = actualPeekHeight

    // 드로어 모드 높이 (drawer 콘텐츠 + fixed 콘텐츠)
    // fixed 콘텐츠가 있으면 drawer 콘텐츠에 fixed 콘텐츠 높이만큼 패딩을 추가해야 함
    const drawerModeHeight = actualContentHeight + fixedContentHeight

    // peek 모드일 때는 peek 높이와 fixed 높이 중 더 큰 값 사용
    const peekModeHeight = Math.max(minimumPeekHeight, fixedContentHeight + 26) // 핸들바 고려

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
    const newIsOpen = isDraggingUp

    if (newIsOpen !== isOpen) {
      setIsOpen(newIsOpen)
      // 상태 변경 시 부모에게 알림
      if (onOpenChange) {
        onOpenChange(newIsOpen)
      }
    }
  }

  // 핸들바 클릭 시 열림/닫힘 상태 토글
  const toggleDrawer = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)

    if (onOpenChange) {
      onOpenChange(newIsOpen)
    }
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
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
        onDragEnd={handleDragEnd}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
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
            transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
            }}
          >
            <PeekingDrawerContent
              ref={drawerContentRef}
              paddingBottom={fixedContentHeight}
              // backgroundColor={backgroundColor}
            >
              {children}
            </PeekingDrawerContent>
          </motion.div>
        </div>
      </motion.div>
      {/* Fixed Content - 항상 드로어 하단에 고정 */}
      {fixedContent && (
        <div className="absolute left-0 right-0 bottom-0 px-5 w-full" ref={fixedContentRef} style={{ zIndex: 10 }}>
          {fixedContent}
        </div>
      )}
    </div>
  )
}

export const PeekingDrawerContent = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    className?: string
    paddingBottom?: number
  }
>(({ children, className = '', paddingBottom = 0 }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full h-full overflow-auto', className)}
      style={{ paddingBottom: `${paddingBottom}px` }}
    >
      {children}
    </div>
  )
})
