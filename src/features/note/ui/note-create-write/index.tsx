import { KeyboardDetector } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'

export const NoteCreateWrite = () => {
  const { content, setContent, isKeyboardVisible, setIsKeyboardVisible } = useCreateNoteContext()

  const handleEditorChange = (content: string) => {
    setContent(content)
  }

  return (
    <>
      <KeyboardDetector onKeyboardVisibilityChange={setIsKeyboardVisible} />
      <Textarea
        placeholder="여기를 탭하여 입력을 시작하세요"
        className="px-0 border-none bg-red-300 scroll-behavior-none"
        onChange={(e) => handleEditorChange(e.target.value)}
        value={content}
      />

      {isKeyboardVisible && (
        <div className="flex justify-between items-center px-4 h-[40px] border-t border-divider absolute bottom-0 w-full">
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
