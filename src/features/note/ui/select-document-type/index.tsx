import { IcFile, IcWrite } from '@/shared/assets/icon'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'

import { useCreateNoteContext } from '../../model/create-note-context'

export const SelectDocumentType = () => {
  const { setDocumentType, changeFileInfo } = useCreateNoteContext()

  return (
    <div className="flex-center h-[calc(var(--viewport-height,100vh)-(var(--header-height)))]">
      <div className="grid gap-[10px] w-full">
        <SquareButton
          variant="secondary"
          size="lg"
          left={<IcWrite />}
          className="w-[180px] mx-auto"
          onClick={() => setDocumentType('TEXT')}
        >
          직접 작성하기
        </SquareButton>

        <div className="mx-auto text-center">
          <input
            type="file"
            name="uploadFileInput"
            id="uploadFileInput"
            accept=".pdf, .docx, .txt, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
            onChange={(e) => {
              changeFileInfo(e)
              setDocumentType('FILE')
            }}
            className="hidden"
          />
          <label
            htmlFor="uploadFileInput"
            className="block w-[180px] relative inline-flex items-center cursor-pointer justify-center typo-button-2 h-[48px] rounded-[12px] text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 shrink-0 outline-none disabled:bg-gray-100 disabled:text-gray-200 disabled:pointer-events-none"
          >
            <IcFile className="size-5" />
            <Text typo="button-2" className="px-2">
              파일 올리기
            </Text>
          </label>
          <Text typo="body-1-medium" color="caption" className="mt-2">
            *pdf, txt, docx, 3MB 이상 12MB 미만
          </Text>
        </div>
      </div>
    </div>
  )
}
