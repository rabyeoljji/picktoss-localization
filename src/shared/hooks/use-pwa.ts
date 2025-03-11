import { useState, useEffect } from "react"

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    const checkPWA = () => {
      // 대부분의 브라우저용
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      // iOS Safari의 경우
      const isIOSStandalone = window.navigator.standalone === true
      setIsPWA(isStandalone || isIOSStandalone)
    }

    checkPWA()

    // display-mode 변경에 따른 반응이 필요한 경우 이벤트 리스너 추가 가능
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handler = () => checkPWA()
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return { isPWA }
}
