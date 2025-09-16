import { Suspense } from 'react'
import { isMobile } from 'react-device-detect'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router'

import { useSideAppDownloadPopup } from '@/features/download/hook/use-side-app-download-popup'

import { cn } from '@/shared/lib/utils'

export const RootLayout = () => {
  const sideAppDownloadPopup = useSideAppDownloadPopup()

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

      return isIOSStandalone || isStandaloneMedia
    } catch (error) {
      console.error('PWA check failed:', error)
      return false
    }
  }

  const accessMobileWeb = !checkPWA() && isMobile

  return (
    <div className={cn('mx-auto h-screen max-w-xl bg-gray-50 overscroll-none', accessMobileWeb && 'h-dvh')}>
      <ErrorBoundary
        fallbackRender={(e) => {
          console.error(e)
          return <div>error</div>
        }}
      >
        <Suspense>
          <Outlet />
        </Suspense>
      </ErrorBoundary>

      {sideAppDownloadPopup}
    </div>
  )
}
