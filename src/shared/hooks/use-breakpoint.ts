import { useEffect, useState } from 'react'

const useBreakpoint = () => {
  const [isDesktopSize, setIsDesktopSize] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(min-width: 1250px)')

    const updateMatch = () => {
      setIsDesktopSize(mediaQuery.matches)
    }

    updateMatch() // 초기 상태 설정
    mediaQuery.addEventListener('change', updateMatch)

    return () => {
      mediaQuery.removeEventListener('change', updateMatch)
    }
  }, [])

  return {
    isDesktopSize,
  }
}

export default useBreakpoint
