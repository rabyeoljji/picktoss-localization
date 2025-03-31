import { Meta, StoryObj } from '@storybook/react'

import FixedBottom from '@/shared/components/fixed-bottom'
import { Button } from '@/shared/components/ui/button'

const meta: Meta<typeof FixedBottom> = {
  title: 'Component/FixedBottom',
  component: FixedBottom,
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

export const Default: StoryObj<typeof FixedBottom> = {
  render: () => (
    <FixedBottom>
      <Button>퀴즈 만들기</Button>
    </FixedBottom>
  ),
}
