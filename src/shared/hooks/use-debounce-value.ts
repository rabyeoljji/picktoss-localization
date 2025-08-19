import { useEffect, useState } from 'react'

/**
 * useDebounceValue
 * @param value 디바운스할 값
 * @param delay 디바운스 지연 시간(ms)
 * @returns delay 이후 확정된 값
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 값이 변경되면 기존 타이머 취소
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
