import { Meta, StoryObj } from '@storybook/react'

import { MultipleChoiceOption } from '.'

const meta: Meta<typeof MultipleChoiceOption> = {
  title: 'Quiz/MultipleChoiceOption',
  component: MultipleChoiceOption,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MultipleChoiceOption>

export const Default: Story = {
  render: () => <MultipleChoiceOption label="A" content="정답 내용 입력" state="default" />,
}

export const Selected: Story = {
  render: () => <MultipleChoiceOption label="A" content="정답 내용 입력" state="correct" />,
}

export const Incorrect: Story = {
  render: () => <MultipleChoiceOption label="A" content="정답 내용 입력" state="incorrect" />,
}

export const WithoutLabel: Story = {
  render: () => <MultipleChoiceOption content="정답 내용 입력" state="default" />,
}

export const WithoutIcon: Story = {
  render: () => <MultipleChoiceOption label="A" content="정답 내용 입력" state="correct" showIcon={false} />,
}

export const AllOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <MultipleChoiceOption label="A" content="정답 내용 입력" state="default" />
      <MultipleChoiceOption label="B" content="정답 내용 입력" state="correct" />
      <MultipleChoiceOption label="C" content="정답 내용 입력" state="incorrect" />
    </div>
  ),
}
