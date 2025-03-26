import { Meta, StoryObj } from '@storybook/react'

import { SelectCard } from '@/shared/components/cards/select-card'
import { Text } from '@/shared/components/ui/text'

const meta: Meta<typeof SelectCard> = {
  title: 'Card/SelectCard',
  component: SelectCard,
}
export default meta

export const AllCases: StoryObj<typeof SelectCard> = {
  render: () => {
    return (
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center gap-2.5">
          <span>Default</span>
          <SelectCard className="size-[100px] flex-col gap-[4px]">
            <Text typo="h2">{'🤖'}</Text>
            <Text typo="body-1-bold">{'IT·공학'}</Text>
          </SelectCard>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Checked</span>
          <SelectCard className="size-[100px] flex-col gap-[4px]" defaultChecked>
            <Text typo="h2">{'🤖'}</Text>
            <Text typo="body-1-bold">{'IT·공학'}</Text>
          </SelectCard>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Disabled</span>
          <SelectCard className="size-[100px] flex-col gap-[4px]" disabled>
            <Text typo="h2">{'🤖'}</Text>
            <Text typo="body-1-bold">{'IT·공학'}</Text>
          </SelectCard>
        </div>
      </div>
    )
  },
}
