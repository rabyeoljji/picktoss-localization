import { useEffect, useMemo, useState } from 'react'

import { toast } from 'sonner'

import { extractPlainText } from '@/features/note/lib'

import { GetAllDocumentsDocumentDto } from '@/entities/document/api'
import { useDeleteDocument, useUpdateDocumentIsPublic } from '@/entities/document/api/hooks'

import { IcArrange, IcCheck, IcDelete, IcSearch, IcUpload } from '@/shared/assets/icon'
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
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { UseCheckListReturn } from '@/shared/hooks/use-check-list'
import { Link, useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const MyNotesContent = ({
  documents,
  selectMode,
  checkList,
  changeSelectMode,
}: {
  documents: GetAllDocumentsDocumentDto[]
  selectMode: boolean
  checkList: UseCheckListReturn<GetAllDocumentsDocumentDto>
  changeSelectMode: (selectMode: boolean) => void
}) => {
  const router = useRouter()
  const [sortOption, setSortOption] = useQueryParam('/library', 'sortOption')
  const activeSortOption = sortOption ?? 'CREATED_AT'

  const [openRelease, setOpenRelease] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const { mutate: deleteDocument } = useDeleteDocument()

  const { check, unCheck, unCheckAll, isChecked, getCheckedIds, getCheckedList } = checkList

  const selectedTotalQuizCount = useMemo(
    () => getCheckedList().reduce((acc, cur) => acc + cur.totalQuizCount, 0),
    [getCheckedList()],
  )

  // 공유하기 핸들러
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getCheckedList()[0].name,
          text: `${getCheckedList()[0].totalQuizCount - 1}문제`,
          url: `${'https://picktoss.vercel.app'}/explore/detail/${getCheckedList()[0].id}`, // 추후 picktoss.com으로 변경
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
    deleteDocument(
      { documentIds },
      {
        onSuccess: () => toast.success('퀴즈가 삭제되었어요'),
      },
    )
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
    <div className="size-full flex flex-col px-[16px] pt-[16px] overflow-y-auto">
      {!selectMode && (
        <div className="w-full flex items-center">
          <Link
            to={'/library/search'}
            className="h-[40px] flex-1 bg-base-3 py-[8px] px-[10px] flex items-center gap-[4px] rounded-full"
          >
            <IcSearch className="size-[20px] text-icon-secondary" />
            <Text typo="subtitle-2-medium" color="caption">
              퀴즈 제목, 내용 검색
            </Text>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="size-fit py-[10px] pl-[10px] flex-center cursor-pointer">
              <IcArrange width={20} height={20} className=" text-icon-secondary" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSortOption('WRONG_ANSWER_COUNT')}
                right={activeSortOption === 'WRONG_ANSWER_COUNT' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                오답 수
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption('CREATED_AT')}
                right={activeSortOption === 'CREATED_AT' && <IcCheck className="size-[20px]" />}
                className="cursor-pointer"
              >
                생성한 일자
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

      <div className="py-[16px] h-fit w-full flex flex-col gap-[8px]">
        {documents.map((document) => (
          <SlidableNoteCard
            key={document.id}
            id={document.id}
            selectMode={selectMode}
            changeSelectMode={changeSelectMode}
            onClick={() => router.push('/library/:noteId', { params: [String(document.id)] })}
            swipeOptions={[
              <button
                onClick={() => {
                  check(document.id)

                  if (!document.isPublic) {
                    setOpenRelease(true)
                  } else {
                    handleShare()
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
            router.push('/explore/detail/:noteId', { params: [String(selectedDocument.id)] })
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
          router.push('/library/:noteId', { params: [String(selectedDocument.id)] })
        }}
      />
    </>
  )
}

export default MyNotesContent
