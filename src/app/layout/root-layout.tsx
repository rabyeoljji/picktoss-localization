import { Suspense } from 'react'
import { isMobile } from 'react-device-detect'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router'

import { cn } from '@/shared/lib/utils'

export const RootLayout = () => {
  const checkPWA = () => {
    const isIOSStandalone =
      typeof window !== 'undefined' && 'standalone' in window.navigator && window.navigator.standalone
    const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches

    return isIOSStandalone || isStandaloneMedia
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
    </div>
  )
}
