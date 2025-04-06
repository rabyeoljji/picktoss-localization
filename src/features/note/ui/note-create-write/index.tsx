import { useEffect, useState } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { usePWA } from '@/shared/hooks/use-pwa'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'
import './style.css'

export const NoteCreateWrite = () => {
  const { content, setContent } = useCreateNoteContext()
  const { isKeyboardVisible } = useKeyboard()
  const [textareaHeight, setTextareaHeight] = useState(300)
  const { isPWA } = usePWA()

  const handleTextareaChange = (content: string) => {
    setContent(content)
  }

  // Body 스크롤 제어를 위한 focus/blur 핸들러
  const handleFocus = () => {
    // 포커스 시 body 스크롤 잠금
    document.body.style.overflow = 'hidden'
    // 필요 시 스크롤을 0,0 위치로 고정
    setTimeout(() => window.scrollTo(0, 0), 50)
  }

  const handleBlur = () => {
    // 포커스 해제 시 body 스크롤 복원
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const updateHeight = () => {
      const availableHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight
      // 키보드가 보일 때와 아닐 때 빼야 할 높이
      const topFixedAreaHeight = 114
      const bottomFixedAreaHeight = isKeyboardVisible ? 40 : 96
      setTextareaHeight(availableHeight - topFixedAreaHeight - bottomFixedAreaHeight)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
    }

    return () => {
      window.removeEventListener('resize', updateHeight)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
      }
    }
  }, [isKeyboardVisible])

  return (
    <div className="flex-1 relative">
      <div
        style={{
          // 컨테이너 높이를 실제 가시 영역에서 고정영역을 뺀 값으로 지정
          height: `calc(100% - ${isKeyboardVisible ? 50 : 96}px + 1px)`,
          backgroundColor: 'red',
        }}
      >
        <Textarea
          placeholder="여기를 탭하여 입력을 시작하세요"
          className={cn('border-none px-4', isPWA && 'pb-[env(safe-area-inset-top)]')}
          // 포커스 시 body 스크롤을 막기 위한 핸들러 추가
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleTextareaChange(e.target.value)}
          style={{
            height: textareaHeight,
          }}
        />
      </div>

      {isKeyboardVisible && (
        <div className="flex justify-between bg-base-1 items-center px-4 h-[40px] border-t border-divider absolute bottom-0 w-full max-w-xl">
          <div className="flex items-center gap-1">
            <IcInfo className="size-4 text-icon-sub" />
            <Text typo="body-1-regular" color="caption">
              최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
            </Text>
          </div>
          <Text typo="body-1-medium" color="secondary">
            <span
              className={cn(
                content.length < DOCUMENT_CONSTRAINTS.CONTENT.MIN || content.length > DOCUMENT_CONSTRAINTS.CONTENT.MAX
                  ? 'text-critical'
                  : 'text-success',
              )}
            >
              {content.length}
            </span>{' '}
            / {DOCUMENT_CONSTRAINTS.CONTENT.MAX}
          </Text>
        </div>
      )}
    </div>
  )
}
