interface KakaoAuthSuccess {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_token_expires_in: number
  scope: string
  token_type: string
}

interface KakaoAuth {
  login: (options: {
    scope?: string
    success: (authObj: KakaoAuthSuccess) => void
    fail: (err: unknown) => void
  }) => void
  logout: (callback?: () => void) => void
  getAccessToken: () => string | null
  setAccessToken: (token: string) => void
}

interface KakaoShareButton {
  title: string
  link: {
    mobileWebUrl?: string
    webUrl?: string
  }
}

interface KakaoShareContent {
  title: string
  description?: string
  imageUrl?: string
  link: {
    mobileWebUrl?: string
    webUrl?: string
  }
}

interface KakaoShareDefault {
  objectType: 'feed' | 'list' | 'commerce' | 'text' | 'location'
  content: KakaoShareContent
  social?: {
    likeCount?: number
    commentCount?: number
    sharedCount?: number
  }
  buttons?: KakaoShareButton[]
  callback?: () => void
}

interface KakaoShare {
  sendDefault: (settings: KakaoShareDefault) => void
  sendCustom: (templateInfo: { templateId: number; templateArgs?: Record<string, string> }) => void
}

interface KakaoInstance {
  init: (apiKey: string) => void
  isInitialized: () => boolean
  Auth: KakaoAuth
  Share: KakaoShare
}

// window 객체에 Kakao 속성 추가
declare global {
  interface Window {
    Kakao: KakaoInstance
  }
}

export type { KakaoInstance, KakaoShareDefault, KakaoShareContent, KakaoShareButton }
