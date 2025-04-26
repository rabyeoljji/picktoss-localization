import { marked } from 'marked'
import styled from 'styled-components'

import { formatFileSize } from '@/features/note/lib'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'
import { CreateNoteDrawer } from '@/features/note/ui/create-note-drawer'

import { IcChange, IcFile, IcNote } from '@/shared/assets/icon'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Text } from '@/shared/components/ui/text'

const NoteCreatePageFile = () => {
  const { content, fileInfo, changeFileInfo, isProcessing } = useCreateNoteContext()

  if (!fileInfo) {
    return (
      <div className="flex-1 flex-center pb-[96px]">
        <div className="flex flex-col gap-[8px]">
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
            className="px-[16px] py-[15px] max-w-[210px] h-[91px] bg-base-2 border-2 border-dashed border-outline flex-center gap-[8px] rounded-[12px] typo-button-2 text-secondary cursor-pointer"
          >
            <IcFile className="size-[20px] text-icon-secondary" />
            파일 추가하기
          </label>
          <Text typo="body-1-medium" color="caption">
            *pdf, txt, docx, 3MB 이상 12MB 미만
          </Text>
        </div>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height))-81px)] flex-center flex-col pb-[96px]">
        파일 처리 중...
      </div>
    )
  }

  return (
    <>
      {content && (
        <FileContentWrapper className="flex-1 text-disabled pb-[100px] overflow-hidden">
          <div
            className="FileContent overflow-auto scrollbar-hide p-[20px]"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </FileContentWrapper>
      )}

      <div className="fixed z-40 bottom-[129px] flex-center left-1/2 -translate-x-1/2 w-[90dvw] max-w-[430px] py-[8px] px-[12px] rounded-[16px] bg-base-1 gap-[16px] shadow-[var(--shadow-md)]">
        <div className="flex-center rounded-[12px] bg-inverse text-icon-inverse p-[16px]">
          <IcNote className="size-[24px]" />
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
          className="cursor-pointer relative inline-flex items-center rounded-full justify-center border border-gray-100 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 typo-button-3 h-[32px] min-w-[60px] px-2.5 py-2 w-fit disabled:pointer-events-none shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200"
        >
          <IcChange className="size-[20px]" />
          <Text typo="button-3" className="px-1">
            변경
          </Text>
        </label>
      </div>

      <FixedBottom className="border-t border-divider pb-[32px]">
        <div className="flex items-center gap-2 w-full">
          <div className="shrink-0">
            <Text typo="body-2-medium" color="sub">
              현재 보유 별
            </Text>
            <Text typo="subtitle-2-bold" color="primary">
              1,673개
            </Text>
          </div>
          <div className="flex-1">
            <CreateNoteDrawer />
          </div>
        </div>
      </FixedBottom>
    </>
  )
}

export default NoteCreatePageFile

/** 문서 내용 스타일링 */
const FileContentWrapper = styled.div`
  .FileContent {
    outline: none !important;
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    overflow-y: auto !important;

    p {
      margin: 0 0 1em 0 !important;
    }

    p:last-child {
      margin-bottom: 0 !important;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: bold;
      margin: 1.2em 0;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1em 0;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: bold;
    }

    h4 {
      font-size: 1.15rem;
      font-weight: bold;
    }

    h3,
    h4,
    ul,
    ol {
      margin: 0.8em 0;
    }

    blockquote {
      margin: 1em 0;
    }
  }
`
