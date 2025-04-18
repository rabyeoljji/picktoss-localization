import { Meta, StoryObj } from '@storybook/react'

import { BookmarkHorizontalCard } from '@/shared/components/cards/bookmark-horizontal-card'

const meta: Meta<typeof BookmarkHorizontalCard> = {
  title: 'Card/BookmarkHorizontal',
  component: BookmarkHorizontalCard,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-gray-100">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof BookmarkHorizontalCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <BookmarkHorizontalCard>
          <BookmarkHorizontalCard.Left content="📄" />

          <BookmarkHorizontalCard.Content>
            <BookmarkHorizontalCard.Header
              title="금융투자분석사 노트정리"
              isBookmarked={false}
              onClickBookmark={() => {}}
            />
            <BookmarkHorizontalCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <BookmarkHorizontalCard.Detail quizCount={28} isPublic playedCount={345} bookmarkCount={21} />
          </BookmarkHorizontalCard.Content>
        </BookmarkHorizontalCard>
      </div>
    )
  },
}

export const Bookmarked: StoryObj<typeof BookmarkHorizontalCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <BookmarkHorizontalCard>
          <BookmarkHorizontalCard.Left content="📄" />

          <BookmarkHorizontalCard.Content>
            <BookmarkHorizontalCard.Header
              title="금융투자분석사 노트정리"
              isBookmarked={true}
              onClickBookmark={() => {}}
            />
            <BookmarkHorizontalCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <BookmarkHorizontalCard.Detail quizCount={28} isPublic playedCount={345} bookmarkCount={21} />
          </BookmarkHorizontalCard.Content>
        </BookmarkHorizontalCard>
      </div>
    )
  },
}
