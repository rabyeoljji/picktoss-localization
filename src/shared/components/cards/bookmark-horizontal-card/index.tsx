import { IcBookmark, IcBookmarkFilled, IcPlayFilled } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

interface Props {
  children: React.ReactNode
  className?: HTMLElement['className']
}

export const BookmarkHorizontalCard = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        `relative flex h-[104px] max-w-full items-center overflow-hidden rounded-[16px] bg-white px-[16px] py-[19px] shrink-0 cursor-pointer`,
        className,
      )}
    >
      <div className="relative flex h-[104px] max-w-full items-center rounded-[16px]">{children}</div>
    </div>
  )
}

const BookmarkHorizontalCardLeft = ({ content }: { content: string }) => {
  return (
    <div className={cn('flex-center size-10 shrink-0 text-inverse')}>
      <Text typo="h3">{content}</Text>
    </div>
  )
}

const BookmarkHorizontalCardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-[16px] flex w-[calc(100%-55px)] flex-col">{children}</div>
}

const BookmarkHorizontalCardHeader = ({
  title,
  isBookmarked,
  onClickBookmark,
  tag,
}: {
  title: string
  isBookmarked: boolean
  onClickBookmark: () => void
  tag?: React.ReactNode
}) => {
  return (
    <div className="relative mb-[2px] flex items-center gap-[8px]">
      <Text as="h4" typo="subtitle-2-bold" className="w-fit max-w-[calc(100%-100px)] overflow-x-hidden truncate">
        {title}
      </Text>

      {tag}

      <div
        className="absolute top-0 right-0 cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          onClickBookmark()
        }}
      >
        {isBookmarked ? <IcBookmarkFilled className="size-[20px]" /> : <IcBookmark className="size-[20px]" />}
      </div>
    </div>
  )
}

const BookmarkHorizontalCardPreview = ({ content }: { content: string }) => {
  return (
    <Text typo="body-1-regular" color="sub" className="w-[calc(100%-40px)] truncate text-nowrap break-all">
      {content}
    </Text>
  )
}

const BookmarkHorizontalCardDetail = ({
  quizCount,
  isShared,
  playedCount,
  bookmarkCount,
}: {
  quizCount: number
  isShared?: boolean
  playedCount?: number
  bookmarkCount?: number
}) => {
  return (
    <Text typo="body-2-medium" color="sub" className="flex w-fit items-center mt-[8px]">
      <div className="inline-flex justify-start items-center gap-1">
        <span>{quizCount} 문제</span>
      </div>

      {isShared && (
        <>
          <div className="inline-block size-fit mx-[4px] text-icon-disabled">•</div>

          <div className="inline-flex justify-start items-center gap-1">
            <IcPlayFilled className="size-[12px] text-icon-sub" />
            <span>{playedCount}</span>
          </div>

          <div className="inline-block size-fit mx-[4px] text-icon-disabled">•</div>

          <div className="inline-flex justify-start items-center gap-1">
            <IcBookmarkFilled className="size-[12px] text-icon-sub" />
            <span>{bookmarkCount}</span>
          </div>
        </>
      )}

      {!isShared && (
        <>
          <div className="inline-block size-fit mx-[4px] text-icon-disabled">•</div>
          <span>비공개</span>
        </>
      )}
    </Text>
  )
}

BookmarkHorizontalCard.Left = BookmarkHorizontalCardLeft
BookmarkHorizontalCard.Content = BookmarkHorizontalCardContent
BookmarkHorizontalCard.Header = BookmarkHorizontalCardHeader
BookmarkHorizontalCard.Preview = BookmarkHorizontalCardPreview
BookmarkHorizontalCard.Detail = BookmarkHorizontalCardDetail
