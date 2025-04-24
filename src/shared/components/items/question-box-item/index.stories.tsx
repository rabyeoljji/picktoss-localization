/* eslint-disable react-hooks/rules-of-hooks */
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import QuestionBox from '@/shared/components/items/question-box-item'

const meta: Meta<typeof QuestionBox> = {
  title: 'Item/QuestionBoxItem',
  component: QuestionBox,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-xl bg-gray-100 p-6 flex-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    emoji: { control: 'text' },
    question: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof QuestionBox>

export const Light: Story = {
  render: () => {
    const [{ emoji, question }] = useArgs()

    return <QuestionBox emoji={emoji ?? '👠'} question={question ?? '프로세스는 무엇인가요?'} />
  },
}

export const Dark: Story = {
  render: () => {
    return <QuestionBox emoji={'👠'} question={'프로세스는 무엇인가요?'} color="dark" />
  },
}
