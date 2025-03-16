import { Meta, StoryObj } from '@storybook/react'

import { IcCheck, IcDelete } from '@/shared/assets/icon'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '.'

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <div className="p-[50px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof DropdownMenu> = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border p-3">Open Menu</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem right={<IcCheck />}>Item 1</DropdownMenuItem>
        <DropdownMenuItem right={<IcCheck />}>Item 2</DropdownMenuItem>
        <DropdownMenuItem color="critical" right={<IcDelete />}>
          Item 3
        </DropdownMenuItem>
        <DropdownMenuItem disabled color="critical" right={<IcDelete />}>
          Item 4
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
