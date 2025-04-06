import { useEffect, useRef } from 'react'

interface UseVirtualScrollPreventionOptions {
  /**
   * 외부에서 키보드 노출 여부를 주입할 수 있음 (옵션)
   */
  isKeyboardVisible?: boolean
}

/**
 * 웹뷰에서 키패드가 열렸을 때 발생하는 가상 스크롤 영역 스크롤을 방지하는 훅
 * @param options 옵션 객체
 * @returns 가상 스크롤 방지에 사용할 컨테이너 ref
 */
export function useVirtualScrollPrevention(options?: UseVirtualScrollPreventionOptions) {
  const viewportWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.visualViewport || !viewportWrapRef.current) return

    const viewport = window.visualViewport
    const container = viewportWrapRef.current

    /**
     * visualViewport의 현재 상태에 따라 container의 스타일을 업데이트
     */
    const updateContainerStyle = () => {
      // 키보드가 열렸으면 window.innerHeight가 viewport.height보다 큽니다.
      const isKeyboardOpen = window.innerHeight > viewport.height

      if (isKeyboardOpen) {
        // 키보드가 열렸을 때: 컨테이너 높이를 visualViewport 높이로 고정하고,
        // position fixed와 transform을 통해 내용이 스크롤에 따라 움직이지 않도록 함
        container.style.height = `${viewport.height}px`
        container.style.position = 'fixed'
        container.style.top = '0'
        container.style.left = '0'
        container.style.right = '0'
        // visualViewport.offsetTop만큼 위로 이동하면 스크롤에 따른 이동 효과를 상쇄할 수 있음
        container.style.transform = `translateY(-${viewport.offsetTop}px)`
        // 필요시 overflow hidden을 추가해 내부 스크롤을 제한할 수도 있음
        container.style.overflow = 'hidden'
      } else {
        // 키보드가 닫혔을 때: 원래 상태로 복원
        container.style.height = ''
        container.style.position = ''
        container.style.top = ''
        container.style.left = ''
        container.style.right = ''
        container.style.transform = ''
        container.style.overflow = ''
      }
    }

    // visualViewport의 resize와 scroll 이벤트에 따라 스타일 업데이트
    const handleViewportResize = () => updateContainerStyle()
    const handleViewportScroll = () => updateContainerStyle()
    const handleWindowScroll = () => updateContainerStyle()

    viewport.addEventListener('resize', handleViewportResize)
    viewport.addEventListener('scroll', handleViewportScroll)
    window.addEventListener('scroll', handleWindowScroll)

    // 초기 업데이트
    updateContainerStyle()

    return () => {
      viewport.removeEventListener('resize', handleViewportResize)
      viewport.removeEventListener('scroll', handleViewportScroll)
      window.removeEventListener('scroll', handleWindowScroll)
    }
  }, [options?.isKeyboardVisible])

  return { viewportWrapRef }
}
