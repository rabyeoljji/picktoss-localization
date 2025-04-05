import { useEffect, useRef } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'
import './style.css'

export const NoteCreateWrite = () => {
  const { content, setContent } = useCreateNoteContext()
  const editorRef = useRef<HTMLDivElement>(null)
  const { isKeyboardVisible } = useKeyboard()

  const handleEditorChange = (content: string) => {
    setContent(content)
  }

  // 커서 위치에 따른 스크롤 조정
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    // 스크롤 위치 조정 함수
    const adjustScrollIfNeeded = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // 화면 하단에서 커서 위치
      const bottomOffset = window.innerHeight - rect.bottom

      // 하단 영역의 높이 (키보드 표시 여부에 따라 다름)
      const bottomBarHeight = isKeyboardVisible ? 40 : 96

      // 커서가 하단 영역에 가려지는지 확인
      if (bottomOffset < bottomBarHeight + 10) {
        // 10px의 여유 공간 추가
        // 스크롤을 아래로 조정
        window.scrollBy({
          top: bottomBarHeight + 10 - bottomOffset,
          behavior: 'smooth',
        })
      }
    }

    // 입력 이벤트 리스너
    const handleInput = () => {
      // 다음 프레임에서 스크롤 조정 (DOM 업데이트 후)
      requestAnimationFrame(adjustScrollIfNeeded)
    }

    // 클릭 이벤트 리스너
    const handleClick = () => {
      requestAnimationFrame(adjustScrollIfNeeded)
    }

    editor.addEventListener('input', handleInput)
    editor.addEventListener('click', handleClick)

    // MutationObserver로 DOM 변화 감지
    const observer = new MutationObserver(() => {
      requestAnimationFrame(adjustScrollIfNeeded)
    })

    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      editor.removeEventListener('input', handleInput)
      editor.removeEventListener('click', handleClick)
      observer.disconnect()
    }
  }, [isKeyboardVisible])

  return (
    <>
      <div
        ref={editorRef}
        contentEditable
        data-placeholder="여기를 탭하여 입력을 시작하세요"
        className={cn(
          'editable px-4 border-none pt-5 focus:outline-none',
          isKeyboardVisible ? 'pb-[40px]' : 'pb-[96px]',
        )}
        onInput={(e) => handleEditorChange((e.target as HTMLDivElement).textContent || '')}
        style={{
          minHeight: 300,
        }}
      />

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
