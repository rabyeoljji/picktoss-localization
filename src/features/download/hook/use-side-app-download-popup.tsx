import { useEffect, useState } from 'react'
import { isDesktop, isMobile } from 'react-device-detect'

import { IcClose } from '@/shared/assets/icon'
import { ImgPush } from '@/shared/assets/images'
import { Text } from '@/shared/components/ui/text'
import useBreakpoint from '@/shared/hooks/use-breakpoint'
import { usePWA } from '@/shared/hooks/use-pwa'

export const useSideAppDownloadPopup = () => {
  const { isPWA } = usePWA()
  const { isDesktopSize } = useBreakpoint()
  const [isSideAppDownloadPopupOpen, setIsSideAppDownloadPopupOpen] = useState(!isPWA && isDesktop && isDesktopSize)

  useEffect(() => {
    if (!isPWA && isDesktop && isDesktopSize) {
      setIsSideAppDownloadPopupOpen(true)
    } else {
      setIsSideAppDownloadPopupOpen(false)
    }
  }, [isPWA, isMobile, isDesktopSize])

  if (isSideAppDownloadPopupOpen) {
    return (
      <div className="fixed bottom-[28.33px] right-[59px] z-10 w-[248px] pt-[32px] pb-[8px] border border-outline rounded-[12px] shadow-[var(--shadow-md)]">
        <IcClose
          onClick={() => setIsSideAppDownloadPopupOpen(false)}
          className="absolute top-[16px] right-[16px] size-[16px] text-icon-secondary cursor-pointer"
        />

        <div className="flex-center flex-col">
          <div className="flex-center flex-col gap-[4px]">
            <Text typo="subtitle-1-bold">확실한 성장의 시작</Text>
            <Text typo="body-1-bold" color="sub" className="text-center">
              3초만에 픽토스 앱 다운받고 <br />
              매일 간편하게 퀴즈 풀어보세요!
            </Text>
            <div className="pt-[20px] pb-[16px]">
              <div className="relative size-[96px] w-full flex-center">
                <div className="absolute">
                  <FocusBox />
                </div>

                <img
                  src="/images/QR_picktoss_app_install.png"
                  alt="픽토스 앱 다운로드 QR코드"
                  className="w-[83.38px] h-[83.38px]"
                />
              </div>
            </div>
          </div>

          <ImgPush className="w-[232px] h-[154.67px]" />
        </div>
      </div>
    )
  }
}

const FocusBox = () => {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.19533 3.92472C5.38902 3.92472 3.92472 5.38902 3.92472 7.19532V13.0824C3.92472 14.1662 3.04614 15.0448 1.96236 15.0448C0.878579 15.0448 0 14.1662 0 13.0824V7.19532C0 3.22145 3.22146 0 7.19533 0H13.0824C14.1662 0 15.0448 0.878579 15.0448 1.96236C15.0448 3.04614 14.1662 3.92472 13.0824 3.92472H7.19533Z"
        fill="#FB8320"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M88.8047 3.92472C90.611 3.92472 92.0753 5.38902 92.0753 7.19532V13.0824C92.0753 14.1662 92.9539 15.0448 94.0376 15.0448C95.1214 15.0448 96 14.1662 96 13.0824V7.19532C96 3.22145 92.7785 0 88.8047 0H82.9176C81.8338 0 80.9552 0.878579 80.9552 1.96236C80.9552 3.04614 81.8338 3.92472 82.9176 3.92472H88.8047Z"
        fill="#FB8320"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.19533 92.0753C5.38902 92.0753 3.92472 90.611 3.92472 88.8047V82.9176C3.92472 81.8338 3.04614 80.9552 1.96236 80.9552C0.878579 80.9552 0 81.8338 0 82.9176V88.8047C0 92.7785 3.22146 96 7.19533 96H13.0824C14.1662 96 15.0448 95.1214 15.0448 94.0376C15.0448 92.9539 14.1662 92.0753 13.0824 92.0753H7.19533Z"
        fill="#FB8320"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M88.8047 92.0753C90.611 92.0753 92.0753 90.611 92.0753 88.8047V82.9176C92.0753 81.8338 92.9539 80.9552 94.0376 80.9552C95.1214 80.9552 96 81.8338 96 82.9176V88.8047C96 92.7785 92.7785 96 88.8047 96H82.9176C81.8338 96 80.9552 95.1214 80.9552 94.0376C80.9552 92.9539 81.8338 92.0753 82.9176 92.0753H88.8047Z"
        fill="#FB8320"
      />
    </svg>
  )
}
