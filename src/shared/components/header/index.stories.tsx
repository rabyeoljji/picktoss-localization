import type { Meta, StoryObj } from '@storybook/react'

import { Header } from '.'

const meta = {
  title: 'Component/Header',
  component: Header,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-gray-300 p-4">
        <div className="h-[54px] w-[375px] bg-surface-1">{Story()}</div>
      </div>
    ),
  ],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '타이틀',
  },
}

export const WithBackButton: Story = {
  args: {
    left: 'back',
    title: '뒤로가기 버튼',
  },
}

export const WithCloseButton: Story = {
  args: {
    left: 'close',
    title: '닫기 버튼',
  },
}
