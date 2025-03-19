import { Navigate, Outlet } from 'react-router'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'

export const AuthLayout = () => {
  const token = useStore(useAuthStore, (state) => state.token)

  if (!token) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}
