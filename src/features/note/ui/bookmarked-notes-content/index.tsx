import { toast } from 'sonner'

import { extractPlainText } from '@/features/note/lib'

import { GetBookmarkedDocumentsDto } from '@/entities/document/api'
import { useCreateDocumentBookmark, useDeleteDocumentBookmark } from '@/entities/document/api/hooks'

import { IcArrange, IcBookmarkFilled, IcSearch } from '@/shared/assets/icon'
import { BookmarkHorizontalCard } from '@/shared/components/cards/bookmark-horizontal-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Text } from '@/shared/components/ui/text'
import { Link } from '@/shared/lib/router'

const BookmarkedNotesContent = ({ documents }: { documents: GetBookmarkedDocumentsDto[] }) => {
  return (
    <div className="size-full flex flex-col px-[16px] pt-[16px] overflow-y-auto">
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
            <IcArrange width={20} height={20} className="text-icon-secondary" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>저장한 일자</DropdownMenuItem>
            <DropdownMenuItem>문제 수</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="py-[16px] h-fit w-full flex flex-col gap-[8px]">
        {documents.map((document) => (
          <Link key={document.id} to={'/library/:noteId'} params={[String(document.id)]}>
            <BookmarkedCard
              id={document.id}
              emoji={document.emoji}
              name={document.name}
              previewContent={document.previewContent}
              totalQuizCount={document.totalQuizCount}
              playedCount={document.tryCount}
              bookmarkCount={document.bookmarkCount}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BookmarkedNotesContent

interface BookmarkedCardProps {
  id: number
  emoji: string
  name: string
  previewContent: string
  totalQuizCount: number
  playedCount: number
  bookmarkCount: number
}

const BookmarkedCard = ({
  id,
  emoji,
  name,
  previewContent,
  totalQuizCount,
  playedCount,
  bookmarkCount,
}: BookmarkedCardProps) => {
  const { mutate: deleteBookmark } = useDeleteDocumentBookmark(id)
  const { mutate: createBookmark } = useCreateDocumentBookmark(id)

  const handleDeleteBookmark = () => {
    deleteBookmark(undefined, {
      onSuccess: () => {
        toast('북마크가 해제되었어요', {
          action: {
            label: '되돌리기',
            onClick: () => createBookmark(),
          },
        })
      },
    })
  }

  return (
    <BookmarkHorizontalCard>
      <BookmarkHorizontalCard.Left content={emoji} />

      <BookmarkHorizontalCard.Content>
        <BookmarkHorizontalCard.Header title={name} />
        <BookmarkHorizontalCard.Preview content={extractPlainText(previewContent)} />
        <BookmarkHorizontalCard.Detail
          quizCount={totalQuizCount}
          playedCount={playedCount}
          bookmarkCount={bookmarkCount}
          isPublic={true}
        />
      </BookmarkHorizontalCard.Content>

      <BookmarkHorizontalCard.Right
        content={<IcBookmarkFilled className="size-[20px]" onClick={handleDeleteBookmark} />}
      />
    </BookmarkHorizontalCard>
  )
}
