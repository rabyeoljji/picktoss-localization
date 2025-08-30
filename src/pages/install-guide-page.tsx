import { useState } from 'react'
import { isIOS } from 'react-device-detect'

import Splash from '@/app/splash'

import { IcLogo } from '@/shared/assets/icon'
import { ImgSymbol } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

export const InstallGuidePage = () => {
  const router = useRouter()
  const { isPWA, installPWA, isLoading } = usePWA()

  if (isPWA) {
    router.push('/')
  }

  if (isLoading) {
    return <Splash />
  }

  if (isIOS) {
    return <AppInstallIos />
  } else {
    return <AppInstallAos handleInstallClick={installPWA} />
  }
}

const AppInstallIos = () => {
  const { t } = useTranslation()

  return (
    <main className="flex h-dvh flex-col items-center overflow-y-auto bg-base-02 px-[16px] pb-[112px] pt-[52px]">
      <Text typo="h2" color="secondary" className="text-center">
        <span className="text-caption">{t('etc.install_guide_page.store_visit_message')}</span>
        <br />
        {t('etc.install_guide_page.quick_start_message')}
      </Text>

      <div className="mt-[49px] flex flex-col gap-4 *:w-full *:max-w-[380px]">
        <img src="/images/ios-guide-1.png" alt="" />

        <img src="/images/ios-guide-2.png" alt="" />

        <img src="/images/ios-guide-3.png" alt="" />
      </div>
    </main>
  )
}

interface AppInstallAosProps {
  handleInstallClick: () => void
}

const AppInstallAos = ({ handleInstallClick }: AppInstallAosProps) => {
  const [showInstallGuide, setShowInstallGuide] = useState(false)
  const { t } = useTranslation()

  if (showInstallGuide) {
    return (
      <main className="flex h-dvh flex-col items-center overflow-y-auto bg-base-02 px-[16px] pb-[112px] pt-[52px]">
        <Text typo="h2" color="secondary" className="text-center">
          <span className="text-caption">{t('etc.install_guide_page.store_visit_message')}</span>
          <br />
          {t('etc.install_guide_page.quick_start_message')}
        </Text>

        <div className="mt-[49px] flex flex-col gap-4 *:w-full *:max-w-[380px]">
          <img src="/images/ios-guide-1.png" alt="" />

          <img src="/images/ios-guide-2.png" alt="" />

          <img src="/images/ios-guide-3.png" alt="" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-dvh flex-col flex-center overflow-y-auto bg-base-02 px-[16px] py-[32px]">
      <Text typo="h2" color="secondary" className="text-center">
        <span className="text-caption">{t('etc.install_guide_page.store_visit_message')}</span>
        <br />
        {t('etc.install_guide_page.quick_start_message')}
      </Text>

      <div className="py-[24px] px-[30px] rounded-[24px] bg-surface-1 mt-[44px] w-full max-w-[380px]">
        <ImgSymbol className="size-[100px] mt-[32px] mx-auto" />
        <IcLogo className="mt-4 w-[140px] shrink-0 mx-auto" />

        <Button onClick={handleInstallClick} className="mt-[48px]">
          {t('etc.install_guide_page.app_download_button')}
        </Button>
      </div>

      <button onClick={() => setShowInstallGuide(true)}>
        <Text typo="body-1-medium" color="secondary" className="text-center underline mt-[32px] underline-offset-2">
          {t('etc.install_guide_page.download_help_message')}
        </Text>
      </button>
    </main>
  )
}
