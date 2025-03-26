import { Fragment, useEffect, useRef, useState } from 'react'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { toast } from 'sonner'

import { NoteCreateMarkdownForm } from '@/widget/note-create-markdown-form'

import { GetAllDirectoriesResponse } from '@/entities/directory/api'
import { useCreateDirectory, useGetAllDirectories } from '@/entities/directory/api/hooks'

import { IcAdd, IcCheck, IcChevronDown, IcFile, IcWrite } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Input } from '@/shared/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useRouter } from '@/shared/lib/router'

const NoteCreatePage = () => {
  const router = useRouter()

  const [method, setMethod] = useState<'markdown' | 'file' | null>(null)
  const [formValid, setFormValid] = useState(false)
  const [formPending, setFormPending] = useState(false)
  const [emoji, setEmoji] = useState('📝')
  const [title, setTitle] = useState('')
  const [selectedDirectory, setSelectedDirectory] = useState<GetAllDirectoriesResponse['directories'][number] | null>(
    null,
  )

  // 폼 상태 관리 핸들러
  const handleFormStateChange = (isValid: boolean, isPending: boolean) => {
    setFormValid(isValid && title.trim() !== '' && emoji !== '')
    setFormPending(isPending)
  }

  const onSuccess = (id: number) => {
    toast('문서가 생성되었습니다.')
    router.replace('/note/:noteId', {
      params: [id.toString()],
    })
  }
  const onError = () => {}

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
            <DirectorySelector selectedDirectory={selectedDirectory} setSelectedDirectory={setSelectedDirectory} />
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
              directoryId={String(selectedDirectory?.id)}
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
          <div className="absolute top-full bg-base-1 z-40 left-0 mt-1">
            <EmojiPicker
              onEmojiClick={(data) => {
                setEmoji(data.emoji)
                setShowEmojiPicker(false)
              }}
              theme={Theme.LIGHT}
              width={300}
              height={400}
            />
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

const DirectorySelector = ({
  selectedDirectory,
  setSelectedDirectory,
}: {
  selectedDirectory: GetAllDirectoriesResponse['directories'][number] | null
  setSelectedDirectory: (directory: GetAllDirectoriesResponse['directories'][number]) => void
}) => {
  const { data: directories } = useGetAllDirectories()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newDirectoryName, setNewDirectoryName] = useState('')

  const { mutateAsync: createDirectory, isPending } = useCreateDirectory()
  const DEFAULT_EMOJI = '📝'

  useEffect(() => {
    if (directories && !selectedDirectory) {
      setSelectedDirectory(directories[0])
    }
  }, [directories, selectedDirectory, setSelectedDirectory])

  const handleCreateDirectory = async () => {
    const { id } = await createDirectory({ name: newDirectoryName, emoji: DEFAULT_EMOJI })
    setSelectedDirectory({ id, name: newDirectoryName, emoji: DEFAULT_EMOJI, tag: 'DEFAULT', documentCount: 0 })
    setDialogOpen(false)
    setNewDirectoryName('')
  }

  const handleDirectorySelect = (id: string) => {
    const found = directories?.find((d) => String(d.id) === id)
    if (found) {
      setSelectedDirectory(found)
      setDrawerOpen(false)
    }
  }

  if (!directories || !selectedDirectory) return null

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button className="center py-[5px] px-[12px] line-clamp-1 flex items-center gap-1">
            <Text typo="subtitle-2-medium" color="secondary" className="max-w-[220px]">
              {selectedDirectory.name}
            </Text>
            <IcChevronDown className="size-4 text-icon-sub" />
          </button>
        </DrawerTrigger>
        <DrawerContent height="lg">
          <DrawerHeader>
            <DrawerTitle>저장할 폴더</DrawerTitle>
          </DrawerHeader>
          <div className="mt-4 flex-1 pb-10 overflow-auto">
            <RadioGroup value={String(selectedDirectory.id)} onValueChange={handleDirectorySelect}>
              {directories.map((directory) => (
                <Fragment key={directory.id}>
                  <RadioGroupItem value={String(directory.id)} id={`radio-${directory.id}`} className="sr-only" />
                  <label
                    htmlFor={`radio-${directory.id}`}
                    className="py-4 flex items-center justify-between cursor-pointer border-b border-divider"
                  >
                    <Text typo="subtitle-2-medium" color={directory.id === selectedDirectory.id ? 'accent' : 'primary'}>
                      {directory.name} <span className="text-caption">{directory.documentCount}</span>
                    </Text>
                    {directory.id === selectedDirectory.id && <IcCheck className="size-6 text-accent" />}
                  </label>
                </Fragment>
              ))}
            </RadioGroup>
            <TextButton
              variant="sub"
              size="lg"
              left={<IcAdd />}
              onClick={() => {
                setDrawerOpen(false)
                setDialogOpen(true)
              }}
              className="w-full justify-start pt-4"
            >
              새 폴더 추가
            </TextButton>
          </div>
        </DrawerContent>
      </Drawer>

      <SystemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="새 폴더 만들기"
        description="추가할 폴더 이름을 입력해주세요"
        preventClose={isPending}
        content={
          <>
            {isPending ? (
              <div className="animate-pulse text-center">Loading...</div>
            ) : (
              <Input
                value={newDirectoryName}
                onChange={(e) => setNewDirectoryName(e.target.value)}
                placeholder="새로운 폴더"
                hasClear
                onClearClick={() => setNewDirectoryName('')}
              />
            )}
          </>
        }
        onConfirm={handleCreateDirectory}
      />
    </>
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
