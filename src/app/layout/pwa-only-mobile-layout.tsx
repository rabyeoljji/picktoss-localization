import { isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { Button } from '@/shared/components/ui/button'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'

export const PWAOnlyMobileLayout = () => {
  const router = useRouter()
  const { isPWA } = usePWA()

  if (!isPWA && isMobile) {
    return (
      <div className="center">
        {/* TODO: 탐험 탭 페이지가 보여야 함 */}

        <div>모바일 픽토스는 앱에서 만날 수 있어요</div>
        <Button onClick={() => router.push('/explore')}>탐험으로 이동하기</Button>
        <Button onClick={() => router.push('/install-guide')}>지금 앱에서 전부 이용하기</Button>
      </div>
    )
  }

  return <Outlet />
}
