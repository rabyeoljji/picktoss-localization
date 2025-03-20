import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { Button } from '@/shared/components/ui/button'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'

export const PWAOnlyMobileLayout = () => {
  const { isPWA } = usePWA()
  const router = useRouter()

  const [showFallback, setShowFallback] = useState(isMobile && !isPWA)

  // 한 번이라도 showFallback이 false가 되면 그 상태를 유지
  useEffect(() => {
    if (!showFallback) return // 이미 false면 더 이상 업데이트하지 않음

    // isPWA가 true가 되면 showFallback을 false로 설정
    if (isPWA) {
      setShowFallback(false)
    }
  }, [isPWA, showFallback])

  if (showFallback) {
    return (
      <div className="center">
        <div>모바일 픽토스는 앱에서 만날 수 있어요</div>
        <Button onClick={() => router.replace('/collection')}>컬렉션으로 이동하기</Button>
        <Button onClick={() => router.replace('/install-guide')}>지금 앱에서 전부 이용하기</Button>
      </div>
    )
  }

  return <Outlet />
}
