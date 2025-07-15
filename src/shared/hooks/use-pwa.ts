import { useEffect, useState } from 'react'

import usePwa from 'use-pwa'

export const usePWA = () => {
  const { appinstalled, canInstallprompt, showInstallPrompt } = usePwa()

  const [isPWA, setIsPWA] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const checkPWA = () => {
      const isIOSStandalone =
        typeof window !== 'undefined' && 'standalone' in window.navigator && window.navigator.standalone

      const isStandaloneMedia =
        typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches

      setIsPWA(Boolean(isIOSStandalone || isStandaloneMedia))
    }

    checkPWA()

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener?.('change', checkPWA)

    return () => {
      mediaQuery.removeEventListener?.('change', checkPWA)
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
