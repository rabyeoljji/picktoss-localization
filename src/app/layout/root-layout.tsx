import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router'

export const RootLayout = () => {
  return (
    <div className="mx-auto h-screen max-w-xl bg-gray-50">
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
