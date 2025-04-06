import { useEffect, useRef, useState } from 'react'

function usePreventKeyboardScroll() {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const initialHeightRef = useRef(window.innerHeight)
  const scrollPosRef = useRef(window.scrollY)

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight
      // 초기 높이와 비교해서 100px 이상 줄어들면 키보드가 열린 것으로 판단
      if (initialHeightRef.current - currentHeight > 100) {
        // 키보드 열림 감지 시 현재 스크롤 위치 저장
        scrollPosRef.current = window.scrollY
        setKeyboardOpen(true)
      } else {
        setKeyboardOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (keyboardOpen) {
      const handleScroll = () => {
        // 키보드가 열려 있는 동안 스크롤 위치를 고정
        window.scrollTo(0, scrollPosRef.current)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [keyboardOpen])
}

export default usePreventKeyboardScroll
