import { useKeyboard } from '@/app/keyboard-detector'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { CreateNoteProvider, DocumentType, useCreateNoteContext } from '@/features/note/model/create-note-context'
import { CreateNoteDrawer } from '@/features/note/ui/create-note-drawer'
import { DirectorySelector } from '@/features/note/ui/directory-selector'
import { EmojiTitleInput } from '@/features/note/ui/emoji-title-input'
import NoteCreatePageFile from '@/features/note/ui/note-create-page-file'
import { NoteCreateWrite } from '@/features/note/ui/note-create-write'

import { useGetAllDirectories } from '@/entities/directory/api/hooks'

import { IcInfo } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

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
  const { documentType, setDocumentType, content, checkButtonActivate } = useCreateNoteContext()
  const { isKeyboardVisible } = useKeyboard()

  return (
    <div className="flex flex-col relative bg-base-1 h-[calc(100%+1px)]">
      <EmojiTitleInput />
      <div className="h-[56px] px-4 py-2 w-full border-b border-divider">
        <Tabs value={documentType} onValueChange={(documentType) => setDocumentType(documentType as DocumentType)}>
          <TabsList>
            <TabsTrigger value="FILE">파일 첨부</TabsTrigger>
            <TabsTrigger value="TEXT">텍스트 작성</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {documentType === 'TEXT' && <NoteCreateWrite />}
      {documentType === 'FILE' && <NoteCreatePageFile />}

      {!isKeyboardVisible && (
        <div
          className={`fixed bottom-0 w-full bg-base-1 h-[96px] border-t border-divider ${
            checkButtonActivate() ? 'pt-3 pl-[19px] pr-4' : 'flex justify-between items-start pt-2.5 px-4 w-full'
          }`}
        >
          {checkButtonActivate() ? (
            <div className="flex items-center gap-2 w-full">
              <div className="shrink-0">
                <Text typo="body-2-medium" color="sub">
                  현재 별 1,673개
                </Text>
                <Text typo="subtitle-2-bold" color="primary">
                  23,432자
                </Text>
              </div>
              <div className="flex-1">
                <CreateNoteDrawer />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <IcInfo className="size-4 text-icon-sub" />
                <Text typo="body-1-regular" color="caption">
                  최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
                </Text>
              </div>
              <Text typo="body-1-medium" color="secondary">
                <span
                  className={cn(
                    content.length < DOCUMENT_CONSTRAINTS.CONTENT.MIN ||
                      content.length > DOCUMENT_CONSTRAINTS.CONTENT.MAX
                      ? 'text-critical'
                      : 'text-success',
                  )}
                >
                  {content.length}
                </span>{' '}
                / {DOCUMENT_CONSTRAINTS.CONTENT.MAX}
              </Text>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// export default withHOC(NoteCreatePage, {
//   backgroundColor: 'bg-surface-1',
// })

export default NoteCreatePage
