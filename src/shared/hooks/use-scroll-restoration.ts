import { useEffect, useRef } from 'react'

interface UseScrollRestorationOptions {
  /**
   * 스크롤 위치 복원 시 지연 시간 (ms)
   * @default 100
   */
  restoreDelay?: number
  /**
   * 스크롤 위치 저장 임계값 (px)
   * 이 값보다 작은 스크롤은 저장하지 않음
   * @default 50
   */
  threshold?: number
  /**
   * 디바운스 시간 (ms)
   * @default 150
   */
  debounceMs?: number
  /**
   * 스크롤 복원 완료 시 호출되는 콜백
   * @param scrollTop 복원된 스크롤 위치
   */
  onRestoreComplete?: (scrollTop: number) => void
}

/**
 * 스크롤 위치를 sessionStorage에 저장하고 복원하는 훅
 * @param key - sessionStorage에 저장할 고유 키
 * @param options - 스크롤 복원 옵션
 * @returns 스크롤 복원에 사용할 ref 객체
 */
export const useScrollRestoration = <T extends HTMLElement = HTMLDivElement>(
  key: string,
  options: UseScrollRestorationOptions = {}
) => {
  const { restoreDelay = 100, threshold = 50, debounceMs = 150, onRestoreComplete } = options
  const scrollRef = useRef<T>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    // 스크롤 위치 복원
    const savedScrollPosition = sessionStorage.getItem(`scroll-${key}`)
    if (savedScrollPosition) {
      const scrollTop = parseInt(savedScrollPosition, 10)
      if (scrollTop > threshold) {
        setTimeout(() => {
          if (element) {
            element.scrollTop = scrollTop
            onRestoreComplete?.(scrollTop)
          }
        }, restoreDelay)
      } else {
        // 임계값 이하의 스크롤 위치인 경우에도 복원 완료 콜백 호출
        setTimeout(() => {
          onRestoreComplete?.(0)
        }, restoreDelay)
      }
    } else {
      // 저장된 스크롤 위치가 없는 경우에도 복원 완료 콜백 호출
      setTimeout(() => {
        onRestoreComplete?.(0)
      }, restoreDelay)
    }

    // 스크롤 위치 저장 (디바운스 적용)
    const handleScroll = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        const scrollTop = element.scrollTop
        if (scrollTop > threshold) {
          sessionStorage.setItem(`scroll-${key}`, scrollTop.toString())
        }
      }, debounceMs)
    }

    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [key, restoreDelay, threshold, debounceMs])

  return scrollRef
}
