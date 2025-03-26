/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'

import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
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

/**
 * 선택 가능한 UI 컴포넌트로, 라디오 버튼이나 체크박스와 연계하여 사용 가능
 */
export const AllCases: StoryObj<typeof Selectbox> = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('1')

    return (
      <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
        <div className="w-xl flex flex-col items-center gap-10">
          <div className="w-full flex flex-col items-center gap-2.5">
            <span>Default</span>
            <Selectbox
              relativeItem={<RadioGroupItem value={'0'} id={`type-0`} className="peer sr-only" />}
              htmlFor={`type-0`}
              selected={selectedValue === '0'}
              onSelect={() => setSelectedValue('0')}
            >
              생성한 결과물이 만족스럽지 않아요
            </Selectbox>
          </div>
          <div className="w-full flex flex-col items-center gap-2.5">
            <span>Selected</span>
            <Selectbox
              relativeItem={<RadioGroupItem value={'1'} id={`type-1`} className="peer sr-only" />}
              htmlFor={`type-1`}
              selected={selectedValue === '1'}
              onSelect={() => setSelectedValue('1')}
            >
              생성한 결과물이 만족스럽지 않아요
            </Selectbox>
          </div>
          <div className="w-full flex flex-col items-center gap-2.5">
            <span>Disabled</span>
            <Selectbox
              relativeItem={<RadioGroupItem value={'2'} id={`type-2`} className="peer sr-only" />}
              htmlFor={`type-2`}
              selected={selectedValue === '2'}
              onSelect={() => setSelectedValue('2')}
              disabled
            >
              생성한 결과물이 만족스럽지 않아요
            </Selectbox>
          </div>
        </div>
      </RadioGroup>
    )
  },
}
