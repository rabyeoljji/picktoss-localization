import { useEffect, useState } from 'react'

export function useInstagramExternal() {
  const [target, setTarget] = useState('')

  useEffect(() => {
    const ua = navigator.userAgent
    const isInstagram = /Instagram/i.test(ua)

    // '?ext=1' 같은 플래그가 있으면 재귀 호출 방지
    const already = new URL(location.href).searchParams.has('ext')
    if (!isInstagram || already) return

    const target =
      location.origin +
      location.pathname +
      location.search + // 쿼리에 무엇이 있든 그대로 두고
      (location.search ? '&' : '?') + // 쿼리 없는 주소엔 '?' 붙이기
      'ext=1'

    setTarget(target)
  }, [])

  if (!target) return null

  return (
    <a href={target} target="_blank" download>
      Open in browser
    </a>
  )
}
