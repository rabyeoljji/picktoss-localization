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
    resultType: {
      control: 'radio',
      options: ['document', 'quiz'],
    },
    relativeDirectory: { control: 'text' },
    directoryEmoji: { control: 'text' },
    quizCount: { control: 'number' },
    charCount: { control: 'number' },
    lastItem: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SearchQuizNoteItem>

export const NoteResult: Story = {
  render: () => {
    const [{ lastItem }] = useArgs()

    return (
      <SearchQuizNoteItem
        documentId={0}
        documentTitle={'제무제표 분석하기'}
        matchingSentence={
          <div>
            ...제품을 기존 제품과 구별할 수 있어야 하며, 전통적인{' '}
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              기초
            </Text>{' '}
            육류, 조개류, 소고기 또는 가금류에 알레르기가 있는 사람들이 세포 기반 제품...
          </div>
        }
        resultType={'document'}
        quizCount={25}
        charCount={15430}
        relativeDirectory={'전체 노트'}
        directoryEmoji="🎯"
        lastItem={lastItem}
      />
    )
  },
}

export const QuizResult: Story = {
  render: () => {
    return (
      <SearchQuizNoteItem
        documentId={1}
        documentTitle={'최근 이슈'}
        matchingSentence={
          <div>
            Q. 육류, 조개류, 소고기 또는 가금류에 알레르기가 있는 사람들이 세포 기반 제품을 시도해보게 하는 방법은
            무엇일까요? A:{' '}
            <Text typo="body-1-bold" color="accent" className="inline-block size-fit">
              기초
            </Text>{' '}
            육류, 조개류, 소고기 또는 가금류에...
          </div>
        }
        resultType={'document'}
        quizCount={25}
        charCount={15430}
        relativeDirectory={'전체 노트'}
        directoryEmoji="🎯"
        lastItem={false}
      />
    )
  },
}
