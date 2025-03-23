/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { ImgRoundCorrect } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'

import { PeekingDrawer, PeekingDrawerContent } from './index'

const meta: Meta<typeof PeekingDrawer> = {
  title: 'Drawers/PeekingDrawer',
  component: PeekingDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-[400px] w-full p-4 bg-gray-100">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PeekingDrawer>

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <PeekingDrawer
        open={open}
        onOpenChange={setOpen}
        className="bg-surface-1"
        peekContent={<div />}
        fixedContent={
          <div className="h-[100px]">
            <Button className="w-full">다음</Button>
          </div>
        }
      >
        <PeekingDrawerContent>
          <div className="w-full px-5">
            <ImgRoundCorrect />
          </div>
        </PeekingDrawerContent>
      </PeekingDrawer>
    )
  },
}
