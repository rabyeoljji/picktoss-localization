import { Outlet } from "react-router"
import { isMobile, isIOS } from "react-device-detect"
import usePWA from "@/shared/hooks/use-pwa"

export const PWAOnlyMobileLayout = () => {
  const { isPWA } = usePWA()

  if (isMobile && !isPWA) {
    if (isIOS) {
      return <div>아이폰 유저에게 보여줄 설치 안내</div>
    } else {
      return <div>그 외 모바일 기기 유저에게 보여줄 설치 안내</div>
    }
  }

  return <Outlet />
}
