import usePwa from 'use-pwa'

export const usePWA = () => {
  const { appinstalled, canInstallprompt, isPwa, isLoading, showInstallPrompt } = usePwa()

  return {
    isPWA: isPwa,
    canInstall: canInstallprompt,
    installPWA: showInstallPrompt,
    isInstalled: appinstalled,
    isLoading,
  }
}
