/* eslint-disable react-hooks/rules-of-hooks */
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { Text } from '@/shared/components/ui/text'

import SearchQuizNoteItem from '.'

const meta: Meta<typeof SearchQuizNoteItem> = {
  title: 'Item/SearchQuizNoteItem',
  component: SearchQuizNoteItem,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    documentTitle: { control: 'text' },
    matchingSentence: { control: 'text' },
    documentEmoji: { control: 'text' },
    quizCount: { control: 'number' },
    isPublic: { control: 'boolean' },
    playedCount: { control: 'number' },
    bookmarkCount: { control: 'number' },
    lastItem: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SearchQuizNoteItem>

export const Default: Story = {
  render: () => {
    const [{ documentTitle, documentEmoji, quizCount, isPublic, playedCount, bookmarkCount, lastItem }] = useArgs()

    return (
      <SearchQuizNoteItem
        documentId={0}
        documentTitle={documentTitle ?? '제무제표 분석하기'}
        documentEmoji={documentEmoji ?? '🎯'}
        matchingSentence={
          <div>
            ...제품을 기존 제품과 구별할 수 있어야 하며, 전통적인{' '}
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              기초
            </Text>{' '}
            육류, 조개류, 소고기 또는 가금류에 알레르기가 있는 사람들이 세포 기반 제품...
          </div>
        }
        quizCount={quizCount ?? 25}
        isPublic={isPublic != null ? isPublic : false}
        playedCount={playedCount ?? 345}
        bookmarkCount={bookmarkCount ?? 21}
        lastItem={lastItem}
      />
    )
  },
}

export const PublicNote: Story = {
  render: () => {
    return (
      <SearchQuizNoteItem
        documentId={1}
        documentTitle={'최근 이슈'}
        documentEmoji="🎯"
        matchingSentence={
          <div>
            ...제품을 기존 제품과 구별할 수 있어야 하며, 전통적인{' '}
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              기초
            </Text>{' '}
            육류, 조개류, 소고기 또는 가금류에 알레르기가 있는 사람들이 세포 기반 제품...
          </div>
        }
        quizCount={25}
        isPublic={true}
        playedCount={345}
        bookmarkCount={21}
        lastItem={false}
      />
    )
  },
}

export const LastItem: Story = {
  render: () => {
    return (
      <SearchQuizNoteItem
        documentId={2}
        documentTitle={'최근 이슈'}
        documentEmoji="🎯"
        matchingSentence={
          <div>
            ...제품을 기존 제품과 구별할 수 있어야 하며, 전통적인{' '}
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              기초
            </Text>{' '}
            육류, 조개류, 소고기 또는 가금류에 알레르기가 있는 사람들이 세포 기반 제품...
          </div>
        }
        quizCount={25}
        isPublic={true}
        playedCount={345}
        bookmarkCount={21}
        lastItem={true}
      />
    )
  },
}
