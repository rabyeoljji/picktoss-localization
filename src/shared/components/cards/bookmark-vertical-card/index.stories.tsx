import { Meta, StoryObj } from '@storybook/react'

import { IcBookmark, IcBookmarkFilled } from '@/shared/assets/icon'
import { BookmarkVerticalCard } from '@/shared/components/cards/bookmark-vertical-card'

const meta: Meta<typeof BookmarkVerticalCard> = {
  title: 'Card/BookmarkVerticalCard',
  component: BookmarkVerticalCard,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof BookmarkVerticalCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <BookmarkVerticalCard>
          <BookmarkVerticalCard.Header
            emoji="🔥"
            isOwner={false}
            bookmarkBtn={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  alert('clicked bookmark')
                }}
              >
                <IcBookmark className="size-[24px] text-icon-secondary" />
              </button>
            }
            category={'자격증·수험'}
          />

          <BookmarkVerticalCard.Content title="금융투자분석사 노트정리" />
          <BookmarkVerticalCard.Detail quizCount={28} isPublic playedCount={345} bookmarkCount={21} />

          <BookmarkVerticalCard.Footer creator={'picktoss'} />
        </BookmarkVerticalCard>
      </div>
    )
  },
}

export const Bookmarked: StoryObj<typeof BookmarkVerticalCard> = {
  render: () => {
    return (
      <div onClick={() => alert('clicked card')} className="p-10 flex-center">
        <BookmarkVerticalCard>
          <BookmarkVerticalCard.Header
            emoji="🔥"
            isOwner={false}
            bookmarkBtn={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  alert('clicked bookmark')
                }}
              >
                <IcBookmarkFilled className="size-[24px] text-primary" />
              </button>
            }
            category={'자격증·수험'}
          />

          <BookmarkVerticalCard.Content title="금융투자분석사 노트정리" />
          <BookmarkVerticalCard.Detail quizCount={28} isPublic playedCount={345} bookmarkCount={21} />

          <BookmarkVerticalCard.Footer creator={'picktoss'} />
        </BookmarkVerticalCard>
      </div>
    )
  },
}
