import React from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { RadioGroup, RadioGroupItem } from '.'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
}
export default meta

export const AllCases: StoryObj<typeof RadioGroup> = {
  render: () => {
    const [value, setValue] = React.useState('option1')

    return (
      <div className="flex flex-col gap-10">
        {/* 기본 상태 */}
        <div>
          <h3 className="mb-4">Default</h3>
          <RadioGroup value={value} onValueChange={setValue} className="flex gap-2">
            <RadioGroupItem value="option1" />
            <RadioGroupItem value="option2" />
            <RadioGroupItem value="option3" />
          </RadioGroup>
        </div>

        {/* 비활성화 상태 */}
        <div>
          <h3 className="mb-4">Disabled</h3>
          <RadioGroup value={value} onValueChange={setValue} className="flex gap-2">
            <RadioGroupItem value="disabled" disabled />
          </RadioGroup>
        </div>
      </div>
    )
  },
}
