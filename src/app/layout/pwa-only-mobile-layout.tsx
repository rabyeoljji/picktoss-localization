import { isIOS, isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { ImgMeteor } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { usePWA } from '@/shared/hooks/use-pwa'

export const PWAOnlyMobileLayout = () => {
  const { isPWA } = usePWA()

  if (isMobile && !isPWA) {
    if (isIOS) {
      return (
        <div className="px-4 py-9">
          <div className="flex flex-col items-center">
            <ImgMeteor />
            <div>Picktoss</div>
          </div>
          <img src="/images/ios-pwa.png" className="mx-auto mt-12 w-[329px]" />
        </div>
      )
    } else {
      return (
        <div className="center w-full px-4">
          <div className="flex flex-col items-center">
            <ImgMeteor />
            <div>Picktoss</div>
          </div>
          <Button className="mt-[66px]">앱 다운로드</Button>
        </div>
      )
    }
  }

  return <Outlet />
}
