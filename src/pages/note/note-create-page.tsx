import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { CreateNoteProvider, DocumentType, useCreateNoteContext } from '@/features/note/model/create-note-context'
import { DirectorySelector } from '@/features/note/ui/directory-selector'
import { EmojiTitleInput } from '@/features/note/ui/emoji-title-input'
import { NoteCreateMarkdown } from '@/features/note/ui/note-create-markdown'
import NoteCreatePageFile from '@/features/note/ui/note-create-page-file'

import { useGetAllDirectories } from '@/entities/directory/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

const NoteCreatePage = () => {
  const { data: directories, isLoading: isDirectoryLoading } = useGetAllDirectories()

  if (!directories || isDirectoryLoading) {
    return <div className="center">Loading...</div>
  }

  return (
    <CreateNoteProvider directories={directories}>
      <div className="h-full max-w-xl mx-auto relative">
        <Header className="z-50" left={<BackButton type="close" />} content={<DirectorySelector />} />

        <HeaderOffsetLayout className="h-full">
          <NoteCreateContent />
        </HeaderOffsetLayout>
      </div>
    </CreateNoteProvider>
  )
}

const NoteCreateContent = () => {
  const { documentType, setDocumentType } = useCreateNoteContext()

  return (
    <div className="h-[calc(var(--viewport-height,100vh)_-_(var(--header-height-safe)))] flex flex-col">
      <EmojiTitleInput />
      <div className="h-[56px] px-4 py-2 w-full border-b border-divider">
        <Tabs value={documentType} onValueChange={(documentType) => setDocumentType(documentType as DocumentType)}>
          <TabsList>
            <TabsTrigger value="FILE">파일 첨부</TabsTrigger>
            <TabsTrigger value="TEXT">텍스트 작성</TabsTrigger>
          </TabsList>
          <TabsContent value="FILE"></TabsContent>
          <TabsContent value="TEXT"></TabsContent>
        </Tabs>
      </div>

      {documentType === 'TEXT' && <NoteCreateMarkdown />}
      {documentType === 'FILE' && <NoteCreatePageFile />}
    </div>
  )
}

export default withHOC(NoteCreatePage, {
  backgroundColor: 'bg-surface-1',
})
