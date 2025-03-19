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

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>다른 폴더로 이동</DrawerTitle>
          <DrawerDescription>This is a sample description for the drawer.</DrawerDescription>
        </DrawerHeader>

        <div>
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

export const WithoutScalingBackground: Story = {
  render: () => (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <button className="rounded-md bg-green-600 px-4 py-2 text-white">Open Drawer (No Scale)</button>
      </DrawerTrigger>

      <DrawerContent height="full">
        <DrawerHeader>
          <DrawerTitle>No Background Scaling</DrawerTitle>
          <DrawerDescription>The background will not scale when the drawer is open.</DrawerDescription>
        </DrawerHeader>

        <div>
          <p>
            This drawer demonstrates the <code>shouldScaleBackground</code> prop set to <code>false</code>.
          </p>
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
