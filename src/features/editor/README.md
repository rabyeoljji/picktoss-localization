높이 변화 감지해서 --viewport-height 자체를 수정해버리기

```tsx
useEffect(() => {
  const visualViewport = window.visualViewport
  if (!visualViewport) return

  const handleViewportChange = () => {
    // 키보드가 올라왔을 때 높이 변화 감지
    document.documentElement.style.setProperty('--viewport-height', `${visualViewport.height}px`)
  }

  visualViewport.addEventListener('resize', handleViewportChange)
  visualViewport.addEventListener('scroll', handleViewportChange)

  // 초기 실행
  handleViewportChange()

  return () => {
    visualViewport.removeEventListener('resize', handleViewportChange)
    visualViewport.removeEventListener('scroll', handleViewportChange)
  }
}, [])
```
