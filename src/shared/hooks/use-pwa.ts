import { useEffect, useState } from 'react'

import usePwa from 'use-pwa'

export const usePWA = () => {
  const { appinstalled, canInstallprompt, showInstallPrompt } = usePwa()

  const [isPWA, setIsPWA] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const checkPWA = () => {
      try {
        const isIOSStandalone =
          typeof window !== 'undefined' && 'standalone' in window.navigator && window.navigator.standalone

        let isStandaloneMedia = false
        if (typeof window !== 'undefined' && window.matchMedia) {
          try {
            isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches
          } catch (error) {
            console.warn('matchMedia not supported or failed:', error)
          }
        }

        setIsPWA(Boolean(isIOSStandalone || isStandaloneMedia))
      } catch (error) {
        console.error('PWA check failed:', error)
        setIsPWA(false)
      }
    }

    checkPWA()

    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(display-mode: standalone)')
        mediaQuery.addEventListener?.('change', checkPWA)

        return () => {
          mediaQuery.removeEventListener?.('change', checkPWA)
        }
      } catch (error) {
        console.warn('Failed to setup mediaQuery listener:', error)
      }
    }
  }, [])

  return {
    isPWA,
    canInstall: canInstallprompt,
    installPWA: showInstallPrompt,
    isInstalled: appinstalled,
    isLoading: isPWA === undefined,
  }
}
