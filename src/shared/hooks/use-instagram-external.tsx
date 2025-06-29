import { useEffect } from 'react'

export function useInstagramExternal() {
  useEffect(() => {
    const ua = navigator.userAgent
    // 인스타그램 인앱 브라우저 감지
    const isInstagram = /Instagram/i.test(ua) //  [oai_citation:0‡stackoverflow.com](https://stackoverflow.com/questions/50212683/how-to-open-link-in-external-browser-instead-of-in-app-instagram)

    // 이미 `?ext=1` 플래그가 있으면 재귀 호출 방지
    const already = new URL(window.location.href).searchParams.has('ext')
    if (!isInstagram || already) return

    const { origin, pathname, search } = window.location
    const connector = search ? '&' : '?'
    const target = `${origin}${pathname}${search}${connector}ext=1`

    // 플랫폼별 외부 브라우저 오픈 URL 구성
    let externalUrl = target
    if (/android/i.test(ua)) {
      // Android: Chrome으로 인텐트 방식 호출
      externalUrl = `intent://${window.location.host}${pathname}${search}${connector}ext=1#Intent;scheme=https;package=com.android.chrome;end` //  [oai_citation:1‡stackoverflow.com](https://stackoverflow.com/questions/50212683/how-to-open-link-in-external-browser-instead-of-in-app-instagram)
    } else if (/iPad|iPhone|iPod/i.test(ua)) {
      // iOS: Chrome 앱이 설치되어 있으면 열기
      externalUrl = `googlechrome://${window.location.host}${pathname}${search}${connector}ext=1`
    }

    // 인앱 브라우저 닫고 외부 브라우저 열기
    window.location.href = externalUrl
  }, [])
}
