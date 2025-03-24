import type { Meta, StoryObj } from '@storybook/react'

import { NoResults } from './index'

/**
 * 검색 결과가 없을 때 보여주는 컴포넌트
 */
const meta = {
  title: 'Entities/Search/NoResults',
  component: NoResults,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-[100px] w-[375px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoResults>

export default meta

type Story = StoryObj<typeof meta>

/**
 * 기본 상태의 NoResults 컴포넌트
 */
export const Default: Story = {
  args: {},
  render: () => <NoResults />,
}

/**
 * 모바일 환경에서의 NoResults 컴포넌트
 */
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <NoResults />,
}
