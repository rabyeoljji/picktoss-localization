import { useEffect } from 'react'
import { useLocation } from 'react-router'

export const useLastPathTracker = () => {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // 오프라인 페이지 자체는 제외 (ex. /offline)
    if (!pathname.startsWith('/offline')) {
      sessionStorage.setItem('lastPath', pathname + search + hash)
    }
  }, [pathname, search, hash])
}
