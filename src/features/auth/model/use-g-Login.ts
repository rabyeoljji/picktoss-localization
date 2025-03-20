import { useState } from 'react'

import { TokenResponse, useGoogleLogin } from '@react-oauth/google'

import { useLogin } from '@/entities/auth/api/hooks'

import { useRouter } from '@/shared/lib/router'

import { useAuthStore } from './auth-store'

export const useGLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setToken = useAuthStore((state) => state.setToken)

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

        router.replace('/')
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
    setIsLoading(true)
    login()
  }

  return { googleLogin, isLoading }
}
