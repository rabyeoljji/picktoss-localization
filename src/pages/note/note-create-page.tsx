import { useEffect, useRef, useState } from 'react'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { toast } from 'sonner'

import { NoteCreateMarkdownForm } from '@/widget/note-create-markdown-form'

import { IcFile, IcWrite } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const NoteCreatePage = () => {
  const router = useRouter()

  const [method, setMethod] = useState<'markdown' | 'file' | null>(null)
  const [formValid, setFormValid] = useState(false)
  const [formPending, setFormPending] = useState(false)
  const [emoji, setEmoji] = useState('📝')
  const [title, setTitle] = useState('')

  // 폼 상태 관리 핸들러
  const handleFormStateChange = (isValid: boolean, isPending: boolean) => {
    setFormValid(isValid)
    setFormPending(isPending)
  }

  const onSuccess = (id: number) => {
    toast('문서가 생성되었습니다.')
    router.replace('/note/:noteId', {
      params: [id.toString()],
    })
  }
  const onError = () => {}

  // 디렉토리 ID는 실제로는 선택된 값을 사용해야 하지만, 현재는 하드코딩
  const directoryId = '10'

  return (
    <div
      className="min-h-screen max-w-xl mx-auto bg-surface-1 relative"
      style={{ height: 'var(--viewport-height, 100vh)' }}
    >
      <Header
        className="fixed max-w-xl top-0 w-full z-50"
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

      {!method && <SelectMethod setMethod={setMethod} />}

      <div className="pt-[var(--header-height)]">
        <EmojiTitleInput title={title} setTitle={setTitle} emoji={emoji} setEmoji={setEmoji} />

        {method === 'markdown' && (
          <>
            <NoteCreateMarkdownForm
              directoryId={directoryId}
              onFormStateChange={handleFormStateChange}
              title={title}
              onSuccess={onSuccess}
              onError={onError}
            />
          </>
        )}
        {method === 'file' && <NoteCreatePageFile />}
      </div>
    </div>
  )
}

export default NoteCreatePage

const EmojiTitleInput = ({
  emoji,
  setEmoji,
  title,
  setTitle,
}: {
  emoji: string
  setEmoji: (emoji: string) => void
  title: string
  setTitle: (title: string) => void
}) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="p-4 pt-6 flex items-center gap-3 border-b border-divider">
      <div className="relative" ref={emojiPickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="typo-h4 flex-center size-[40px] px-[10px] py-2 rounded-[6px] border border-outline bg-base-2"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <div className="absolute z-10 top-full left-0 mt-1">
            <EmojiPicker onEmojiClick={(data) => setEmoji(data.emoji)} theme={Theme.LIGHT} width={300} height={400} />
          </div>
        )}
      </div>

      <div className="flex-1">
        <Input
          className="typo-body-1-medium border-none text-base-9 placeholder:text-base-9/60 h-auto px-0 py-1 focus-visible:ring-0"
          placeholder="제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    </div>
  )
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

const NoteCreatePageFile = () => {
  return <div></div>
}
