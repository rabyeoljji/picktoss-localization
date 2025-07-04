import { useEffect } from 'react'

/**
 * Hook to escape in-app browsers for KakaoTalk and Slack (Android)
 *
 * - Detects KakaoTalk in-app browser and uses its URI schemes to open externally.
 * - Detects Slack in-app browser (Android) and launches Chrome via Android Intent.
 * - Prevents infinite redirect loops using `?ext=1` flag.
 * - Note: Escaping Slack iOS in-app browser (SFSafariViewController) is not supported programmatically.
 */
export function useExternalBrowser() {
  useEffect(() => {
    const ua = navigator.userAgent
    const isKakao = /KAKAOTALK/i.test(ua)
    const isSlack = /Slack\//i.test(ua)

    // Prevent recursive redirects
    const urlObj = new URL(window.location.href)
    if (!isKakao && !isSlack) return
    if (urlObj.searchParams.has('ext')) return

    // Append ext flag
    urlObj.searchParams.set('ext', '1')
    const target = urlObj.toString()

    if (isKakao) {
      // Close Kakao in-app and open external
      window.location.href = 'kakaotalk://inappbrowser/close'
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(target)}`
    } else if (isSlack) {
      // Android: launch Chrome via Intent to escape Slack WebView
      const { host, pathname, search } = window.location
      const intentUrl = `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`
      window.location.href = intentUrl
      // iOS Slack in-app (SFSafariViewController) cannot be closed programmatically.
      // Optionally, try Slack deep-link (may open Slack app instead):
      // window.location.href = `slack://open?url=${encodeURIComponent(target)}`
    }
  }, [])
}
