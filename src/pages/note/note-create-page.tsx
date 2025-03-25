import { useState } from 'react'

import { NoteCreateMarkdownForm } from '@/widget/note-create-markdown-form'

import { IcFile, IcWrite } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'

const NoteCreatePage = () => {
  const [method, setMethod] = useState<'markdown' | 'file' | null>(null)
  const [formValid, setFormValid] = useState(false)
  const [formPending, setFormPending] = useState(false)

  // 폼 상태 관리 핸들러
  const handleFormStateChange = (isValid: boolean, isPending: boolean) => {
    setFormValid(isValid)
    setFormPending(isPending)
  }

  // 디렉토리 ID는 실제로는 선택된 값을 사용해야 하지만, 현재는 하드코딩
  const directoryId = '10'

  return (
    <div
      className="min-h-screen max-w-xl mx-auto bg-surface-1 relative"
      style={{ height: 'var(--viewport-height, 100vh)' }}
    >
      {!method && (
        <>
          <Header
            className="sticky top-0 w-full z-50"
            left={<BackButton type="close" />}
            content={<div className="center">전공 공부</div>}
          />
          <SelectMethod setMethod={setMethod} />
        </>
      )}

      {method === 'markdown' && (
        <>
          <Header
            className="sticky top-0 w-full z-50"
            left={<BackButton type="close" />}
            content={
              <>
                <div className="center">전공 공부</div>
                <div className="ml-auto w-fit">
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={!formValid || formPending}
                    onClick={() => {
                      // form submit 트리거를 위한 클릭 이벤트 생성
                      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
                      document.querySelector('form')?.dispatchEvent(submitEvent)
                    }}
                  >
                    {formPending ? '생성 중...' : '만들기'}
                  </Button>
                </div>
              </>
            }
          />
          <NoteCreateMarkdownForm directoryId={directoryId} onFormStateChange={handleFormStateChange} />
        </>
      )}

      {method === 'file' && (
        <>
          <Header
            className="sticky top-0 w-full z-50"
            left={<BackButton type="close" />}
            content={<div className="center">전공 공부</div>}
          />
          <NoteCreatePageFile />
        </>
      )}
    </div>
  )
}

export default NoteCreatePage

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
