import { Navigate, Outlet, useLocation } from 'react-router'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'

export const AuthLayout = () => {
  const token = useStore(useAuthStore, (state) => state.token)
  const location = useLocation()

  if (!token) {
    // 현재 경로를 state로 전달하여 로그인 후 리다이렉트할 수 있도록 함
    // return <Navigate to="/login" state={{ from: location.pathname + location.search }} />
    return <Navigate to="/explore" state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}
