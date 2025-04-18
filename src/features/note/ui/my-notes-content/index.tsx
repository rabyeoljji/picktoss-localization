import { extractPlainText } from '@/features/note/lib'

import { GetAllDocumentsDocumentDto } from '@/entities/document/api'

import { IcArrange, IcCheck, IcDelete, IcSearch, IcUpload } from '@/shared/assets/icon'
import { SlidableNoteCard } from '@/shared/components/cards/slidable-note-card'
import { Checkbox } from '@/shared/components/ui/checkbox'
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

  const { check, unCheck, isChecked } = checkList

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
            // onSelect={() => {}}
            onClick={() => router.push('/library/:noteId', { params: [String(document.id)] })}
            swipeOptions={[
              <button key={'shareButton'} className="flex-center w-[72px] flex-col bg-orange p-2 text-inverse">
                <IcUpload className="size-[20px] mb-[4px] text-inverse" />
                <Text typo="body-1-medium" color="inverse" className="size-fit">
                  공유
                </Text>
              </button>,
              <button key={'deleteButton'} className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
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
          <TextButton left={<IcDelete className="size-[20px] text-icon-critical" />} variant={'critical'} size={'lg'}>
            선택 삭제
          </TextButton>
        </div>
      )}
    </div>
  )
}

export default MyNotesContent
