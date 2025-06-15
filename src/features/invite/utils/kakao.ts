import { nativeShare } from '@/features/invite/utils/share'

interface ShareOptions {
  title: string
  description: string
  imageUrl: string
  inviteLinkUrl: string
}

export const loadKakaoSDK = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return

    if (window.Kakao && window.Kakao.isInitialized()) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js'
    script.onload = () => {
      try {
        const appKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

        if (!appKey) return reject(new Error('Kakao API Key가 설정되지 않았습니다.'))

        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(appKey)
        }

        // ✅ 실제로 Auth 모듈이 존재하는지 확인
        if (window.Kakao.Auth && typeof window.Kakao.Auth.login === 'function') {
          resolve()
        } else {
          // 조금 기다렸다가 다시 확인
          setTimeout(() => {
            if (window.Kakao.Auth && typeof window.Kakao.Auth.login === 'function') {
              resolve()
            } else {
              reject(new Error('Kakao SDK Auth 모듈이 준비되지 않았습니다.'))
            }
          }, 100)
        }
      } catch (e) {
        reject(new Error('Kakao SDK 초기화 실패: ' + (e as Error).message))
      }
    }
    script.onerror = () => {
      reject(new Error('Kakao SDK 스크립트 로드 실패'))
    }

    document.head.appendChild(script)
  })
}

// 폴백 : 기본 공유, 카카오톡 웹 공유
const fallbackToWebShare = async (options: ShareOptions) => {
  const { title, description, inviteLinkUrl } = options

  try {
    // 기본 공유 기능 사용
    const content = {
      title,
      text: description,
      url: inviteLinkUrl,
    }

    await nativeShare(content)
  } catch (error) {
    console.error(error)
  }

  try {
    // 카카오톡 웹 공유 링크로 폴백
    const webShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(inviteLinkUrl)}`
    window.open(webShareUrl, '_blank')
  } catch (error) {
    console.error(error)
  }
}

let isSharing = false // 공유 중 여부 체크

export const shareToKakao = async (options: ShareOptions) => {
  if (isSharing) return // 공유 중이면 요청 무시
  isSharing = true

  const { inviteLinkUrl } = options
  const templateId = import.meta.env.VITE_KAKAO_TEMPLETE_ID

  if (!window.Kakao?.isInitialized()) {
    isSharing = false
    throw new Error('Kakao SDK가 초기화되지 않았습니다.')
  }

  try {
    // 카카오 메시지 템플릿 사용
    window.Kakao.Share.sendCustom({
      templateId: Number(templateId),
      templateArgs: {
        code: inviteLinkUrl.split('/invite/')[1] ?? '',
      },
    })
  } catch (error) {
    console.error('카카오 공유 실패:', error)
    // 폴백 처리
    return fallbackToWebShare(options)
  } finally {
    setTimeout(() => (isSharing = false), 500)
  }
}
