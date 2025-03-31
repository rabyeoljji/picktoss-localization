import { Fragment, useState } from 'react'

import { RadioGroup } from '@radix-ui/react-radio-group'

import { useCreateDirectory } from '@/entities/directory/api/hooks'

import { IcAdd, IcCheck, IcChevronDown } from '@/shared/assets/icon'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Input } from '@/shared/components/ui/input'
import { RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'

import { useCreateNoteContext } from '../../model/create-note-context'

export const DirectorySelector = () => {
  const { directories, directoryId, setDirectoryId } = useCreateNoteContext()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newDirectoryName, setNewDirectoryName] = useState('')

  const { mutateAsync: createDirectory, isPending } = useCreateDirectory()
  const DEFAULT_EMOJI = '📝'

  const handleCreateDirectory = async () => {
    const { id } = await createDirectory({ name: newDirectoryName, emoji: DEFAULT_EMOJI })
    setDirectoryId(id)
    setDialogOpen(false)
    setNewDirectoryName('')
  }

  const handleDirectorySelect = (id: string) => {
    const found = directories?.find((d) => String(d.id) === id)
    if (found) {
      setDirectoryId(found.id)
      setDrawerOpen(false)
    }
  }

  const selectedDirectory = directories?.find((d) => d.id === directoryId)

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button className="center py-[5px] px-[12px] line-clamp-1 flex items-center gap-1">
            <Text typo="subtitle-2-medium" color="secondary" className="max-w-[220px]">
              {selectedDirectory?.name}
            </Text>
            <IcChevronDown className="size-4 text-icon-sub" />
          </button>
        </DrawerTrigger>
        <DrawerContent height="lg">
          <DrawerHeader>
            <DrawerTitle>저장할 폴더</DrawerTitle>
          </DrawerHeader>
          <div className="mt-4 flex-1 pb-10 overflow-auto">
            <RadioGroup value={String(selectedDirectory?.id)} onValueChange={handleDirectorySelect}>
              {directories.map((directory) => (
                <Fragment key={directory.id}>
                  <RadioGroupItem value={String(directory.id)} id={`radio-${directory.id}`} className="sr-only" />
                  <label
                    htmlFor={`radio-${directory.id}`}
                    className="py-4 flex items-center justify-between cursor-pointer border-b border-divider"
                  >
                    <Text
                      typo="subtitle-2-medium"
                      color={directory.id === selectedDirectory?.id ? 'accent' : 'primary'}
                    >
                      {directory.name} <span className="text-caption">{directory.documentCount}</span>
                    </Text>
                    {directory.id === selectedDirectory?.id && <IcCheck className="size-6 text-accent" />}
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
