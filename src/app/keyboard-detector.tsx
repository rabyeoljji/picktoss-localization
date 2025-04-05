import { useEffect, useState } from 'react'

interface KeyboardDetectorProps {
  onKeyboardVisibilityChange: (isVisible: boolean) => void
}

/**
 * KeyboardDetector component that detects keyboard visibility on mobile devices
 * and updates CSS variables for viewport height
 */
export const KeyboardDetector = ({ onKeyboardVisibilityChange }: KeyboardDetectorProps) => {
  const [initialHeight, setInitialHeight] = useState(0)

  useEffect(() => {
    // 초기 화면 높이 저장
    setInitialHeight(window.innerHeight)

    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 더 정확한 키보드 감지를 위해 여러 조건 사용
      const heightDifference = initialHeight - visualViewport.height
      const heightRatio = visualViewport.height / initialHeight
      
      // 키보드가 올라왔는지 감지 (높이 차이가 100px 이상이거나 높이 비율이 0.85 미만)
      const isKeyboard = heightDifference > 100 || heightRatio < 0.85

      // 포커스된 요소가 입력 요소인지 확인 (추가 검증)
      const activeElement = document.activeElement
      const isInputFocused = 
        activeElement instanceof HTMLInputElement || 
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement && activeElement.getAttribute('contenteditable') === 'true')
      
      // 입력 요소에 포커스가 있고 화면 크기가 변경된 경우에만 키보드가 표시된 것으로 간주
      const keyboardVisible = isKeyboard && (isInputFocused || false)

      // 전역 상태 업데이트
      onKeyboardVisibilityChange(keyboardVisible)

      // 키보드 상태에 따라 CSS 변수 설정
      document.documentElement.style.setProperty('--viewport-height', `${visualViewport.height}px`)
      document.documentElement.style.setProperty(
        '--keyboard-height',
        keyboardVisible ? `${initialHeight - visualViewport.height}px` : '0px',
      )

      // 디버깅용 콘솔 로그 (개발 환경에서만 사용)
      if (process.env.NODE_ENV === 'development') {
        console.log({
          initialHeight,
          currentHeight: visualViewport.height,
          heightDifference,
          heightRatio,
          isKeyboard,
          isInputFocused,
          keyboardVisible
        })
      }
    }

    // 다양한 이벤트에 리스너 추가
    visualViewport.addEventListener('resize', handleViewportChange)
    visualViewport.addEventListener('scroll', handleViewportChange)
    
    // 포커스 이벤트도 감지
    window.addEventListener('focusin', handleViewportChange)
    window.addEventListener('focusout', handleViewportChange)

    // iOS에서 스크롤 이벤트 감지를 위한 추가 리스너
    document.addEventListener('touchmove', handleViewportChange)
    document.addEventListener('touchend', handleViewportChange)

    // 초기 실행
    handleViewportChange()

    return () => {
      visualViewport.removeEventListener('resize', handleViewportChange)
      visualViewport.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('focusin', handleViewportChange)
      window.removeEventListener('focusout', handleViewportChange)
      document.removeEventListener('touchmove', handleViewportChange)
      document.removeEventListener('touchend', handleViewportChange)
    }
  }, [onKeyboardVisibilityChange, initialHeight])

  // This is a utility component that doesn't render anything
  return null
}
