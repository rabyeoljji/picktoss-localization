import { Meta, StoryObj } from '@storybook/react'

import { Orderbox } from '.'

const meta: Meta<typeof Orderbox> = {
  title: 'UI/Orderbox',
  component: Orderbox,
}
export default meta

export const AllCases: StoryObj<typeof Orderbox> = {
  render: () => {
    return (
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center gap-2.5">
          <span>Default</span>
          <Orderbox />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Checked</span>
          <Orderbox defaultChecked order={1} />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Disabled</span>
          <Orderbox disabled />
        </div>
      </div>
    )
  },
}
