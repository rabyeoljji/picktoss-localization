# Shared Hooks

## useVirtualScrollPrevention

모바일 환경에서 키보드가 열렸을 때 생성되는 가상 공간으로의 스크롤을 방지하는 훅입니다.

### 사용법

```tsx
import { useVirtualScrollPrevention } from '@/shared/hooks/use-virtual-scroll-prevention'
import { useKeyboard } from '@/app/keyboard-detector' // 필요시 키보드 감지 훅 사용

function MyComponent() {
  const { isKeyboardVisible } = useKeyboard() // 키보드 상태 감지
  const { viewportWrapRef } = useVirtualScrollPrevention({ 
    isKeyboardVisible 
  })

  return (
    <div className="h-full" ref={viewportWrapRef}>
      {/* 컴포넌트 내용 */}
    </div>
  )
}
```

### 주의사항

1. 컴포넌트의 최상위 요소에 `viewportWrapRef`를 적용해야 합니다.
2. 최상위 요소에 height 값을 지정하는 것이 좋습니다 (예: `className="h-full"`)
3. PWA 환경에서 최적화되어 있습니다.
