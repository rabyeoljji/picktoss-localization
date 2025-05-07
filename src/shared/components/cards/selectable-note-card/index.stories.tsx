import { Meta, StoryObj } from '@storybook/react'

import { SelectableNoteCard } from '@/shared/components/cards/selectable-note-card'

const meta: Meta<typeof SelectableNoteCard> = {
  title: 'Card/SelectableNote',
  component: SelectableNoteCard,
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

export const Default: StoryObj<typeof SelectableNoteCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <SelectableNoteCard>
          <SelectableNoteCard.Left content="📄" />

          <SelectableNoteCard.Content>
            <SelectableNoteCard.Header title="금융투자분석사 노트정리" />
            <SelectableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SelectableNoteCard.Detail quizCount={28} />
          </SelectableNoteCard.Content>
        </SelectableNoteCard>
      </div>
    )
  },
}

export const Selected: StoryObj<typeof SelectableNoteCard> = {
  render: () => {
    return (
      <div className="p-10 flex-center">
        <SelectableNoteCard isSelected>
          <SelectableNoteCard.Left content="📄" />

          <SelectableNoteCard.Content>
            <SelectableNoteCard.Header title="금융투자분석사 노트정리" />
            <SelectableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SelectableNoteCard.Detail quizCount={28} />
          </SelectableNoteCard.Content>
        </SelectableNoteCard>
      </div>
    )
  },
}
