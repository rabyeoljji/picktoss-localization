import { Meta, StoryObj } from '@storybook/react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '.'
import { Button } from '../button'

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

type Story = StoryObj<typeof Drawer>

export const Full: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
      </DrawerTrigger>

      <DrawerContent height="full">
        <DrawerHeader>
          <DrawerTitle>다른 폴더로 이동</DrawerTitle>
          <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
        </DrawerHeader>

        <div>
          <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
          <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Large: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
      </DrawerTrigger>

      <DrawerContent height="lg">
        <DrawerHeader>
          <DrawerTitle>다른 폴더로 이동</DrawerTitle>
          <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
        </DrawerHeader>

        <div>
          <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
          <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Medium: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
      </DrawerTrigger>

      <DrawerContent height="md">
        <DrawerHeader>
          <DrawerTitle>다른 폴더로 이동</DrawerTitle>
          <DrawerDescription>노트를 이동시킬 폴더를 선택해주세요.</DrawerDescription>
        </DrawerHeader>

        <div>
          <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
          <p>Here is some content inside the drawer. You can place forms, lists, or any other UI elements here.</p>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Small: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
      </DrawerTrigger>

      <DrawerContent height="sm">
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>버튼</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
