import { useEffect } from 'react'

import { KeyboardDetector } from '@/app/keyboard-detector'

import { MarkdownEditor } from '@/features/editor'
import { formatFileSize } from '@/features/note/lib'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { IcChange, IcFile } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'

const NoteCreatePageFile = () => {
  const { setDocumentName, content, setContent, setIsKeyboardVisible, fileInfo, changeFileInfo, isProcessing } =
    useCreateNoteContext()

  const removeFileExtension = (filename: string) => {
    const lastDotIndex = filename.lastIndexOf('.')
    return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename
  }

  useEffect(() => {
    if (fileInfo) {
      setDocumentName(removeFileExtension(fileInfo.name))
    } else {
      setDocumentName('')
    }
  }, [fileInfo])

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (markdown: string) => {}

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
      {content && (
        <div className="flex-1 overflow-auto scrollbar-hide text-disabled">
          <MarkdownEditor
            className="flex-1"
            onChange={handleEditorChange}
            placeholder="여기를 탭하여 입력을 시작하세요"
            initialMarkdown={fileInfo?.content}
            editable={false}
          />
        </div>
      )}

      <div className="fixed z-40 bottom-[64px] flex-center shadow-[var(--shadow-md)] left-1/2 -translate-x-1/2 w-[90dvw] max-w-[430px] py-[8px] px-[12px] rounded-[16px] border border-outline bg-base-1 gap-[16px]">
        <div className="flex-center rounded-[12px] bg-inverse text-icon-inverse p-[16px]">
          <IcFile className="size-[24px]" />
        </div>

        <div className="flex flex-col w-[calc(100%-168px)]">
          <Text typo="subtitle-2-bold" color="secondary" className="w-full truncate">
            {fileInfo?.name}
          </Text>
          <Text typo="body-1-medium" color="sub">
            {formatFileSize(fileInfo?.size ?? 0)}
          </Text>
        </div>

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
          className="cursor-pointer block relative inline-flex items-center rounded-full cursor-pointer justify-center border border-gray-100 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 typo-button-3 h-[32px] min-w-[60px] px-2.5 py-2 w-fit disabled:pointer-events-none shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200"
        >
          <IcChange className="size-[20px]" />
          <Text typo="button-3" className="px-1">
            변경
          </Text>
        </label>
      </div>
    </>
  )
}

export default NoteCreatePageFile
