/* eslint-disable react-hooks/rules-of-hooks */
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { subDays } from 'date-fns'

import NotificationItem from '@/shared/components/items/notification-item'

const meta: Meta<typeof NotificationItem> = {
  title: 'Item/NotificationItem',
  component: NotificationItem,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: { control: 'select', options: ['GENERAL', 'STAR_REWARD', 'UPDATE_NEWS'] },
    title: { control: 'text' },
    receivedTime: { control: 'date' },
    lastItem: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof NotificationItem>

export const General: Story = {
  render: () => {
    const today = new Date().toISOString()
    const [{ type, title, receivedTime, lastItem }] = useArgs()

    return (
      <NotificationItem
        type={type ?? 'GENERAL'}
        title={title ?? '일반 알림입니다'}
        receivedTime={(receivedTime && new Date(receivedTime).toISOString()) ?? today}
        lastItem={lastItem ?? false}
      />
    )
  },
}

export const Update: Story = {
  render: () => {
    const today = new Date()
    const threeDaysAgo = subDays(today, 3).toISOString()

    return (
      <NotificationItem type="UPDATE_NEWS" title="노트 하이라이트 기능이 추가되었어요" receivedTime={threeDaysAgo} />
    )
  },
}

export const StarReward: Story = {
  render: () => {
    const today = new Date()
    const SevenDaysAgo = subDays(today, 7).toISOString()

    return (
      <NotificationItem type="STAR_REWARD" title="친구 초대 보상으로 별 50개를 받았어요" receivedTime={SevenDaysAgo} />
    )
  },
}
