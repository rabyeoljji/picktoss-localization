interface ShareContent {
  title: string
  text: string
  url: string
}

export const nativeShare = async (shareContent: ShareContent, fallback?: () => Promise<void>) => {
  const { title, text, url } = shareContent

  if (navigator.share) {
    try {
      // todo: 이용자 관심분야에 따라 open graph 썸네일 다르게
      await navigator.share({ title, text, url })
    } catch (error) {
      console.error('공유하기 실패:', error)

      if (error instanceof Error) {
        // 오류가 사용자 취소가 아닌 경우에만 fallback 실행
        if (error.name !== 'AbortError' && fallback) {
          await fallback()
        }
      }
    }
  } else {
    if (fallback) {
      // 공유 API를 지원하지 않는 환경에서 실행될 폴백 함수
      await fallback()
    }
  }
}
