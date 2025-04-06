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
  const { isKeyboardVisible } = useKeyboard()
  const [textareaHeight, setTextareaHeight] = useState(300)

  const handleTextareaChange = (content: string) => {
    setContent(content)
  }

  useEffect(() => {
    const updateHeight = () => {
      // visualViewport가 존재하면 현재 클라이언트 높이(키보드 반영된)를 사용
      const newHeight = window.visualViewport
        ? window.visualViewport.height
        : textareaWrapperRef.current?.offsetHeight || 300
      setTextareaHeight(newHeight)
      // 항상 스크롤을 최상위로
      window.scrollTo(0, 0)
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
  }, [])

  return (
    <>
      <div className="flex-1" ref={textareaWrapperRef}>
        <Textarea
          placeholder="여기를 탭하여 입력을 시작하세요"
          className="border-none px-4"
          onChange={(e) => handleTextareaChange(e.target.value)}
          style={{
            // visualViewport에 따른 높이 사용 (추가 오프셋이 필요하면 여기서 조절 가능)
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
    </>
  )
}
