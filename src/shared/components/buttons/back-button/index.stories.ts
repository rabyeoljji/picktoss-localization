import type { Meta, StoryObj } from '@storybook/react'

import { BackButton } from './index'

const meta = {
  title: 'Buttons/BackButton',
  component: BackButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BackButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'back',
  },
}

export const Close: Story = {
  args: {
    type: 'close',
  },
}
