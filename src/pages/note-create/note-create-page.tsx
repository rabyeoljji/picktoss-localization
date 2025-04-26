import { withHOC } from '@/app/hoc/with-page-config'
import { useKeyboard } from '@/app/keyboard-detector'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { CreateNoteProvider, DocumentType, useCreateNoteContext } from '@/features/note/model/create-note-context'
import { CreateNoteDrawer } from '@/features/note/ui/create-note-drawer'
import { EmojiTitleInput } from '@/features/note/ui/emoji-title-input'
import NoteCreatePageFile from '@/features/note/ui/note-create-page-file'
import { NoteCreateWrite } from '@/features/note/ui/note-create-write'

import { IcInfo } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

const NoteCreatePage = () => {
  return (
    <CreateNoteProvider>
      <div className="h-full max-w-xl mx-auto relative">
        <NoteCreateHeader />

        <HeaderOffsetLayout className="h-full">
          <NoteCreateContent />
        </HeaderOffsetLayout>
      </div>
    </CreateNoteProvider>
  )
}

const NoteCreateHeader = () => {
  const { documentType, setDocumentType } = useCreateNoteContext()

  return (
    <Header
      className="z-50 px-2 py-[7px]"
      left={<BackButton type="close" />}
      content={
        <div className="center">
          <Tabs value={documentType} onValueChange={(documentType) => setDocumentType(documentType as DocumentType)}>
            <TabsList className="w-[210px]">
              <TabsTrigger value="FILE">파일 첨부</TabsTrigger>
              <TabsTrigger value="TEXT">텍스트 작성</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      }
    />
  )
}

const NoteCreateContent = () => {
  const { documentType, content, checkDrawerTriggerActivate } = useCreateNoteContext()
  const { isKeyboardVisible } = useKeyboard()

  return (
    <div className="flex flex-col relative bg-base-1 h-full">
      <div className="border-b border-divider">
        <EmojiTitleInput />
      </div>

      {documentType === 'TEXT' && <NoteCreateWrite />}
      {documentType === 'FILE' && <NoteCreatePageFile />}

      {documentType === 'TEXT' && !isKeyboardVisible && (
        <div
          className={`fixed bottom-0 w-full max-w-xl bg-base-1 h-[96px] border-t border-divider ${
            checkDrawerTriggerActivate() ? 'pt-3 pl-[19px] pr-4' : 'flex justify-between items-start pt-2.5 px-4 w-full'
          }`}
        >
          {checkDrawerTriggerActivate() ? (
            <div className="flex items-center gap-2 w-full">
              <div className="shrink-0">
                <Text typo="body-2-medium" color="sub">
                  사용 가능 별
                </Text>
                <Text typo="subtitle-2-bold" color="primary">
                  1,123개
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

export default withHOC(NoteCreatePage, {
  backgroundClassName: 'bg-surface-1',
})
