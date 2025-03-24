import { useState, useEffect } from 'react'

import { MarkdownEditor } from '@/features/editor'

import { IcFile, IcInfo, IcWrite } from '@/shared/assets/icon'
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
    textLength: 0,
  })
  console.log(content)

  // PWA 환경에 대응하기 위한 visualViewport 처리
  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔을 때 높이 변화 감지
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${visualViewport.height}px`
      )
    }

    visualViewport.addEventListener('resize', handleViewportChange)
    visualViewport.addEventListener('scroll', handleViewportChange)

    // 초기 실행
    handleViewportChange()

    return () => {
      visualViewport.removeEventListener('resize', handleViewportChange)
      visualViewport.removeEventListener('scroll', handleViewportChange)
    }
  }, [])

  return (
    <div className="min-h-screen max-w-xl mx-auto bg-surface-1 relative" style={{ height: 'var(--viewport-height, 100vh)' }}>
      <Header
        className="sticky top-0 w-full z-50"
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

      {method === 'markdown' && <NoteCreatePageMarkdown content={content} setContent={setContent} />}
      {method === 'file' && <NoteCreatePageFile />}
    </div>
  )
}

export default NoteCreatePage

const NoteCreatePageMarkdown = ({
  content,
  setContent,
}: {
  content: { html: string; markdown: string; textLength: number }
  setContent: (content: { html: string; markdown: string; textLength: number }) => void
}) => {
  const MIN_LENGTH = 1000
  const MAX_LENGTH = 50000

  const handleEditorChange = (html: string, markdown: string) => {
    // html에서 텍스트만 추출하는 함수
    const getTextFromHtml = (html: string) => {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      return tempDiv.textContent || ''
    }

    const textContent = getTextFromHtml(html)
    const textLength = textContent.length

    setContent({ html, markdown, textLength })
  }

  return (
    <div className="h-[calc(var(--viewport-height,100vh)-var(--header-height)-40px)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor
          onChange={handleEditorChange}
          placeholder="여기를 탭하여 입력을 시작하세요"
        />
      </div>
      <div className="w-full flex justify-between items-center h-[40px] px-4 py-[10px] bg-surface-1 border-t border-surface-3 z-10">
        <div className="flex items-center gap-1">
          <IcInfo className="size-4 text-caption" />
          <Text typo="body-2-medium" color="caption">
            최소 {MIN_LENGTH}자 이상 입력해주세요
          </Text>
        </div>
        <div>
          <Text typo="body-2-medium">
            {content.textLength} <span className="text-sub">/ {MAX_LENGTH}</span>
          </Text>
        </div>
      </div>
    </div>
  )
}

const NoteCreatePageFile = () => {
  return <div></div>
}

const SelectMethod = ({ setMethod }: { setMethod: (method: 'markdown' | 'file') => void }) => {
  return (
    <div className="flex-center h-[calc(var(--viewport-height,100vh)-(var(--header-height)))]">
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
