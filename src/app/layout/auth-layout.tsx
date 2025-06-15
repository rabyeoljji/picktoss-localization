// import { isMobile } from 'react-device-detect'
import { useEffect, useRef } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'

export const AuthLayout = () => {
  const token = useStore(useAuthStore, (state) => state.token)
  const location = useLocation()

  const initialTokenRef = useRef(token)

  useEffect(() => {
    if (initialTokenRef.current && token && initialTokenRef.current !== token) {
      window.location.reload()
    }
  }, [token])

  if (!token) {
    // TODO: 배포 시 pc에서는 랜딩 페이지로 리다이렉트
    // if (!isMobile) {
    //   window.location.href = 'https://picktoss.framer.website/'
    // }

    return <Navigate to="/explore" state={{ from: location.pathname + location.search }} />
    // 현재 경로를 state로 전달하여 로그인 후 리다이렉트할 수 있도록 함
    // return <Navigate to="/login" state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}
