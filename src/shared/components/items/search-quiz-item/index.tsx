import { IcBookmarkFilled, IcPlayFilled } from '@/shared/assets/icon'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface Props {
  documentTitle: React.ReactNode
  documentEmoji: string
  matchingSentence: React.ReactNode
  quizCount: number
  isPublic: boolean
  isBookmarked?: boolean
  isOwner?: boolean
  playedCount?: number
  bookmarkCount?: number
  lastItem?: boolean
}

const SearchQuizItem = ({
  documentTitle,
  documentEmoji,
  matchingSentence,
  quizCount,
  isPublic,
  isBookmarked,
  isOwner,
  playedCount,
  bookmarkCount,
  lastItem,
}: Props) => {
  const { t } = useTranslation()

  return (
    <div className={cn('border-b border-divider py-[24px] flex flex-col', lastItem && 'border-none')}>
      <div className="mb-[8px] flex items-center justify-between">
        <Text typo="subtitle-2-bold">
          {documentEmoji} {documentTitle}
        </Text>

        {(isBookmarked || isOwner) && (
          <Tag size={'md'} color="gray">
            {isBookmarked
              ? t('explore.explore_search_page.saved')
              : isOwner && t('explore.explore_search_page.generated')}
          </Tag>
        )}
      </div>

      <Text typo="body-1-regular" className="text-sub">
        {matchingSentence}
      </Text>

      <div className="mt-[8px] flex items-center">
        <Text typo="body-2-medium" color="sub" className="flex w-fit items-center mt-[4px]">
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
      </div>
    </div>
  )
}

export default SearchQuizItem
