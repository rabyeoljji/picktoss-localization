import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useLocation } from 'react-router'

import { useLogin } from '@/entities/auth/api/hooks'

import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'

import { useAuthStore } from './auth-store'

declare global {
  interface Window {
    Kakao: any
  }
}

export const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isKakaoReady, setIsKakaoReady] = useState(false)
  const router = useRouter()
  const location = useLocation()
  const setToken = useAuthStore((state) => state.setToken)
  const { isPWA } = usePWA()

  const { mutateAsync: loginMutation } = useLogin()

  useEffect(() => {
    const initKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoAppKey = import.meta.env.VITE_KAKAO_JS_KEY
        if (kakaoAppKey) {
          window.Kakao.init(kakaoAppKey)
          console.log('카카오 SDK 초기화 완료')
          setIsKakaoReady(true)
        } else {
          console.error('카카오 앱 키가 설정되지 않았습니다.')
        }
      } else if (window.Kakao && window.Kakao.isInitialized()) {
        console.log('카카오 SDK 이미 초기화됨')
        setIsKakaoReady(true)
      }
    }

    // 카카오 SDK가 로드될 때까지 기다림
    const checkKakaoSDK = () => {
      if (window.Kakao) {
        initKakao()
      } else {
        setTimeout(checkKakaoSDK, 100)
      }
    }

    checkKakaoSDK()
  }, [])

  const kakaoLogin = () => {
    if (!isKakaoReady || !window.Kakao) {
      console.error('카카오 SDK가 준비되지 않았습니다.')
      return
    }

    console.log('카카오 로그인 시작')
    console.log('Kakao Auth 메서드들:', Object.keys(window.Kakao.Auth || {}))
    setIsLoading(true)

    // 카카오 로그인 - 명시적 Redirect URI 설정
    window.Kakao.Auth.login({
      redirectUri: window.location.origin,
      success: async (authObj: any) => {
        console.log('카카오 로그인 성공:', authObj)
        try {
          const result = await loginMutation({
            data: {
              accessToken: authObj.access_token,
              socialPlatform: 'KAKAO',
            },
          })
          setToken(result.accessToken)

          const defaultPath = !isPWA && isMobile ? '/explore' : '/'
          const from = location.state?.from || defaultPath

          router.replace(from as any, {})
        } catch (error) {
          console.error('백엔드 로그인 실패:', error)
          setIsLoading(false)
        }
      },
      fail: (err: any) => {
        console.error('카카오 로그인 실패:', err)
        setIsLoading(false)
      },
    })
  }

  return {
    kakaoLogin,
    isLoading,
    isKakaoReady,
  }
}
