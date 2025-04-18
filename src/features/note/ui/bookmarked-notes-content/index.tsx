import { extractPlainText } from '@/features/note/lib'

import { GetBookmarkedDocumentsDto } from '@/entities/document/api'

import { IcArrange, IcSearch } from '@/shared/assets/icon'
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
            <IcArrange className="size-[20px] text-icon-secondary" />
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
            <BookmarkHorizontalCard>
              <BookmarkHorizontalCard.Left content={document.emoji} />

              <BookmarkHorizontalCard.Content>
                <BookmarkHorizontalCard.Header
                  title={document.name}
                  isBookmarked={true}
                  onClickBookmark={() => alert('click bookmark')}
                />
                <BookmarkHorizontalCard.Preview content={extractPlainText(document.previewContent)} />
                <BookmarkHorizontalCard.Detail
                  quizCount={document.totalQuizCount}
                  playedCount={document.tryCount}
                  bookmarkCount={document.bookmarkCount}
                  isPublic={true}
                />
              </BookmarkHorizontalCard.Content>
            </BookmarkHorizontalCard>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BookmarkedNotesContent
