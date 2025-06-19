import { useEffect, useState } from 'react'

import { usePwa } from '@dotmind/react-use-pwa'

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

// interface BeforeInstallPromptEvent extends Event {
//   readonly platforms: Array<string>
//   readonly userChoice: Promise<{
//     outcome: 'accepted' | 'dismissed'
//     platform: string
//   }>
//   prompt(): Promise<void>
// }

export const usePWA = () => {
  // const [isPWA, setIsPWA] = useState<boolean | undefined>(undefined)
  const { isStandalone, installPrompt, isInstalled, canInstall } = usePwa()

  const [init, setInit] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setInit(true)
    }, 1500)
  }, [])

  // useEffect(() => {
  //   const checkPWA = () => {
  //     // 대부분의 브라우저용
  //     const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  //     // iOS Safari의 경우
  //     const isIOSStandalone = window.navigator.standalone === true
  //     const pwaStatus = isStandalone || isIOSStandalone

  //     setIsPWA(pwaStatus)

  //     // PWA가 이미 설치되어 있다면 installed를 true로 설정
  //     if (pwaStatus) {
  //       setInstalled(true)
  //     }
  //   }

  //   checkPWA()

  //   // display-mode 변경에 따른 반응이 필요한 경우 이벤트 리스너 추가 가능
  //   const mediaQuery = window.matchMedia('(display-mode: standalone)')
  //   const handler = () => checkPWA()
  //   mediaQuery.addEventListener('change', handler)
  //   return () => mediaQuery.removeEventListener('change', handler)
  // }, [])

  // useEffect(() => {
  //   // PWA 설치 조건 체크 및 디버깅
  //   const checkPWAConditions = async () => {
  //     if (import.meta.env.DEV) {
  //       console.log('=== PWA 설치 조건 체크 ===')

  //       // Service Worker 체크
  //       if ('serviceWorker' in navigator) {
  //         const registration = await navigator.serviceWorker.getRegistration()
  //         console.log('Service Worker 등록 상태:', registration ? 'OK' : 'NOT_REGISTERED')
  //       } else {
  //         console.log('Service Worker 지원:', 'NOT_SUPPORTED')
  //       }

  //       // Manifest 체크
  //       try {
  //         const manifestResponse = await fetch('/manifest.webmanifest')
  //         console.log('Manifest 파일:', manifestResponse.ok ? 'OK' : 'NOT_FOUND')
  //       } catch (error) {
  //         console.log('Manifest 파일:', 'NOT_ACCESSIBLE', error)
  //       }

  //       // 브라우저 지원 체크
  //       console.log('beforeinstallprompt 지원:', 'beforeinstallprompt' in window ? 'YES' : 'NO')
  //       console.log('현재 브라우저:', navigator.userAgent)
  //       console.log('HTTPS:', location.protocol === 'https:' ? 'YES' : 'NO')
  //       console.log('현재 PWA 상태:', isPWA)
  //       console.log('설치 상태:', isInstalled)
  //     }
  //   }

  //   checkPWAConditions()

  //   const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
  //     if (import.meta.env.DEV) {
  //       console.log('beforeinstallprompt 이벤트 발생!', e)
  //     }
  //     e.preventDefault()
  //     setInstallPrompt(e)
  //     setInstallable(true)
  //     setInstalled(false) // 설치 프롬프트가 나타나면 확실히 설치되지 않은 상태
  //   }

  //   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

  //   // 앱이 이미 설치된 경우 감지
  //   window.addEventListener('appinstalled', () => {
  //     if (import.meta.env.DEV) {
  //       console.log('PWA가 설치되었습니다!')
  //     }
  //     setInstallable(false)
  //     setInstallPrompt(null)
  //     setInstalled(true) // 설치 완료되면 installed를 true로 설정
  //   })

  //   return () => {
  //     window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  //     window.removeEventListener('appinstalled', () => {})
  //   }
  // }, [isPWA, installPrompt, isInstalled])

  return { isPWA: isStandalone, canInstall, installPWA: installPrompt, isInstalled, init }
}
