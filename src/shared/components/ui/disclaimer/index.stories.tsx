import { Meta, StoryObj } from '@storybook/react'

import { Disclaimer, DisclaimerContent, DisclaimerTrigger } from '@/shared/components/ui/disclaimer'
import { TextButton } from '@/shared/components/ui/text-button'

const meta: Meta<typeof Disclaimer> = {
  title: 'UI/Disclaimer',
  component: Disclaimer,
  decorators: [
    (Story) => (
      <div className="p-10">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof Disclaimer> = {
  render: () => (
    <div className="flex-center flex-col gap-24">
      <Disclaimer>
        <DisclaimerTrigger asChild>
          <TextButton>Disclaimer</TextButton>
        </DisclaimerTrigger>
        <DisclaimerContent side="bottom" sideOffset={7}>
          <div>밤 12시 전에 10문제 이상 풀면 연속일이 유지돼요.</div>
        </DisclaimerContent>
      </Disclaimer>
    </div>
  ),
}
