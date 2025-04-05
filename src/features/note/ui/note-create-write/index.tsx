import { KeyboardDetector } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'
import './style.css'

export const NoteCreateWrite = () => {
  const { content, setContent, isKeyboardVisible, setIsKeyboardVisible } = useCreateNoteContext()

  const handleEditorChange = (content: string) => {
    setContent(content)
  }

  return (
    <>
      <KeyboardDetector onKeyboardVisibilityChange={setIsKeyboardVisible} />
      <div
        contentEditable
        data-placeholder="여기를 탭하여 입력을 시작하세요"
        className={cn(
          'editable px-4 border-none pt-5 focus:outline-none',
          isKeyboardVisible ? 'pb-[40px]' : 'pb-[96px]',
        )}
        onInput={(e) => handleEditorChange((e.target as HTMLDivElement).textContent || '')}
        style={{ minHeight: 300 }}
      />

      {isKeyboardVisible && (
        <div className="flex justify-between bg-base-1 items-center px-4 h-[40px] border-t border-divider fixed bottom-0 w-full">
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
