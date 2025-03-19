import { isIOS, isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { IcLogo } from '@/shared/assets/icon'
import { ImgSymbol } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useInstallPWA } from '@/shared/hooks/use-install-pwa'
import { usePWA } from '@/shared/hooks/use-pwa'

export const PWAOnlyMobileLayout = () => {
  const { isPWA } = usePWA()

  if (isMobile && !isPWA) {
    if (isIOS) {
      return <AppInstallIos />
    } else {
      return <AppInstallAos />
    }
  }

  return <Outlet />
}

const AppInstallIos = () => {
  return (
    <main className="flex h-dvh w-dvw max-w-mobile flex-col items-center overflow-y-auto bg-base-02 px-[16px] pb-[65px] pt-[32px]">
      <Text typo="subtitle-1-bold" color="secondary" className="text-center">
        스토어에 방문할 필요 없이 <br />
        3초만에 다운로드 받아보세요
      </Text>

      <div className="flex-center mt-[40px] size-[130px] shrink-0 rounded-[30px] bg-surface-1">
        <ImgSymbol className="size-[73.41px]" />
      </div>

      <IcLogo className="mt-[12px] w-[87px] shrink-0" />

      <div className="mt-[40px] flex w-[271px] flex-col items-center gap-[32px]">
        <div className="flex w-full items-center gap-[8px]">
          <div className="flex-center size-[24px] rounded-[4px] bg-orange-200">
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              1
            </Text>
          </div>
          <div className="flex items-center">
            {/* 아이콘 추가 필요 */}
            {/* <Icon name="ios-share" className="mr-[4px] size-[24px] text-[#4C5052]" /> */}
            <Text typo="subtitle-2-bold" color="secondary">
              버튼 누르기
            </Text>
          </div>
        </div>

        <div className="flex-center flex-col gap-[13px]">
          <Text typo="body-1-medium" color="sub">
            Safari: 브라우저 하단
          </Text>
          <img src={'/images/ios-install-info-browser-button-safari.png'} alt="" width={261} height={46} />
        </div>

        <div className="flex-center flex-col gap-[13px]">
          <Text typo="body-1-medium" color="sub">
            Chrome: 브라우저 우측 상단
          </Text>
          <img src={'/images/ios-install-info-browser-button-chrome.png'} alt="" width={245} height={51} />
        </div>
      </div>

      <div className="mt-[63px] flex w-[271px] flex-col items-center gap-[27px]">
        <div className="flex w-full items-center gap-[8px]">
          <div className="flex-center size-[24px] rounded-[4px] bg-orange-200">
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              2
            </Text>
          </div>
          <Text typo="subtitle-2-bold" color="secondary">
            {`'홈 화면에 추가' 선택`}
          </Text>
        </div>

        <img src={'/images/ios-install-info-add-home.png'} alt="" width={276} height={121} />
      </div>

      <div className="mt-[48px] flex w-[271px] flex-col items-center gap-[27px]">
        <div className="flex w-full items-center gap-[8px]">
          <div className="flex-center size-[24px] rounded-[4px] bg-orange-200">
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              3
            </Text>
          </div>
          <Text typo="subtitle-2-bold" color="secondary">
            추가하면 다운로드 완료!
          </Text>
        </div>

        <img src={'/images/ios-install-info-set-application.png'} alt="" width={255} height={80} />
      </div>
    </main>
  )
}

const AppInstallAos = () => {
  const { handleInstallClick } = useInstallPWA()

  return (
    <main className="flex min-h-dvh w-dvw max-w-mobile flex-col items-center overflow-y-auto bg-base-02 px-[16px] py-[32px]">
      <Text typo="subtitle-1-bold" color="secondary" className="text-center">
        스토어에 방문할 필요 없이 <br />
        3초만에 다운로드 받아보세요
      </Text>

      <div className="flex-center mt-[40px] size-[130px] rounded-[30.59px] bg-surface-1">
        <ImgSymbol className="size-[73.41px]" />
      </div>

      <IcLogo className="mt-[12px] w-[87px] shrink-0" />

      <Button onClick={handleInstallClick} className="mt-[66.15px]">
        앱 다운로드
      </Button>
    </main>
  )
}
