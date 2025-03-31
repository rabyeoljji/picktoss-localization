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
import { Text } from '../text'

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

export const ModalDrawer: Story = {
  render: () => (
    <Drawer modal={true}>
      <DrawerTrigger asChild>
        <Button>Modal Drawer</Button>
      </DrawerTrigger>
      <DrawerContent height="md">
        <DrawerHeader>
          <DrawerTitle>Modal Drawer</DrawerTitle>
          <DrawerDescription>This drawer is modal (modal=true)</DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <Text typo="body-1-regular">
            A modal drawer prevents interaction with the content behind it. The background content is inaccessible until
            the drawer is closed.
          </Text>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const NonModalDrawer: Story = {
  render: () => (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <Button>Non-Modal Drawer</Button>
      </DrawerTrigger>
      <DrawerContent height="md">
        <DrawerHeader>
          <DrawerTitle>Non-Modal Drawer</DrawerTitle>
          <DrawerDescription>This drawer is non-modal (modal=false)</DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <Text typo="body-1-regular">
            A non-modal drawer allows interaction with content behind it. The background content remains accessible
            while the drawer is open.
          </Text>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
