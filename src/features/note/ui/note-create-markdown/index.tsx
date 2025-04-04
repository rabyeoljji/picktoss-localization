import { KeyboardDetector } from '@/app/keyboard-detector'

import { MarkdownEditor } from '@/features/editor/ui/markdown-editor'
import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

import { CreateNoteDrawer } from '../create-note-drawer'

export const NoteCreateMarkdown = () => {
  const { content, setContent, isKeyboardVisible, setIsKeyboardVisible, checkButtonActivate } = useCreateNoteContext()

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
          isKeyboardVisible={isKeyboardVisible}
        />
      </div>

      {isKeyboardVisible && (
        <div className="flex justify-between items-center px-4 h-[40px] border-t border-divider">
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
      )}

      {!isKeyboardVisible &&
        (checkButtonActivate() ? (
          <div className="pt-3 flex h-[96px] items-start pl-[19px] pr-4 border-t border-divider">
            <div className="flex items-center gap-2 w-full">
              <div className="shrink-0">
                <Text typo="body-2-medium" color="sub">
                  현재 별 1,673개
                </Text>
                <Text typo="subtitle-2-bold" color="primary">
                  23,432자
                </Text>
              </div>
              <div className="flex-1">
                <CreateNoteDrawer />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start pt-2.5 px-4 border-t border-divider h-[96px]">
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
        ))}
    </>
  )
}
