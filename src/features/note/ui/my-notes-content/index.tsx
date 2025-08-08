import { useEffect, useMemo, useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { toast } from 'sonner'

import { extractPlainText } from '@/features/note/lib'
import EmptyMyNote from '@/features/note/ui/empty-my-note'

import { GetAllDocumentsDocumentDto } from '@/entities/document/api'
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

interface Props {
  activeTab: 'MY' | 'BOOKMARK'
  onTabChange: (tab: 'MY' | 'BOOKMARK') => void
  documents?: GetAllDocumentsDocumentDto[]
  selectMode: boolean
  checkList: UseCheckListReturn<GetAllDocumentsDocumentDto>
  changeSelectMode: (selectMode: boolean) => void
  isEmptyMyDocuments: boolean
  isLoading: boolean
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
}: Props) => {
  type Tab = typeof activeTab

  const { trackEvent } = useAmplitude()
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
    toast.success('퀴즈가 삭제되었어요')
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
                생성한 {user?.totalQuizCount}
              </TabsTrigger>
              <TabsTrigger
                className="bg-base-3 typo-button-3 text-secondary data-[state=active]:bg-inverse data-[state=active]:text-inverse rounded-full px-[14px] py-[11px]"
                value={'BOOKMARK' as Tab}
              >
                저장한 {user?.bookmarkCount}
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
                추가된 일자
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('NAME')}
                right={activeSortOption === 'NAME' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                이름
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('QUIZ_COUNT')}
                right={activeSortOption === 'QUIZ_COUNT' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                문제 수
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
                      공유
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
                      삭제
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
                  <SlidableNoteCard.Header title={document.name} />
                  <SlidableNoteCard.Preview content={extractPlainText(document.previewContent)} />
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
            선택 삭제
          </TextButton>
        </div>
      )}

      <SystemDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="퀴즈를 삭제하시겠어요?"
        content={
          <Text typo="body-1-medium" color="sub">
            선택한 퀴즈와{' '}
            <Text as="span" typo="body-1-medium" color="incorrect">
              {`${selectedTotalQuizCount}개의 문제`}
            </Text>
            가 모두 삭제되며, 복구할 수 없어요
          </Text>
        }
        variant="critical"
        confirmLabel="삭제"
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
            toast.error('퀴즈 공개에 실패했어요')
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
              <Text typo="h4">퀴즈 공개가 필요해요</Text>
            </DialogTitle>
            <Text typo="subtitle-2-medium" color="sub">
              픽토스에 퀴즈가 공개된 상태여야 <br />
              공유할 수 있어요
            </Text>
          </DialogHeader>

          <div className="w-full flex-center flex-col gap-[24px]">
            <Button onClick={handleRelease} data-state={isPending && 'loading'} className="w-full">
              퀴즈 공개하기
            </Button>

            <DialogClose>
              <TextButton size={'lg'} className="text-sub">
                닫기
              </TextButton>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <SystemDialog
        open={openNeedMoreQuiz}
        onOpenChange={setOpenNeedMoreQuiz}
        title="문제를 더 생성해주세요"
        content={
          <>
            퀴즈에 포함된 문제가 <br />
            5개 이상이어야 공유할 수 있어요
          </>
        }
        cancelLabel="취소하기"
        confirmLabel="생성하기"
        onConfirm={() => {
          if (!selectedDocument) return
          router.push('/quiz-detail/:noteId', { params: [String(selectedDocument.id)] })
        }}
      />
    </>
  )
}

export default MyNotesContent
