import { useEffect, useRef, useState } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'
import './style.css'

export const NoteCreateWrite = () => {
  const { content, setContent } = useCreateNoteContext()
  const textareaWrapperRef = useRef<HTMLDivElement>(null)
  const { isKeyboardVisible, keyboardHeight } = useKeyboard()
  const [textareaHeight, setTextareaHeight] = useState(300)

  const handleTextareaChange = (content: string) => {
    setContent(content)
  }

  useEffect(() => {
    if (!textareaWrapperRef.current) return

    const textareaWrapperHeight = textareaWrapperRef.current.offsetHeight || 300
    setTextareaHeight(textareaWrapperHeight)
  }, [isKeyboardVisible])

  useEffect(() => {
    const updateHeight = () => {
      if (isKeyboardVisible) {
        setTextareaHeight((textareaWrapperRef.current?.offsetHeight || 300) - keyboardHeight)
      } else {
        setTextareaHeight(textareaWrapperRef.current?.offsetHeight || 300)
      }
    }

    updateHeight()

    // visualViewport가 있으면 해당 이벤트에, 없으면 window resize 이벤트에 등록
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
    } else {
      window.addEventListener('resize', updateHeight)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
      } else {
        window.removeEventListener('resize', updateHeight)
      }
    }
  }, [isKeyboardVisible, keyboardHeight, textareaHeight])

  return (
    <>
      <div className="flex-1" ref={textareaWrapperRef}>
        <Textarea
          placeholder="여기를 탭하여 입력을 시작하세요"
          className="border-none px-4"
          onChange={(e) => handleTextareaChange(e.target.value)}
          style={{
            height: textareaHeight - (isKeyboardVisible ? 40 : 96),
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
    </>
  )
}
