import { useEffect } from 'react'

export function useKakaoExternal() {
  useEffect(() => {
    const ua = navigator.userAgent
    const isKakao = /KAKAOTALK/i.test(ua)

    // ‘?ext=1’ 같은 플래그가 있으면 재귀 호출 방지
    const already = new URL(location.href).searchParams.has('ext')
    if (!isKakao || already) return

    const target = encodeURIComponent(location.origin + location.pathname + location.search + '&ext=1')

    // ① 인앱 창 닫기(안드로이드) ② 외부 브라우저로 열기
    location.href = 'kakaotalk://inappbrowser/close' // try‑catch 필요 없음
    location.href = `kakaotalk://web/openExternal?url=${target}`
  }, [])
}
