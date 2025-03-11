import { Outlet } from "react-router"
import { isMobile, isIOS } from "react-device-detect"
import { usePWA } from "@/shared/hooks/use-pwa"
import { Button } from "@/shared/components/ui/button"

export const PWAOnlyMobileLayout = () => {
  const { isPWA } = usePWA()

  if (isMobile && !isPWA) {
    if (isIOS) {
      return (
        <div className="px-4 py-9">
          <div className="flex flex-col items-center">
            <img src="/svgs/logo-padding.svg" />
            <img src="/svgs/logo-typo.svg" />
          </div>
          <img src="/images/ios-pwa.png" className="mx-auto mt-12 w-[329px]" />
        </div>
      )
    } else {
      return (
        <div className="center w-full px-4">
          <div className="flex flex-col items-center">
            <img src="/svgs/logo-padding.svg" />
            <img src="/svgs/logo-typo.svg" />
          </div>
          <Button className="mt-[66px]">앱 다운로드</Button>
        </div>
      )
    }
  }

  return <Outlet />
}
