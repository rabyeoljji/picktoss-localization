import { useEffect } from 'react'

import { KeyboardDetector } from '@/app/keyboard-detector'

import { MarkdownEditor } from '@/features/editor'
import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { IcChange, IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

const NoteCreatePageFile = () => {
  const {
    setDocumentName,
    content,
    setContent,
    isKeyboardVisible,
    setIsKeyboardVisible,
    fileInfo,
    changeFileInfo,
    isProcessing,
  } = useCreateNoteContext()

  useEffect(() => {
    if (fileInfo) {
      setDocumentName(fileInfo.name)
      setContent({ markdown: fileInfo.content, textLength: fileInfo.charCount })
    } else {
      setDocumentName('')
      setContent({ markdown: '', textLength: 0 })
    }
  }, [fileInfo])

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (markdown: string) => {
    setContent({
      markdown,
      textLength: markdown.length,
    })
  }

  if (isProcessing) {
    return (
      <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height))-81px)] flex-center flex-col">
        파일 처리 중...
      </div>
    )
  }

  return (
    <>
      <KeyboardDetector onKeyboardVisibilityChange={setIsKeyboardVisible} />
      {content.markdown && (
        <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height))-81px)] flex flex-col">
          {/* h-screen - header-height - emoji-title-input-height */}
          <div className="flex-1 overflow-auto">
            <MarkdownEditor
              className="flex-1"
              onChange={handleEditorChange}
              placeholder="여기를 탭하여 입력을 시작하세요"
              initialMarkdown={fileInfo?.content}
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
        </div>
      )}

      <div className="fixed z-40 bottom-[64px] left-1/2 -translate-x-1/2 size-fit">
        <input
          type="file"
          name="uploadFileInput"
          id="uploadFileInput"
          accept=".pdf, .docx, .txt, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
          onChange={changeFileInfo}
          className="hidden"
        />
        <label
          htmlFor="uploadFileInput"
          className="cursor-pointer block shadow-[var(--shadow-md)] relative inline-flex items-center rounded-full cursor-pointer justify-center border border-gray-100 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 typo-button-3 h-[44px] w-fit px-4 py-3.5 disabled:pointer-events-none shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200"
        >
          <IcChange className="size-[20px]" />
          <Text typo="button-3" className="px-1">
            파일 올리기
          </Text>
        </label>
      </div>
    </>
  )
}

export default NoteCreatePageFile
