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
  const [isPWA, setIsPWA] = useState<boolean | undefined>(undefined)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installable, setInstallable] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [init, setInit] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setInit(true)
    }, 3000)
  }, [])

  useEffect(() => {
    const checkPWA = () => {
      // 대부분의 브라우저용
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      // iOS Safari의 경우
      const isIOSStandalone = window.navigator.standalone === true
      const pwaStatus = isStandalone || isIOSStandalone

      setIsPWA(pwaStatus)

      // PWA가 이미 설치되어 있다면 installed를 true로 설정
      if (pwaStatus) {
        setInstalled(true)
      }
    }

    checkPWA()

    // display-mode 변경에 따른 반응이 필요한 경우 이벤트 리스너 추가 가능
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handler = () => checkPWA()
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    // PWA 설치 조건 체크 및 디버깅
    const checkPWAConditions = async () => {
      if (import.meta.env.DEV) {
        console.log('=== PWA 설치 조건 체크 ===')

        // Service Worker 체크
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration()
          console.log('Service Worker 등록 상태:', registration ? 'OK' : 'NOT_REGISTERED')
        } else {
          console.log('Service Worker 지원:', 'NOT_SUPPORTED')
        }

        // Manifest 체크
        try {
          const manifestResponse = await fetch('/manifest.webmanifest')
          console.log('Manifest 파일:', manifestResponse.ok ? 'OK' : 'NOT_FOUND')
        } catch (error) {
          console.log('Manifest 파일:', 'NOT_ACCESSIBLE', error)
        }

        // 브라우저 지원 체크
        console.log('beforeinstallprompt 지원:', 'beforeinstallprompt' in window ? 'YES' : 'NO')
        console.log('현재 브라우저:', navigator.userAgent)
        console.log('HTTPS:', location.protocol === 'https:' ? 'YES' : 'NO')
        console.log('현재 PWA 상태:', isPWA)
        console.log('설치 상태:', installed)
      }
    }

    checkPWAConditions()

    // beforeinstallprompt 이벤트가 일정 시간 후에도 발생하지 않으면 이미 설치된 것으로 간주
    const timer = setTimeout(() => {
      if (!installPrompt && !isPWA) {
        // beforeinstallprompt 이벤트가 발생하지 않고 PWA 모드도 아닌 경우
        // 이미 설치되었을 가능성이 높음 (또는 설치 조건 미충족)
        setInstalled(true)
        if (import.meta.env.DEV) {
          console.log('beforeinstallprompt 이벤트 미발생 - 이미 설치된 것으로 판단')
        }
      }
    }, 0) // 3초 후 체크

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      if (import.meta.env.DEV) {
        console.log('beforeinstallprompt 이벤트 발생!', e)
      }
      clearTimeout(timer) // 이벤트가 발생하면 타이머 해제
      e.preventDefault()
      setInstallPrompt(e)
      setInstallable(true)
      setInstalled(false) // 설치 프롬프트가 나타나면 아직 설치되지 않은 상태
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    // 앱이 이미 설치된 경우 감지
    window.addEventListener('appinstalled', () => {
      if (import.meta.env.DEV) {
        console.log('PWA가 설치되었습니다!')
      }
      setInstallable(false)
      setInstallPrompt(null)
      setInstalled(true) // 설치 완료되면 installed를 true로 설정
    })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', () => {})
    }
  }, [isPWA, installPrompt, installed])

  const installPWA = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt()
        const result = await installPrompt.userChoice

        if (result.outcome === 'accepted') {
          if (import.meta.env.DEV) {
            console.log('앱 설치 승인')
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('앱 설치 거부')
          }
        }

        setInstallable(false)
      } catch (error) {
        // 추가 폴백 메커니즘
        if (import.meta.env.DEV) {
          console.error('설치 중 오류 발생', error)
        }

        alert(
          '앱 설치 과정에서 오류가 발생했습니다. 다시 시도해주세요. 문제가 반복될 경우 브라우저의 ⋮ (더보기) 버튼 혹은 공유 버튼을 클릭 후 "홈 화면에 추가" 옵션을 클릭하시면 앱 설치가 가능합니다.',
        )
      }
    }
  }

  return { isPWA, installable, installPWA, installed, init }
}
