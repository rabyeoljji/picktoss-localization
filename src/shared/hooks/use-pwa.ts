import { useEffect, useState } from 'react'

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const checkPWA = () => {
      // 대부분의 브라우저용
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      // iOS Safari의 경우
      const isIOSStandalone = window.navigator.standalone === true
      setIsPWA(isStandalone || isIOSStandalone)
    }

    checkPWA()

    // display-mode 변경에 따른 반응이 필요한 경우 이벤트 리스너 추가 가능
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handler = () => checkPWA()
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    }
  }, [])

  const installPWA = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt()
        const result = await installPrompt.userChoice

        if (result.outcome === 'accepted') {
          console.log('앱 설치 승인')
        } else {
          console.log('앱 설치 거부')
        }

        setIsInstallable(false)
      } catch (error) {
        // 추가 폴백 메커니즘
        console.error('설치 중 오류 발생', error)

        alert(
          '앱 설치 과정에서 오류가 발생했습니다. 다시 시도해주세요. 문제가 반복될 경우 브라우저의 ⋮ (더보기) 버튼 혹은 공유 버튼을 클릭 후 "홈 화면에 추가" 옵션을 클릭하시면 앱 설치가 가능합니다.',
        )
        // 안드로이드 대응 (play store 앱 설치 링크로 이동하는 코드 - 추후 앱 등록 시 사용)
        // if (/Android/i.test(navigator.userAgent)) {
        //   window.location.href =
        //     'intent:#Intent;action=android.intent.action.VIEW;' + `package=${getPackageName()};end`
        // }
      }
    }
  }

  return { isPWA, isInstallable, installPWA }
}
