import { Meta, StoryObj } from '@storybook/react'

import { TextButton } from '@/shared/components/ui/text-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <div className="p-10">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <div className="flex-center flex-col gap-24">
      <Tooltip>
        <TooltipTrigger asChild>
          <TextButton>Interaction Tooltip Arrow Center</TextButton>
        </TooltipTrigger>
        <TooltipContent arrowPosition="center">설정한 분야의 컬렉션을 홈에서 볼 수 있어요</TooltipContent>
      </Tooltip>

      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <TextButton>Opened Tooltip Arrow Left</TextButton>
        </TooltipTrigger>
        <TooltipContent arrowPosition="left">설정한 분야의 컬렉션을 홈에서 볼 수 있어요</TooltipContent>
      </Tooltip>

      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <TextButton>Opened Tooltip Arrow Right</TextButton>
        </TooltipTrigger>
        <TooltipContent arrowPosition="right">설정한 분야의 컬렉션을 홈에서 볼 수 있어요</TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const ArrowLeft: StoryObj<typeof Tooltip> = {
  render: () => (
    <div className="flex-center">
      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <span></span>
        </TooltipTrigger>
        <TooltipContent arrowPosition="left">설정한 분야의 컬렉션을 홈에서 볼 수 있어요</TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const ArrowRight: StoryObj<typeof Tooltip> = {
  render: () => (
    <div className="flex-center">
      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <span></span>
        </TooltipTrigger>
        <TooltipContent arrowPosition="right">설정한 분야의 컬렉션을 홈에서 볼 수 있어요</TooltipContent>
      </Tooltip>
    </div>
  ),
}
