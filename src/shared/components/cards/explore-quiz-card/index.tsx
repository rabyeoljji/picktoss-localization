import React from 'react'

import { IcBookmark, IcBookmarkFilled, IcPlayFilled, IcUpload } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

export const ExploreQuizCard = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={cn(
        'w-full relative bg-surface-1 flex flex-col gap-[16px] pt-[24px] pb-[12px] border-b border-divider cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const ExploreQuizCardContent = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className={cn('flex flex-col gap-[20px]', className)} {...props}>
      {children}
    </div>
  )
}

const ExploreQuizCardHeader = ({ emoji, title, creator }: { emoji: string; title: string; creator: string }) => {
  return (
    <div className="flex items-center gap-[8px] px-[16px]">
      <div className="w-12 h-12 text-center justify-center text-4xl leading-10">{emoji}</div>
      <div className="flex flex-col gap-[4px] max-w-64 truncate">
        <Text typo="h4" className="max-w-64 truncate">
          {title}
        </Text>
        <Text typo="body-2-medium" color="sub" className="max-w-64 truncate">
          @{creator}
        </Text>
      </div>
    </div>
  )
}

const ExploreQuizCardQuizzes = ({
  quizzes,
  isFetching,
}: {
  onClickMoveToDetailPageBtn: () => void
  quizzes: { id: number; question: string }[]
  isFetching?: boolean
}) => {
  return (
    <div className="flex flex-col gap-[10px] pl-[16px]">
      <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
        {isFetching ? (
          <>
            <div className="flex-shrink-0 w-[280px] h-[64px] rounded-[12px]  bg-[linear-gradient(120deg,#f8f8f7_25%,#ffffff_50%,#f8f8f7_75%)] bg-[length:200%_100%] animate-[skeleton_1.8s_linear_infinite]"></div>
            <div className="flex-shrink-0 w-[280px] h-[64px] rounded-[12px] bg-[linear-gradient(120deg,#f8f8f7_25%,#ffffff_50%,#f8f8f7_75%)] bg-[length:200%_100%] animate-[skeleton_1.8s_linear_infinite]"></div>
            <div className="flex-shrink-0 w-[280px] h-[64px] rounded-[12px] bg-[linear-gradient(120deg,#f8f8f7_25%,#ffffff_50%,#f8f8f7_75%)] bg-[length:200%_100%] animate-[skeleton_1.8s_linear_infinite]"></div>
          </>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={`quiz-${quiz.id}`}
              className={cn(
                'bg-base-2 py-[12px] px-[16px] w-[280px] h-[64px] rounded-[12px] flex-center flex-shrink-0 border-1 border-outline',
              )}
            >
              <Text typo="body-1-medium" color="sub" className="line-clamp-2">
                {quiz.question}
              </Text>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const ExploreQuizCardFooter = ({
  totalQuizCount,
  playedCount,
  bookmarkCount,
  isOwner,
  isBookmarked,
  onClickShare,
  onClickBookmark,
}: {
  totalQuizCount: number
  playedCount: number
  bookmarkCount: number
  isOwner: boolean
  isBookmarked: boolean
  onClickShare: () => void
  onClickBookmark: () => void
}) => {
  return (
    <div className="px-[8px] flex justify-between items-center">
      <div className="px-[8px] size-fit">
        <Text typo="body-2-medium" color="sub" className="flex size-fit items-center">
          <span>{totalQuizCount}문제</span>

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
        </Text>
      </div>

      <div className="flex gap-[8px]">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClickShare()
          }}
          className="p-[8px]"
        >
          <IcUpload className="size-[20px]" />
        </button>

        {!isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClickBookmark()
            }}
            className="p-[8px]"
          >
            {isBookmarked ? (
              <IcBookmarkFilled className="size-[20px] text-icon-primary" />
            ) : (
              <IcBookmark className="size-[20px]" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

ExploreQuizCard.Header = ExploreQuizCardHeader
ExploreQuizCard.Content = ExploreQuizCardContent
ExploreQuizCard.Quizzes = ExploreQuizCardQuizzes
ExploreQuizCard.Footer = ExploreQuizCardFooter
