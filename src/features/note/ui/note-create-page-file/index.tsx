import { useState } from 'react'

import { marked } from 'marked'
import styled from 'styled-components'

import { formatFileSize } from '@/features/note/lib'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'

import { useUser } from '@/entities/member/api/hooks'

import { IcChange, IcFile, IcNote } from '@/shared/assets/icon'
import { ImgStar } from '@/shared/assets/images'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useTranslation } from '@/shared/locales/use-translation'

const NoteCreatePageFile = () => {
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()

  const { content, fileInfo, changeFileInfo, isProcessing, star, handleCreateDocument } = useCreateNoteContext()
  const { data: user } = useUser()

  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const { files } = e.dataTransfer
    if (!files || !files.length) return

    // React.ChangeEvent<HTMLInputElement> 형태로 캐스팅
    const syntheticEvent = {
      target: { files },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    changeFileInfo(syntheticEvent)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // drop 가능하게
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  if (!fileInfo) {
    return (
      <div
        className="flex-1 flex-center pb-[96px]"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
            {t('createQuiz.note_create_page_file.add_file_button')}
          </label>
          <Text typo="body-1-medium" color="caption">
            {t('createQuiz.note_create_page_file.file_format_info')}
          </Text>
        </div>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height))-81px)] flex-center flex-col pb-[96px]">
        {t('createQuiz.note_create_page_file.processing_message')}...
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

      <div className="fixed z-40 h-[64px] bottom-[129px] flex items-center left-1/2 -translate-x-1/2 w-[90dvw] max-w-[430px] px-[12px] rounded-[16px] bg-base-1 gap-[12px] shadow-[var(--shadow-md)]">
        <div className="flex-center size-[48px] rounded-[12px] bg-inverse text-icon-inverse flex-center">
          <IcNote className="size-[24px]" />
        </div>

        <div className="flex flex-col w-[calc(100%-168px)]">
          <Text typo="body-1-bold" color="secondary" className="w-full truncate">
            {fileInfo?.name}
          </Text>
          <Text typo="body-2-medium" color="sub">
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
          className="cursor-pointer ml-auto relative gap-0.5 inline-flex items-center rounded-full justify-center border border-gray-100 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 h-[28px] w-fit px-[8px] disabled:pointer-events-none shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200"
        >
          <IcChange className="size-[16px]" />
          <Text typo="button-5">{t('createQuiz.note_create_page_file.change_button')}</Text>
        </label>
      </div>

      <FixedBottom className="border-t border-divider pb-[32px]">
        <div className="flex items-center gap-2 w-full">
          <div className="shrink-0">
            <Text typo="body-2-medium" color="sub">
              {t('createQuiz.note_create_page.available_stars')}
            </Text>
            <Text typo="body-1-medium" color="primary">
              {user?.star.toLocaleString('ko-kr')}
              {t('createQuiz.note_create_page.stars_unit')}
            </Text>
          </div>
          <div className="flex-1">
            <Button
              variant="special"
              right={
                <div className="flex-center size-[fit] rounded-full bg-[#D3DCE4]/[0.2] px-[8px]">
                  <ImgStar className="size-[16px] mr-[4px]" />
                  <Text typo="body-1-medium">{star}</Text>
                </div>
              }
              onClick={() => {
                handleCreateDocument({
                  onSuccess: () => {},
                })
                trackEvent('generate_quiz_click', {
                  format: '파일',
                  type: '전체',
                })
              }}
            >
              {t('common.generate')}
            </Button>
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
