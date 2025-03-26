import { CreateNoteProvider, useCreateNoteContext } from '@/features/note/model/create-note-context'
import { CreateNoteDrawer } from '@/features/note/ui/create-note-drawer'
import { DirectorySelector } from '@/features/note/ui/directory-selector'
import { EmojiTitleInput } from '@/features/note/ui/emoji-title-input'
import { NoteCreateMarkdown } from '@/features/note/ui/note-create-markdown'
import { SelectDocumentType } from '@/features/note/ui/select-document-type'

import { useGetAllDirectories } from '@/entities/directory/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'

const NoteCreatePage = () => {
  const { data: directories, isLoading: isDirectoryLoading } = useGetAllDirectories()

  if (!directories || isDirectoryLoading) {
    return <div className="center">Loading...</div>
  }

  return (
    <CreateNoteProvider directories={directories}>
      <div
        className="min-h-screen max-w-xl mx-auto bg-surface-1 relative"
        style={{ height: 'var(--viewport-height, 100vh)' }}
      >
        <Header
          className="fixed max-w-xl top-0 w-full z-50"
          left={<BackButton type="close" />}
          content={
            <>
              <DirectorySelector />
              <div className="ml-auto w-fit">
                <CreateNoteDrawer />
              </div>
            </>
          }
        />
        <NoteCreateContent />
      </div>
    </CreateNoteProvider>
  )
}

export const NoteCreateContent = () => {
  const { documentType } = useCreateNoteContext()
  return (
    <div>
      {!documentType && <SelectDocumentType />}

      <div className="pt-[var(--header-height)]">
        <EmojiTitleInput />

        {documentType === 'TEXT' && <NoteCreateMarkdown />}
        {documentType === 'FILE' && <NoteCreatePageFile />}
      </div>
    </div>
  )
}

// TODO: widget 으로 분리해서 구현
const NoteCreatePageFile = () => {
  return <div></div>
}

export default NoteCreatePage
