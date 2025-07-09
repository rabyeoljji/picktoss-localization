import { useEffect, useRef, useState } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcCopy, IcInfo } from '@/shared/assets/icon'
import { Button } from '@/shared/components/ui/button'
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

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [canPaste, setCanPaste] = useState(false)

  const handlePointerDown = async () => {
    if (!navigator.clipboard) return
    try {
      const text = await navigator.clipboard.readText() // 동기(=제스처) 컨텍스트 유지
      setCanPaste(!!text)
    } catch {
      setCanPaste(false)
    }
  }

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handlePasteClick = async () => {
    if (!textAreaRef.current) return
    const text = await navigator.clipboard.readText()
    textAreaRef.current.value = text
    setContent(text)
  }

  const handleTextareaChange = (content: string) => {
    setContent(content)
  }

  // 텍스트 에리아 높이를 계산 (고정영역 높이 고려)
  useEffect(() => {
    const updateHeight = () => {
      const availableHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight
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
      <Textarea
        ref={textAreaRef}
        placeholder="여기를 탭하여 입력을 시작하세요"
        className={cn('border-none px-4', isPWA && 'pb-[env(safe-area-inset-top)]')}
        onChange={(e) => handleTextareaChange(e.target.value)}
        style={{
          height: textareaHeight,
        }}
      />
      {canPaste && content.length === 0 && (
        <Button
          variant="secondary2"
          size="sm"
          left={<IcCopy />}
          onClick={handlePasteClick}
          className="absolute left-[16px] top-[77px]"
        >
          복사한 텍스트 붙여넣기
        </Button>
      )}

      {isKeyboardVisible && (
        <div className="flex justify-between bg-base-1 items-center px-4 h-[40px] border-t border-divider absolute bottom-0 w-full max-w-xl">
          <div className="flex items-center gap-1">
            <IcInfo className="size-4 text-icon-sub" />
            <Text typo="body-1-medium" color="caption">
              최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
            </Text>
          </div>
          <Text typo="body-1-medium" color="sub">
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
