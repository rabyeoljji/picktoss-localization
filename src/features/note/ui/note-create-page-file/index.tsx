import { useEffect } from 'react'

import { KeyboardDetector } from '@/app/keyboard-detector'

import { MarkdownEditor } from '@/features/editor'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { IcChange } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'

const NoteCreatePageFile = () => {
  const { setDocumentName, content, setContent, setIsKeyboardVisible, fileInfo, changeFileInfo, isProcessing } =
    useCreateNoteContext()

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
          <div className="flex-1 overflow-auto scrollbar-hide text-disabled">
            <MarkdownEditor
              className="flex-1"
              onChange={handleEditorChange}
              placeholder="여기를 탭하여 입력을 시작하세요"
              initialMarkdown={fileInfo?.content}
              editable={false}
            />
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
            파일 변경
          </Text>
        </label>
      </div>
    </>
  )
}

export default NoteCreatePageFile
