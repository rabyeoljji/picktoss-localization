import { useEffect, useState } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useVirtualScrollPrevention } from '@/shared/hooks/use-virtual-scroll-prevention'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'
import './style.css'

export const NoteCreateWrite = () => {
  const { content, setContent } = useCreateNoteContext()
  const { isKeyboardVisible } = useKeyboard()
  const { viewportWrapRef } = useVirtualScrollPrevention()
  const [textareaHeight, setTextareaHeight] = useState(300)
  const { isPWA } = usePWA()

  const handleTextareaChange = (content: string) => {
    setContent(content)
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
    <div className="flex-1" ref={viewportWrapRef}>
      <div
        style={{
          // 컨테이너 높이를 실제 가시 영역에서 고정영역을 뺀 값으로 지정
          height: `calc(100% - ${isKeyboardVisible ? 40 : 96}px)`,
          backgroundColor: 'red',
        }}
      >
        <Textarea
          placeholder="여기를 탭하여 입력을 시작하세요"
          className={cn('border-none px-4', isPWA && 'pb-[env(safe-area-inset-bottom)]')}
          onChange={(e) => handleTextareaChange(e.target.value)}
          style={{
            height: textareaHeight,
          }}
        />
      </div>

      {isKeyboardVisible && (
        <div className="flex justify-between bg-base-1 items-center px-4 h-[40px] border-t border-divider fixed bottom-0 w-full max-w-xl">
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
