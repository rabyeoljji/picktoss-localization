import { Meta, StoryObj } from '@storybook/react'

import { Selectbox } from '@/shared/components/ui/selectbox'

const meta: Meta<typeof Selectbox> = {
  title: 'UI/Selectbox',
  component: Selectbox,
  decorators: [
    (Story) => (
      <div className="w-full flex-center">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const AllCases: StoryObj<typeof Selectbox> = {
  render: () => {
    return (
      <div className="w-xl flex flex-col items-center gap-10">
        <div className="w-full flex flex-col items-center gap-2.5">
          <span>Default</span>
          <Selectbox>생성한 결과물이 만족스럽지 않아요</Selectbox>
        </div>
        <div className="w-full flex flex-col items-center gap-2.5">
          <span>Checked</span>
          <Selectbox defaultChecked>생성한 결과물이 만족스럽지 않아요</Selectbox>
        </div>
        <div className="w-full flex flex-col items-center gap-2.5">
          <span>Disabled</span>
          <Selectbox disabled>생성한 결과물이 만족스럽지 않아요</Selectbox>
        </div>
      </div>
    )
  },
}
