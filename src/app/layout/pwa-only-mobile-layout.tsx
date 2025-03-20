import { isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { Button } from '@/shared/components/ui/button'
import { useRouter } from '@/shared/lib/router'

// iOS Safari standalone 속성 타입 정의
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

const isPWA =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as NavigatorWithStandalone).standalone === true

export const SHOW_FALLBACK = isMobile && !isPWA

export const PWAOnlyMobileLayout = () => {
  const router = useRouter()

  if (SHOW_FALLBACK) {
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
