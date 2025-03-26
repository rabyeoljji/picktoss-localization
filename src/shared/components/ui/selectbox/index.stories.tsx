import { Meta, StoryObj } from '@storybook/react'

import { Selectbox } from '@/shared/components/ui/selectbox'

const meta: Meta<typeof Selectbox> = {
  title: 'UI/Selectbox',
  component: Selectbox,
}
export default meta

export const AllCases: StoryObj<typeof Selectbox> = {
  render: () => {
    return (
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center gap-2.5">
          <span>Default</span>
          <Selectbox />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Checked</span>
          <Selectbox defaultChecked />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Disabled</span>
          <Selectbox disabled />
        </div>
      </div>
    )
  },
}
