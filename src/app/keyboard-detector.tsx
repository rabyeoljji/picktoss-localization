import { useEffect } from 'react'

interface KeyboardDetectorProps {
  onKeyboardVisibilityChange: (isVisible: boolean) => void
}

/**
 * KeyboardDetector component that detects keyboard visibility on mobile devices
 * and updates CSS variables for viewport height
 */
export const KeyboardDetector = ({ onKeyboardVisibilityChange }: KeyboardDetectorProps) => {
  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔는지 감지 (화면 높이가 원래 높이의 80% 미만이면 키보드가 올라온 것으로 간주)
      const isKeyboard = visualViewport.height < window.innerHeight * 0.8

      // 전역 상태 업데이트
      onKeyboardVisibilityChange(isKeyboard)

      // 키보드 상태에 따라 CSS 변수 설정
      document.documentElement.style.setProperty('--viewport-height', `${visualViewport.height}px`)
      document.documentElement.style.setProperty(
        '--keyboard-height',
        isKeyboard ? `${window.innerHeight - visualViewport.height}px` : '0px',
      )
    }

    visualViewport.addEventListener('resize', handleViewportChange)
    visualViewport.addEventListener('scroll', handleViewportChange)

    // 초기 실행
    handleViewportChange()

    return () => {
      visualViewport.removeEventListener('resize', handleViewportChange)
      visualViewport.removeEventListener('scroll', handleViewportChange)
    }
  }, [onKeyboardVisibilityChange])

  // This is a utility component that doesn't render anything
  return null
}
