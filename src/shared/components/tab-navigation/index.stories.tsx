import { Meta, StoryObj } from '@storybook/react'

import { TabNavigation } from '.'

const meta: Meta<typeof TabNavigation> = {
  title: 'Component/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="h-[100px] w-[375px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof TabNavigation> = {
  render: () => <TabNavigation activeTab="데일리" />,
}
