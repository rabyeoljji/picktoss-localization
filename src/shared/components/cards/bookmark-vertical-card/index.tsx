import { IcBookmarkFilled, IcMy, IcPlayFilled } from '@/shared/assets/icon'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: HTMLElement['className']
}

export const BookmarkVerticalCard = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        `relative flex flex-col h-[206px] w-full max-w-[166px] overflow-hidden rounded-[16px] bg-white px-[12px] py-[16px] cursor-pointer border border-outline`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BookmarkVerticalCardHeader = ({
  emoji,
  isOwner,
  bookmarkBtn,
  category,
}: {
  emoji: string
  isOwner: boolean
  bookmarkBtn: React.ReactNode
  category: string
}) => {
  return (
    <div className="flex flex-col w-full gap-[6px] mb-[6px]">
      <div className="flex w-full h-[47px] justify-between">
        <Text typo="h1">{emoji}</Text>

        {!isOwner && <div>{bookmarkBtn}</div>}
      </div>

      <Tag className="w-fit">{category}</Tag>
    </div>
  )
}

const BookmarkVerticalCardContent = ({ title }: { title: React.ReactNode }) => {
  return (
    <Text typo="subtitle-2-bold" className="line-clamp-2 mb-[4px]">
      {title}
    </Text>
  )
}

const BookmarkVerticalCardDetail = ({
  quizCount,
  isPublic,
  playedCount,
  bookmarkCount,
}: {
  quizCount: number
  isPublic?: boolean
  playedCount?: number
  bookmarkCount?: number
}) => {
  const { t } = useTranslation()

  return (
    <Text typo="body-2-medium" color="sub" className="flex w-fit items-center">
      <div className="inline-flex justify-start items-center gap-[2px]">
        <span>{t('common.quiz_card.question_count', { count: quizCount })}</span>
      </div>

      {isPublic && (
        <>
          <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />

          <div className="inline-flex justify-start items-center gap-[2px]">
            <IcPlayFilled className="size-[12px] text-icon-sub" />
            <span>{playedCount}</span>
          </div>

          <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />

          <div className="inline-flex justify-start items-center gap-[2px]">
            <IcBookmarkFilled className="size-[12px] text-icon-sub" />
            <span>{bookmarkCount}</span>
          </div>
        </>
      )}

      {!isPublic && (
        <>
          <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />
          <span>{t('common.quiz_card.private')}</span>
        </>
      )}
    </Text>
  )
}

const BookmarkVerticalCardFooter = ({ creator }: { creator: string }) => {
  return (
    <div className="flex items-center gap-[4px] mt-auto">
      <div className="size-[16px] rounded-full bg-base-3 flex-center shrink-0">
        <IcMy className="size-[9.6px] text-icon-sub" />
      </div>
      <Text typo="body-2-medium" color="caption" className="w-full truncate">
        {creator}
      </Text>
    </div>
  )
}

BookmarkVerticalCard.Header = BookmarkVerticalCardHeader
BookmarkVerticalCard.Content = BookmarkVerticalCardContent
BookmarkVerticalCard.Detail = BookmarkVerticalCardDetail
BookmarkVerticalCard.Footer = BookmarkVerticalCardFooter
