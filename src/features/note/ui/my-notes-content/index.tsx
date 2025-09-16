import { useEffect, useMemo, useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { toast } from 'sonner'

import EmptyMyNote from '@/features/note/ui/empty-my-note'
import { MarkdownProcessor, formatQAText, highlightAndTrimText } from '@/features/search/lib'

import { GetAllDocumentsDocumentDto, SearchDocumentsDto } from '@/entities/document/api'
import { useDeleteDocument, useUpdateDocumentIsPublic } from '@/entities/document/api/hooks'
import { useUser } from '@/entities/member/api/hooks'

import { IcArrange, IcCheck, IcDelete, IcUpload } from '@/shared/assets/icon'
import { SlidableNoteCard } from '@/shared/components/cards/slidable-note-card'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { UseCheckListReturn } from '@/shared/hooks/use-check-list'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface Props {
  activeTab: 'MY' | 'BOOKMARK'
  onTabChange: (tab: 'MY' | 'BOOKMARK') => void
  documents?: GetAllDocumentsDocumentDto[] | SearchDocumentsDto[]
  selectMode: boolean
  checkList: UseCheckListReturn<GetAllDocumentsDocumentDto>
  changeSelectMode: (selectMode: boolean) => void
  isEmptyMyDocuments: boolean
  isLoading: boolean
  keyword?: string
}

const MyNotesContent = ({
  activeTab,
  onTabChange,
  documents,
  selectMode,
  checkList,
  changeSelectMode,
  isEmptyMyDocuments,
  isLoading,
  keyword,
}: Props) => {
  type Tab = typeof activeTab

  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()
  const router = useRouter()
  const [sortOption, setSortOption] = useQueryParam('/library', 'sortOption')
  const activeSortOption = sortOption ?? 'CREATED_AT'

  const [openRelease, setOpenRelease] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const { mutate: deleteDocument } = useDeleteDocument()

  const { data: user } = useUser()

  const { check, unCheck, unCheckAll, isChecked, getCheckedIds, getCheckedList } = checkList

  const selectedTotalQuizCount = useMemo(
    () => getCheckedList().reduce((acc, cur) => acc + cur.totalQuizCount, 0),
    [getCheckedList()],
  )

  const isSearchDocType = (doc: GetAllDocumentsDocumentDto | SearchDocumentsDto): doc is SearchDocumentsDto => {
    return (doc as SearchDocumentsDto).isBookmarked !== undefined
  }

  // 공유하기 핸들러
  const handleShare = async (id: number, name: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          url: `${window.location.origin}/quiz-detail/${id}`,
        })
        console.log('공유 성공')
      } catch (error) {
        console.error('공유 실패', error)
      } finally {
        unCheckAll()
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.')
    }
  }

  const handleDelete = (documentIds: number[]) => {
    deleteDocument({ documentIds })
    toast.success(t('library.my_notes_content.delete_success_message'))
  }

  useEffect(() => {
    if (!openDelete && !selectMode) {
      unCheckAll()
    }
  }, [openDelete])

  useEffect(() => {
    if (!openRelease && !selectMode) {
      unCheckAll()
    }
  }, [openRelease])

  return (
    <div className="size-full flex flex-col px-[16px] pt-[16px]">
      {!selectMode && (
        <div className="w-full flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={(tab) => onTabChange(tab as Tab)}>
            <TabsList className="flex gap-[8px]">
              <TabsTrigger
                className="bg-base-3 typo-button-3 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full px-[14px] py-[11px]"
                value={'MY' as Tab}
              >
                {t('library.my_notes_content.created_count')} {user?.totalQuizCount}
              </TabsTrigger>
              <TabsTrigger
                className="bg-base-3 typo-button-3 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full px-[14px] py-[11px]"
                value={'BOOKMARK' as Tab}
              >
                {t('library.my_notes_content.saved_count')} {user?.bookmarkCount}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="size-fit py-[10px] pl-[10px] flex-center cursor-pointer">
              <IcArrange width={20} height={20} className=" text-icon-secondary" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSortOption('CREATED_AT')}
                right={activeSortOption === 'CREATED_AT' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                {t('library.my_notes_content.date_added')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('NAME')}
                right={activeSortOption === 'NAME' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                {t('common.name')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('QUIZ_COUNT')}
                right={activeSortOption === 'QUIZ_COUNT' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                {t('library.my_notes_content.question_count')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {isLoading ? (
        <>
          <Loading center />
          {/* <div className="mt-[16px] pb-[16px] h-full w-full flex flex-col gap-[8px] overflow-y-auto">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="w-full h-[104px] shrink-0 rounded-[16px] bg-gray-100 animate-pulse"></div>
            ))}
          </div> */}
        </>
      ) : isEmptyMyDocuments ? (
        <EmptyMyNote />
      ) : (
        documents && (
          <div className="mt-[16px] pb-[16px] h-full w-full flex flex-col gap-[8px] overflow-y-auto">
            {documents.map((document) => (
              <SlidableNoteCard
                key={document.id}
                id={document.id}
                selectMode={selectMode}
                changeSelectMode={changeSelectMode}
                onClick={() => {
                  router.push('/quiz-detail/:noteId', { params: [String(document.id)] })
                  trackEvent('library_item_click', {
                    location: '내 퀴즈 탭',
                  })
                }}
                swipeOptions={[
                  <button
                    onClick={() => {
                      check(document.id)

                      if (!document.isPublic) {
                        setOpenRelease(true)
                      } else {
                        handleShare(document.id, document.name)
                      }
                    }}
                    key={'shareButton'}
                    className="flex-center w-[72px] flex-col bg-orange p-2 text-inverse"
                  >
                    <IcUpload className="size-[20px] mb-[4px] text-inverse" />
                    <Text typo="body-1-medium" color="inverse" className="size-fit">
                      {t('library.my_notes_content.share_button')}
                    </Text>
                  </button>,
                  <button
                    onClick={() => {
                      check(document.id)
                      setOpenDelete(true)
                    }}
                    key={'deleteButton'}
                    className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse"
                  >
                    <IcDelete className="size-[20px] mb-[4px]" />
                    <Text typo="body-1-medium" color="inverse" className="size-fit">
                      {t('common.delete')}
                    </Text>
                  </button>,
                ]}
              >
                <SlidableNoteCard.Left
                  content={document.emoji}
                  checkBox={
                    <Checkbox
                      id={`note_${document.id}`}
                      checked={isChecked(document.id)}
                      onCheckedChange={(checked) => (checked ? check(document.id) : unCheck(document.id))}
                      className="mx-[10px] size-[20px]"
                    />
                  }
                  selectMode={selectMode}
                />

                <SlidableNoteCard.Content>
                  <SlidableNoteCard.Header
                    title={highlightAndTrimText(document.name ?? '', keyword ?? '', 'subtitle-2-bold')}
                  />
                  <SlidableNoteCard.Preview
                    content={
                      isSearchDocType(document) ? (
                        <MarkdownProcessor
                          markdownText={formatQAText(document.quizzes)}
                          keyword={keyword ?? ''}
                          typo="body-1-regular"
                          displayCharCount={40}
                          truncate
                        />
                      ) : (
                        document.previewContent
                      )
                    }
                  />

                  <SlidableNoteCard.Detail
                    quizCount={document.totalQuizCount}
                    playedCount={document.tryCount}
                    bookmarkCount={document.bookmarkCount}
                    isPublic={document.isPublic}
                  />
                </SlidableNoteCard.Content>
              </SlidableNoteCard>
            ))}
          </div>
        )
      )}

      {selectMode && (
        <div
          className={cn(
            'h-tab-navigation bg-surface-1 fixed left-1/2 -translate-x-1/2 bottom-0 z-50 w-full max-w-xl border-t border-divider px-36 pt-5 pb-8 inline-flex flex-col justify-start items-center',
          )}
        >
          <TextButton
            onClick={() => {
              setOpenDelete(true)
            }}
            left={<IcDelete className="size-[20px] text-icon-critical" />}
            variant={'critical'}
            size={'lg'}
          >
            {t('library.my_notes_content.select_delete_button')}
          </TextButton>
        </div>
      )}

      <SystemDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title={t('library.my_notes_content.delete_confirm_title')}
        content={
          <Text typo="body-1-medium" color="sub" className="break-normal whitespace-pre-line">
            {t('library.my_notes_content.delete_confirm_message')}{' '}
            <Text as="span" typo="body-1-medium" color="incorrect">
              {t('library.my_notes_content.delete_confirm_count', { count: selectedTotalQuizCount })}
            </Text>
            {t('library.my_notes_content.delete_confirm_warning')}
          </Text>
        }
        variant="critical"
        confirmLabel={t('library.my_notes_content.delete_confirm_button')}
        onConfirm={() => {
          handleDelete(getCheckedIds().map((id) => Number(id)))
          setOpenDelete(false)
          changeSelectMode(false)
        }}
      />

      <NeedReleaseDialog open={openRelease} onOpenChange={setOpenRelease} selectedDocument={getCheckedList()[0]} />
    </div>
  )
}

const NeedReleaseDialog = ({
  open,
  onOpenChange,
  selectedDocument,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  selectedDocument?: GetAllDocumentsDocumentDto
}) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [openNeedMoreQuiz, setOpenNeedMoreQuiz] = useState(false)

  const { mutate: updatePublic, isPending } = useUpdateDocumentIsPublic(selectedDocument?.id ?? 0)

  const handleRelease = () => {
    if (!selectedDocument) return

    if (selectedDocument.totalQuizCount < 5) {
      setOpenNeedMoreQuiz(true)
    } else {
      updatePublic(
        { isPublic: true },
        {
          onSuccess: () => {
            router.push('/quiz-detail/:noteId', { params: [String(selectedDocument.id)] })
          },
          onError: () => {
            toast.error(t('library.my_notes_content.public_failed_message'))
          },
          onSettled: () => {
            onOpenChange(false)
          },
        },
      )
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="px-[24px] pt-[32px] pb-[20px] w-[308px] flex items-center flex-col gap-[32px]">
          <DialogHeader className="w-full flex-center flex-col gap-[8px]">
            <DialogTitle>
              <Text typo="h4">{t('library.my_notes_content.public_required_title')}</Text>
            </DialogTitle>
            <Text typo="subtitle-2-medium" color="sub" className="break-words text-center">
              {t('library.my_notes_content.public_required_message')} <br />
              {t('library.my_notes_content.public_required_action')}
            </Text>
          </DialogHeader>

          <div className="w-full flex-center flex-col gap-[24px]">
            <Button onClick={handleRelease} data-state={isPending && 'loading'} className="w-full">
              {t('library.my_notes_content.make_public_button')}
            </Button>

            <DialogClose>
              <TextButton size={'lg'} className="text-sub">
                {t('common.close')}
              </TextButton>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <SystemDialog
        open={openNeedMoreQuiz}
        onOpenChange={setOpenNeedMoreQuiz}
        title={t('library.my_notes_content.more_questions_title')}
        content={
          <div className="break-words text-center">
            {t('library.my_notes_content.description1')} <br />
            {t('library.my_notes_content.description2')}
          </div>
        }
        cancelLabel={t('common.cancel')}
        confirmLabel={t('common.generate')}
        onConfirm={() => {
          if (!selectedDocument) return
          router.push('/quiz-detail/:noteId', { params: [String(selectedDocument.id)] })
        }}
      />
    </>
  )
}

export default MyNotesContent
