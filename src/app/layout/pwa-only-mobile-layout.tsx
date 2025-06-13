import { isMobile } from 'react-device-detect'
import { Outlet } from 'react-router'

import { ImgSymbol } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'

export const PWAOnlyMobileLayout = () => {
  const router = useRouter()
  const { isPWA } = usePWA()

  if (!isPWA && isMobile) {
    return (
      <div
        className="size-full flex flex-col pt-[var(--header-height-safe)] px-[16px]"
        style={{
          backgroundImage: `url("/images/Background-with-falling-shooting-stars.png")`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex-1/2 flex-center flex-col gap-[28px]">
          <div className="size-[85px] bg-surface-1 rounded-[20px] shadow-[0px_0px_20px_#FCC27E] flex-center">
            <ImgSymbol className="size-[48px]" />
          </div>

          <Text typo="h2" color="inverse" className="text-center">
            모바일 픽토스는 <br />
            앱에서 만날 수 있어요
          </Text>
        </div>
        <div className="flex-1/2 flex flex-col gap-[16px] pt-[70px]">
          <Text typo="body-1-medium" color="accent" className="text-center">
            *사람들이 만든 퀴즈는 웹에서 풀 수 있어요
          </Text>

          <div className="flex flex-col gap-[8px]">
            <Button onClick={() => router.push('/install-guide')}>앱에서 전부 이용하기</Button>
            <Button variant="secondary1" onClick={() => router.push('/explore')}>
              다른 퀴즈 탐험하기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}
