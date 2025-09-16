import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useLocation } from 'react-router'

import { KakaoInstance } from '@/types/kakao'

import { useKakaoSDK } from '@/features/invite/hooks/use-kakao-sdk'

import { useLogin } from '@/entities/auth/api/hooks'

import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'
import { setLocalStorageItem } from '@/shared/lib/storage/lib'

import { useAuthStore } from './auth-store'

declare global {
  interface Window {
    Kakao: KakaoInstance
  }
}

export const useKakaoLogin = (onSuccess?: () => void) => {
  const { isLoaded: isKakaoSDKLoaded, error: kakaoSDKError } = useKakaoSDK()

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const location = useLocation()
  const setToken = useAuthStore((state) => state.setToken)
  const setIsSignUp = useAuthStore((state) => state.setIsSignUp)
  const { isPWA } = usePWA()

  const { mutateAsync: loginMutation } = useLogin()

  const loginWithKakao = async () => {
    setIsLoading(true)

    if (!isKakaoSDKLoaded || kakaoSDKError) {
      console.error('Kakao SDK 로드 실패:', kakaoSDKError)
      return
    }

    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY)
      }

      if (!window.Kakao?.Auth?.login) {
        console.error('Kakao SDK Auth 모듈이 없음')
        return
      }

      window.Kakao.Auth.login({
        scope: 'profile_nickname, account_email',
        success: async (authObj) => {
          const result = await loginMutation({
            data: {
              accessToken: authObj.access_token,
              socialPlatform: 'KAKAO',
            },
          })

          setToken(result.accessToken)
          setIsSignUp(result.signUp)

          if (result.signUp) {
            setLocalStorageItem('checkRewardDialog', true)
          }

          const defaultPath = !isPWA && isMobile ? '/explore' : '/'
          const from = location.state?.from || defaultPath
          router.replace(from, {})

          onSuccess?.()
        },
        fail: (err: unknown) => {
          console.error('카카오 로그인 실패:', err)
          setIsLoading(false)
        },
      })
    } catch (error) {
      console.error('카카오 로그인 오류:', error)
      setIsLoading(false)
    }
  }

  return { kakaoLogin: loginWithKakao, isLoading }
}
