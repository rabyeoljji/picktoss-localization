import { useEffect, useRef, useState } from 'react'

import { PanInfo, motion, useAnimation, useMotionValue } from 'framer-motion'
import debounce from 'lodash.debounce'

import { cn } from '@/shared/lib/utils'

/**
 * 수평 스크롤 가능한 컨테이너 컴포넌트입니다.
 *
 * - 휠 스크롤, 트랙패드, 드래그를 통한 좌우 이동을 지원합니다.
 *
 * @component
 * @example
 * ```tsx
 * <HorizontalScrollContainer
 *   items={[<div>카드 1</div>, <div>카드 2</div>, <div>카드 3</div>]}
 *   gap={8}
 *   moveRatio={0.7}
 * />
 * ```
 *
 * @param items 가로로 나열할 React 요소 배열
 * @param gap 각 아이템 간의 간격 (px)
 * @param moveRatio 한 번에 이동할 거리의 비율 (상위 요소의 width기준) (0 ~ 1, 기본값: 0.8)
 * @param paddingX 콘텐츠 좌우 패딩(px), 스크롤 계산에 사용 (기본값: 16)
 */
const HorizontalScrollContainer = ({
  items,
  gap,
  moveRatio = 0.8,
  paddingX = 16,
}: {
  items: React.ReactNode[]
  gap?: number
  moveRatio?: number
  paddingX?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const controls = useAnimation()
  const [constraints, setConstraints] = useState({ left: 0, right: 0 })

  const [moveAtOnceWidth, setMoveAtOnceWidth] = useState(0)
  const [_, setCurrentOffset] = useState(0)
  const [isMoving, setIsMoving] = useState(false)

  // 컨테이너와 콘텐츠 너비 설정
  useEffect(() => {
    const updateMeasurements = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth - paddingX
        const contentWidth = contentRef.current.scrollWidth
        const moveableWidth = Math.max(contentWidth - containerWidth, 0)

        setMoveAtOnceWidth(Math.min(containerWidth * moveRatio, moveableWidth))

        setConstraints({
          left: -1 * moveableWidth,
          right: 0,
        })
      }
    }

    updateMeasurements() // 초기 실행

    window.addEventListener('resize', updateMeasurements)
    return () => window.removeEventListener('resize', updateMeasurements)
  }, [items])

  // containerRef에서는 수직 스크롤을 막기 위한 코드
  useEffect(() => {
    const handleWheelEvent = (event: WheelEvent) => {
      if (containerRef.current && containerRef.current.contains(event.target as Node)) {
        event.preventDefault() // 수직 스크롤 차단
        event.stopPropagation() // 이벤트 버블링 방지
        handleWheel(event)
      }
    }

    const root = document.getElementById('root')
    if (!root) return

    window.addEventListener('wheel', handleWheelEvent, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheelEvent)
    }
  }, [])

  // 이동 시작 시 호출될 함수
  const handleMoveStart = () => {
    setIsMoving(true)
  }

  // 이동 종료 시 호출될 함수 (타이머를 통해 약간의 지연 후 클릭 활성화)
  const handleMoveEnd = () => {
    setTimeout(() => {
      setIsMoving(false)
    }, 100) // 100ms 후에 클릭 가능하도록 설정
  }

  // 스크롤 방향에 따라 컨테이너 크기만큼 이동하고 끝을 감지
  const handleDirection = (direction: 'next' | 'prev') => {
    setCurrentOffset((prevOffset) => {
      let newOffset = prevOffset

      if (direction === 'next' && prevOffset > constraints.left) {
        const remainingContentWidth = Math.abs(prevOffset - constraints.left)
        newOffset = prevOffset - Math.min(remainingContentWidth, moveAtOnceWidth)
      } else if (direction === 'prev' && prevOffset < 0) {
        const remainingContentWidth = constraints.right - prevOffset
        newOffset = prevOffset + Math.min(remainingContentWidth, moveAtOnceWidth)
      }

      void controls.start({
        x: newOffset,
        transition: { type: 'tween', duration: 0.5, ease: 'easeInOut' },
      })

      handleMoveEnd()

      return newOffset
    })
  }

  // 드래그 시작
  const handlePanStart = (event: PointerEvent) => {
    event.preventDefault()
    setIsMoving(true) // 드래그 시작
  }

  // 드래그 중
  const handlePan = (event: PointerEvent) => {
    event.preventDefault()
    setIsMoving(true)
  }

  // 드래그 종료 시 방향에 따라 이동
  const handlePanEnd = (event: PointerEvent, info: PanInfo) => {
    event.preventDefault()

    const threshold = 2 // 감지 민감도 조정
    if (info.offset.x < -threshold) {
      handleDirection('next')
    } else if (info.offset.x > threshold) {
      handleDirection('prev')
    } else {
      handleMoveEnd()
    }
  }

  // 휠 이벤트 처리: 휠을 통해 좌우 이동
  const handleWheel = debounce((event: React.WheelEvent | WheelEvent) => {
    event.preventDefault()

    if (isMoving) return

    const threshold = 50 // 이동 방향 감지 임계값

    requestAnimationFrame(() => {
      if (containerRef.current) {
        if (event.deltaY < -threshold) {
          handleMoveStart()
          handleDirection('prev')
        } else if (event.deltaY > threshold) {
          handleMoveStart()
          handleDirection('next')
        }
      }

      // 트랙패드용
      if (event.deltaX !== 0) {
        const threshold = 1
        if (event.deltaX < -threshold) {
          handleMoveStart()
          handleDirection('prev')
        } else if (event.deltaX > threshold) {
          handleMoveStart()
          handleDirection('next')
        }
      }
    })
  }, 30)

  return (
    <motion.div
      ref={containerRef}
      onWheel={handleWheel}
      className={cn('h-fit w-dvw max-w-full select-none overflow-hidden scrollbar-hide', 'touch-pan-x')}
    >
      <motion.div
        ref={contentRef}
        className={cn('flex gap-[8px]', isMoving ? 'pointer-events-none' : 'pointer-events-auto')}
        style={{ x, gap }}
        animate={controls}
        drag="x"
        dragConstraints={constraints}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      >
        {items.map((item, index) => (
          <div key={'item_' + index}>{item}</div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default HorizontalScrollContainer
