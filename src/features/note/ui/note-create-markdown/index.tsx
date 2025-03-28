import { KeyboardDetector } from '@/app/keyboard-detector'

import { MarkdownEditor } from '@/features/editor/ui/markdown-editor'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'
import { DOCUMENT_CONSTRAINTS } from '@/features/note/model/schema'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

export const NoteCreateMarkdown = () => {
  const { content, setContent, isKeyboardVisible, setIsKeyboardVisible } = useCreateNoteContext()

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (markdown: string) => {
    setContent({
      markdown,
      textLength: markdown.length,
    })
  }

  return (
    <>
      <KeyboardDetector onKeyboardVisibilityChange={setIsKeyboardVisible} />
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
            최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
          </Text>
        </div>
        <Text typo="body-1-medium" color="secondary">
          <span
            className={cn(
              content.textLength < DOCUMENT_CONSTRAINTS.CONTENT.MIN ||
                content.textLength > DOCUMENT_CONSTRAINTS.CONTENT.MAX
                ? 'text-critical'
                : 'text-success',
            )}
          >
            {content.textLength}
          </span>{' '}
          / {DOCUMENT_CONSTRAINTS.CONTENT.MAX}
        </Text>
      </div>
    </>
  )
}
