import { useEffect } from 'react'

export function useHorizontalScrollWheel(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      // event.target을 사용하여 이벤트가 발생한 요소 확인
      const isInsideTarget = el.contains(e.target as Node) || el === e.target

      if (isInsideTarget && e.deltaY !== 0) {
        e.preventDefault()
        e.stopPropagation()
        el.scrollLeft += e.deltaY
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [ref])
}
