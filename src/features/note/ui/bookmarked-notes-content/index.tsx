import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

import { extractPlainText } from '@/features/note/lib'
import EmptyBookmarkQuiz from '@/features/note/ui/empty-bookmark-quiz'

import { GetBookmarkedDocumentsDto } from '@/entities/document/api'
import { useUser } from '@/entities/member/api/hooks'

import { IcArrange, IcCheck } from '@/shared/assets/icon'
import { BookmarkHorizontalCard } from '@/shared/components/cards/bookmark-horizontal-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import Loading from '@/shared/components/ui/loading'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useQueryParam, useRouter } from '@/shared/lib/router'

interface Props {
  activeTab: 'MY' | 'BOOKMARK'
  onTabChange: (tab: 'MY' | 'BOOKMARK') => void
  isLoading: boolean
  isEmptyBookmarked: boolean
  documents?: GetBookmarkedDocumentsDto[]
}

const BookmarkedNotesContent = ({ activeTab, onTabChange, isLoading, isEmptyBookmarked, documents }: Props) => {
  type Tab = typeof activeTab

  const { data: user } = useUser()

  const [sortOption, setSortOption] = useQueryParam('/library', 'bookmarkedSortOption')
  const activeSortOption = sortOption ?? 'CREATED_AT'

  return (
    <div className="size-full flex flex-col px-[16px] pt-[16px]">
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
            <IcArrange width={20} height={20} className="text-icon-secondary" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
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

      {isLoading ? (
        <>
          <Loading center />
          {/* <div className="mt-[16px] pb-[16px] h-full w-full flex flex-col gap-[8px] overflow-y-auto">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-full h-[104px] shrink-0 rounded-[16px] bg-gray-100 animate-pulse"></div>
          ))}
        </div> */}
        </>
      ) : isEmptyBookmarked ? (
        <EmptyBookmarkQuiz />
      ) : (
        documents && (
          <div className="mt-[16px] pb-[16px] h-full w-full flex flex-col gap-[8px] overflow-y-auto">
            {documents.map((document) => (
              <BookmarkedCard
                key={document.id}
                id={document.id}
                emoji={document.emoji}
                name={document.name}
                previewContent={document.previewContent}
                totalQuizCount={document.totalQuizCount}
                playedCount={document.tryCount}
                bookmarkCount={document.bookmarkCount}
              />
            ))}
          </div>
        )
      )}
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
  const { trackEvent } = useAmplitude()
  const router = useRouter()

  // const { mutate: deleteBookmark } = useDeleteDocumentBookmark(id)
  // const { mutate: createBookmark } = useCreateDocumentBookmark(id)

  // const handleDeleteBookmark = () => {
  //   deleteBookmark(undefined, {
  //     onSuccess: () => {
  //       toast('북마크가 해제되었어요', {
  //         action: {
  //           label: '되돌리기',
  //           onClick: () => createBookmark(),
  //         },
  //       })
  //     },
  //   })
  // }

  return (
    <BookmarkHorizontalCard
      onClick={() => {
        router.push('/quiz-detail/:noteId', { params: [String(id)] })
        trackEvent('library_item_click', {
          location: '북마크 탭',
        })
      }}
      className="cursor-pointer"
    >
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

      {/* <BookmarkHorizontalCard.Right
        content={
          <IcBookmarkFilled
            className="size-[20px]"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteBookmark()
            }}
          />
        }
      /> */}
    </BookmarkHorizontalCard>
  )
}
