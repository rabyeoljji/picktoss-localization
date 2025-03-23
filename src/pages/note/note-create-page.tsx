import { useState } from 'react'

import { MarkdownEditor } from '@/features/editor'

import { IcFile, IcWrite } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'

const NoteCreatePage = () => {
  const [method, setMethod] = useState<'markdown' | 'file' | null>(null)
  const [content, setContent] = useState({
    html: '',
    markdown: '',
  })
  console.log(content)

  return (
    <div>
      <Header
        left={<BackButton type="close" />}
        content={
          <div className="ml-auto w-fit">
            <Button variant="primary" size="sm" disabled>
              만들기
            </Button>
          </div>
        }
      />

      {!method && <SelectMethod setMethod={setMethod} />}

      {method === 'markdown' && <NoteCreatePageMarkdown setContent={setContent} />}
      {method === 'file' && <NoteCreatePageFile />}
    </div>
  )
}

export default NoteCreatePage

const NoteCreatePageMarkdown = ({
  setContent,
}: {
  setContent: (content: { html: string; markdown: string }) => void
}) => {
  const handleEditorChange = (html: string, markdown: string) => {
    setContent({ html, markdown })
  }

  return (
    <div className="h-[calc(100vh-(var(--header-height)))] flex flex-col">
      <div className="flex-1 overflow-auto">
        <MarkdownEditor
          onChange={handleEditorChange}
          placeholder="여기를 탭하여 입력을 시작하세요"
          className="h-full"
          maxLength={50000}
          minLength={1000}
        />
      </div>
    </div>
  )
}

const NoteCreatePageFile = () => {
  return <div></div>
}

const SelectMethod = ({ setMethod }: { setMethod: (method: 'markdown' | 'file') => void }) => {
  return (
    <div className="flex-center h-[calc(100vh-(var(--header-height)))]">
      <div className="grid gap-[10px] w-full">
        <SquareButton
          variant="secondary"
          size="lg"
          left={<IcWrite />}
          className="w-[180px] mx-auto"
          onClick={() => setMethod('markdown')}
        >
          직접 작성하기
        </SquareButton>
        <div className="mx-auto">
          <SquareButton
            variant="secondary"
            size="lg"
            left={<IcFile />}
            onClick={() => setMethod('file')}
            className="w-[180px]"
          >
            파일 올리기
          </SquareButton>
          <Text typo="body-1-medium" color="caption" className="mt-2">
            *txt, docx, 3MB 이상 12MB 미만
          </Text>
        </div>
      </div>
    </div>
  )
}
