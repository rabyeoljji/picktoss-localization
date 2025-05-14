import React from 'react'

import { IcBookmark, IcBookmarkFilled, IcMy, IcPlayFilled, IcUpload } from '@/shared/assets/icon'
import { Button } from '@/shared/components/ui/button'
import { ButtonSolidIcon } from '@/shared/components/ui/button-solid-icon'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { cn } from '@/shared/lib/utils'

interface Props {
  header: React.ReactNode
  content: React.ReactNode
  quizzes: React.ReactNode
  footer: React.ReactNode
  index?: number
  activeIndex?: number
}

export const ExploreQuizCard = ({ index, activeIndex, header, content, quizzes, footer }: Props) => {
  return (
    <div
      className={cn(
        'w-[343px] h-[500px] relative rounded-[20px] shadow-[0px_4px_28px_0px_rgba(0,0,0,0.10)] overflow-hidden transition-transform duration-300 bg-[linear-gradient(to_bottom,_var(--color-white)_78%,_var(--color-orange-100)_100%)]',
        activeIndex !== index && 'scale-90 pointer-events-none',
      )}
    >
      <div className={cn('size-full flex flex-col justify-between opacity-10', activeIndex === index && 'opacity-100')}>
        <div className="flex-1/2 flex flex-col gap-[22px]">
          {header}

          {content}
        </div>

        <div className="pb-[24px]">
          {quizzes}

          {footer}
        </div>
      </div>
    </div>
  )
}

const ExploreQuizCardHeader = ({
  creator,
  isOwner,
  isBookmarked,
  onClickShare,
  onClickBookmark,
}: {
  creator: string
  isOwner: boolean
  isBookmarked: boolean
  onClickShare: () => void
  onClickBookmark: () => void
}) => {
  return (
    <div className="mt-[16px] px-[20px] flex items-center justify-between">
      <div className="flex gap-[8px]">
        <div className="size-[20px] flex-center rounded-full bg-base-3">
          <IcMy className="size-[12px] text-icon-sub" />
        </div>
        <Text typo="body-1-medium" color="sub">
          {creator}
        </Text>
      </div>
      <div className="flex gap-[16px]">
        <ButtonSolidIcon onClick={onClickShare} variant={'tertiary'} size={'md'}>
          <IcUpload className="size-[20px]" />
        </ButtonSolidIcon>
        {!isOwner && (
          <ButtonSolidIcon onClick={onClickBookmark} variant={'tertiary'} size={'md'}>
            {isBookmarked ? <IcBookmarkFilled className="size-[20px]" /> : <IcBookmark className="size-[20px]" />}
          </ButtonSolidIcon>
        )}
      </div>
    </div>
  )
}

const ExploreQuizCardContent = ({
  emoji,
  title,
  category,
  playedCount,
  bookmarkCount,
}: {
  emoji: string
  title: string
  category: string
  playedCount: number
  bookmarkCount: number
}) => {
  return (
    <div className="px-[28px] flex flex-col gap-[4px]">
      <div className="text-5xl">{emoji}</div>
      <div className="flex flex-col gap-[12px]">
        <Text typo="h2" className="line-clamp-2">
          {title}
        </Text>

        <Text typo="body-1-medium" color="sub" className="flex w-fit items-center">
          <span>{category}</span>

          <div className="inline-block size-[4px] mx-[8px] bg-[var(--color-gray-100)] rounded-full" />

          <div className="inline-flex justify-start items-center gap-[2px]">
            <IcPlayFilled className="size-[12px] text-icon-sub" />
            <span>{playedCount}</span>
          </div>

          <div className="inline-block size-[4px] mx-[8px] bg-[var(--color-gray-100)] rounded-full" />

          <div className="inline-flex justify-start items-center gap-[2px]">
            <IcBookmarkFilled className="size-[12px] text-icon-sub" />
            <span>{bookmarkCount}</span>
          </div>
        </Text>
      </div>
    </div>
  )
}

const ExploreQuizCardQuizzes = ({
  totalQuizCount,
  onClickViewAllBtn,
  quizzes,
}: {
  totalQuizCount: number
  onClickViewAllBtn: () => void
  quizzes: { id: number; question: string }[]
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="px-[28px] flex justify-between">
        <Text typo="subtitle-2-bold">
          문제{' '}
          <Text as={'span'} typo="subtitle-2-bold" color="sub">
            {totalQuizCount}
          </Text>
        </Text>

        <TextButton onClick={onClickViewAllBtn} size={'sm'} variant="sub">
          전체보기
        </TextButton>
      </div>

      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
        {quizzes.map((quiz, index) => (
          <div
            key={`quiz-${quiz.id}`}
            className={cn(
              'bg-base-2 py-[9.5px] px-[16px] w-[240px] h-[64px] rounded-[12px] flex-center flex-shrink-0',
              index === 0 && 'ml-[28px]',
            )}
          >
            <Text typo="body-1-medium" color="sub" className="line-clamp-2">
              <Text as={'span'} typo="body-1-medium" color="accent">
                Q.{' '}
              </Text>
              {quiz.question}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

const ExploreQuizCardFooter = ({
  onClickStartQuiz,
  isLoading,
}: {
  onClickStartQuiz: () => void
  isLoading?: boolean
}) => {
  return (
    <div className="px-[20px] mt-[25px]">
      <Button onClick={onClickStartQuiz} data-state={isLoading && 'loading'}>
        퀴즈 시작하기
      </Button>
    </div>
  )
}

ExploreQuizCard.Header = ExploreQuizCardHeader
ExploreQuizCard.Content = ExploreQuizCardContent
ExploreQuizCard.Quizzes = ExploreQuizCardQuizzes
ExploreQuizCard.Footer = ExploreQuizCardFooter
