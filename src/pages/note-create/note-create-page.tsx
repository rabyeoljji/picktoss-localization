import { useState } from 'react'
import { useLocation } from 'react-router'

import { withHOC } from '@/app/hoc/with-page-config'
import { useKeyboard } from '@/app/keyboard-detector'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { CreateNoteProvider, DocumentType, useCreateNoteContext } from '@/features/note/model/create-note-context'
import NoteCreatePageFile from '@/features/note/ui/note-create-page-file'
import { NoteCreateWrite } from '@/features/note/ui/note-create-write'
import { QuizLoadingDrawer } from '@/features/note/ui/quiz-loading-drawer'

import { useUser } from '@/entities/member/api/hooks'

import { IcInfo } from '@/shared/assets/icon'
import { ImgStar } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { LackingStarDrawer } from '@/shared/components/drawers/lacking-star-drawer'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
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
              <TabsTrigger value="FILE">파일</TabsTrigger>
              <TabsTrigger value="TEXT">텍스트</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      }
    />
  )
}

const NoteCreateContent = () => {
  const { trackEvent } = useAmplitude()
  const { pathname } = useLocation()

  const { star, isPublic, setIsPublic, documentType, content, checkDrawerTriggerActivate, handleCreateDocument } =
    useCreateNoteContext()
  const { isKeyboardVisible } = useKeyboard()
  const { data: user } = useUser()

  const [lackingStarDrawerOpen, setLackingStarDrawerOpen] = useState(false)

  return (
    <div className="flex flex-col relative bg-base-1 h-full">
      {/* 퀴즈 공개 여부 스위치 */}
      <div className="h-[48px] bg-surface-2 flex items-center justify-between px-4 sticky top-[54px]">
        <div className="flex gap-1 items-end">
          <Text typo="body-1-medium" color="secondary">
            퀴즈 공개
          </Text>
          <Text typo="body-2-medium" color="caption">
            {isPublic ? '*다른 사람들도 퀴즈를 풀어볼 수 있어요' : '*이 퀴즈를 나만 볼 수 있어요'}
          </Text>
        </div>
        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
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
                  {user?.star.toLocaleString('ko-kr')}개
                </Text>
              </div>
              <div className="flex-1">
                <Button
                  variant="special"
                  right={
                    <div className="flex-center size-[fit] rounded-full bg-[#D3DCE4]/[0.2] px-[8px]">
                      <ImgStar className="size-[16px] mr-[4px]" />
                      <Text typo="body-1-medium">{star}</Text>
                    </div>
                  }
                  onClick={() => {
                    if (Number(star) > (user?.star ?? 0)) {
                      setLackingStarDrawerOpen(true)
                      return
                    }
                    handleCreateDocument({
                      onSuccess: () => {},
                    })
                    trackEvent('generate_confirm_click', {
                      format: '텍스트',
                      type: '전체',
                    })
                  }}
                >
                  생성하기
                </Button>
              </div>
              <LackingStarDrawer
                open={lackingStarDrawerOpen}
                onOpenChange={setLackingStarDrawerOpen}
                needStars={Number(star)}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <IcInfo className="size-4 text-icon-sub" />
                {content.length < DOCUMENT_CONSTRAINTS.CONTENT.MIN ? (
                  <Text typo="body-1-medium" color="caption">
                    최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
                  </Text>
                ) : (
                  <Text typo="body-1-medium" color="caption">
                    퀴즈를 만들 수 있어요
                  </Text>
                )}
              </div>
              <Text typo="body-1-medium" color="sub">
                <span
                  className={cn(
                    content.length < DOCUMENT_CONSTRAINTS.CONTENT.MIN ||
                      content.length > DOCUMENT_CONSTRAINTS.CONTENT.MAX
                      ? 'text-critical'
                      : 'text-secondary',
                  )}
                >
                  {content.length.toLocaleString('ko-kr')}
                </span>{' '}
                / {DOCUMENT_CONSTRAINTS.CONTENT.MAX.toLocaleString('ko-kr')}
              </Text>
            </>
          )}
        </div>
      )}

      <QuizLoadingDrawer />
    </div>
  )
}

export default withHOC(NoteCreatePage, {
  backgroundClassName: 'bg-surface-1',
})
