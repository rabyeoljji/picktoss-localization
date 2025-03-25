import { Outlet } from 'react-router'

import ErrorWrapper from '@/app/error'

export const RootLayout = () => {
  return (
    <div className="mx-auto h-screen max-w-xl bg-gray-50">
      <ErrorWrapper>
        <Outlet />
      </ErrorWrapper>
    </div>
  )
}
