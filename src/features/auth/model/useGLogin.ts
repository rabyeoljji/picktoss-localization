import { isMobile } from 'react-device-detect'

import { TokenResponse, useGoogleLogin } from '@react-oauth/google'

import { useLogin } from '@/entities/auth/api/hooks'

import { useRouter } from '@/shared/lib/router'

import { useAuthStore } from './auth-store'

export const useGLogin = () => {
  const router = useRouter()
  const setToken = useAuthStore((state) => state.setToken)

  const { mutateAsync: loginMutation } = useLogin()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const result = await loginMutation({
          data: {
            accessToken: tokenResponse.access_token,
            socialPlatform: 'GOOGLE',
          },
        })
        setToken(result.accessToken)

        if (isMobile) {
          router.push('/install-induce')
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Google 로그인 실패:', error)
      }
    },
    onError: (error) => {
      console.error('Google 로그인 오류:', error)
    },
  })

  return { googleLogin: login }
}
