import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useLocation } from 'react-router'

import { TokenResponse, useGoogleLogin } from '@react-oauth/google'

import { useLogin } from '@/entities/auth/api/hooks'

import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'
import { setLocalStorageItem } from '@/shared/lib/storage/lib'

import { useAuthStore } from './auth-store'

export const useGLogin = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const location = useLocation()
  const setToken = useAuthStore((state) => state.setToken)
  const setIsSignUp = useAuthStore((state) => state.setIsSignUp)
  const { isPWA } = usePWA()

  const { mutateAsync: loginMutation } = useLogin()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setIsLoading(true)
      try {
        const result = await loginMutation({
          data: {
            accessToken: tokenResponse.access_token,
            socialPlatform: 'GOOGLE',
          },
        })
        setToken(result.accessToken)
        setIsSignUp(result.signUp)

        if (result.signUp) {
          setLocalStorageItem('checkRewardDialog', true)
        }

        const defaultPath = !isPWA && isMobile ? '/explore' : '/'

        // 이전 페이지가 있으면 해당 페이지로 리다이렉트, 없으면 홈으로 리다이렉트
        const from = location.state?.from || defaultPath

        router.replace(from, {})

        onSuccess?.()
      } catch (error) {
        console.error('Google 로그인 실패:', error)
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google 로그인 오류:', error)
      setIsLoading(false)
    },
  })

  const googleLogin = () => {
    login()
  }

  return { googleLogin, isLoading }
}
