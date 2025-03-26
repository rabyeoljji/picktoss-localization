import { useEffect } from 'react'

import { MarkdownEditor } from '@/features/editor/ui/markdown-editor'
import { MAX_LENGTH, MIN_LENGTH, useCreateNoteContext } from '@/features/note/model/create-note-context'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

export const NoteCreateMarkdown = () => {
  const { content, setContent, isKeyboardVisible, setIsKeyboardVisible } = useCreateNoteContext()

  // 키보드 감지 로직
  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔는지 감지 및 CSS 변수 설정
      const isKeyboard = visualViewport.height < window.innerHeight * 0.8
      setIsKeyboardVisible(isKeyboard)

      // 높이 변수 설정 (필요한 경우)
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
  }, [setIsKeyboardVisible])

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (markdown: string) => {
    setContent({
      markdown,
      textLength: markdown.length,
    })
  }

  return (
    <>
      {/* h-screen - header-height - emoji-title-input-height */}
      <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height))-81px)] flex flex-col">
        <div className="flex-1 overflow-auto">
          <MarkdownEditor
            className="flex-1"
            onChange={handleEditorChange}
            placeholder="여기를 탭하여 입력을 시작하세요"
            initialMarkdown={content.markdown}
          />
        </div>

        <div
          className={cn(
            'flex justify-between items-center pt-2 pb-8 px-4 border-t border-divider',
            isKeyboardVisible && 'pb-2',
          )}
        >
          <div className="flex items-center gap-1">
            <IcInfo className="size-4 text-icon-sub" />
            <Text typo="body-1-regular" color="caption">
              최소 {MIN_LENGTH}자 이상 입력해주세요
            </Text>
          </div>
          <Text typo="body-1-medium" color="secondary">
            <span className={cn(content.textLength < MIN_LENGTH ? 'text-critical' : 'text-success')}>
              {content.textLength}
            </span>{' '}
            / {MAX_LENGTH}
          </Text>
        </div>
      </div>
    </>
  )
}
