/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'

import { AlertDrawer } from '.'

const meta: Meta<typeof AlertDrawer> = {
  title: 'Drawers/AlertDrawer',
  component: AlertDrawer,
  parameters: {
    docs: {
      page: null,
    },
  },
}

export default meta

type Story = StoryObj<typeof AlertDrawer>

export const TitleOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Title Only</Button>
        <AlertDrawer
          open={open}
          onOpenChange={setOpen}
          title="Only Title is Present"
          body={
            <div className="py-6">
              <Text typo="body-1-regular">This drawer only has a title in its header.</Text>
              <Text typo="body-1-regular" className="mt-4">
                The body content can be customized as needed.
              </Text>
            </div>
          }
        />
      </div>
    )
  },
}

export const TitleAndDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Title & Description</Button>
        <AlertDrawer
          open={open}
          onOpenChange={setOpen}
          title="Drawer with Title and Description"
          description="This drawer has both a title and a description in its header section."
          body={
            <div className="py-6">
              <Text typo="body-1-regular">This drawer has both a title and description.</Text>
              <Text typo="body-1-regular" className="mt-4">
                The header can help users understand the purpose of the drawer.
              </Text>
            </div>
          }
        />
      </div>
    )
  },
}

export const CloseButtonOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Close Button Only</Button>
        <AlertDrawer
          open={open}
          onOpenChange={setOpen}
          hasClose={true}
          body={
            <div className="py-6">
              <Text typo="body-1-regular" className="text-lg font-bold">
                No Title, Only Close Button
              </Text>
              <Text typo="body-1-regular" className="mt-4">
                This drawer has no title or description, but has a close button in the header.
              </Text>
              <Text typo="body-1-regular" className="mt-4">
                Since hasClose is true, there is no footer.
              </Text>
            </div>
          }
        />
      </div>
    )
  },
}

export const NoCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>No Close Button</Button>
        <AlertDrawer
          open={open}
          onOpenChange={setOpen}
          hasClose={false}
          body={
            <div className="py-6">
              <Text typo="body-1-regular" className="text-lg font-bold">
                No Close Button in Header
              </Text>
              <Text typo="body-1-regular" className="mt-4">
                This drawer has no close button in the header.
              </Text>
              <Text typo="body-1-regular" className="mt-4">
                Since hasClose is false, there is a close button in the footer instead.
              </Text>
            </div>
          }
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          }
        />
      </div>
    )
  },
}

export const DifferentSizes: Story = {
  render: () => {
    const [openSm, setOpenSm] = useState(false)
    const [openMd, setOpenMd] = useState(false)
    const [openLg, setOpenLg] = useState(false)
    const [openFull, setOpenFull] = useState(false)

    return (
      <div className="flex flex-col gap-4">
        <Button onClick={() => setOpenSm(true)}>Small Drawer</Button>
        <Button onClick={() => setOpenMd(true)}>Medium Drawer</Button>
        <Button onClick={() => setOpenLg(true)}>Large Drawer</Button>
        <Button onClick={() => setOpenFull(true)}>Full Drawer</Button>

        <AlertDrawer
          open={openSm}
          onOpenChange={setOpenSm}
          height="sm"
          title="Small Drawer"
          body={
            <div>
              <Text typo="body-1-regular">Small height drawer content</Text>
            </div>
          }
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpenSm(false)}>Close</Button>
            </div>
          }
        />

        <AlertDrawer
          open={openMd}
          onOpenChange={setOpenMd}
          height="md"
          title="Medium Drawer"
          body={
            <div>
              <Text typo="body-1-regular">Medium height drawer content</Text>
            </div>
          }
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpenMd(false)}>Close</Button>
            </div>
          }
        />

        <AlertDrawer
          open={openLg}
          onOpenChange={setOpenLg}
          height="lg"
          title="Large Drawer"
          body={
            <div>
              <Text typo="body-1-regular">Large height drawer content</Text>
            </div>
          }
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpenLg(false)}>Close</Button>
            </div>
          }
        />

        <AlertDrawer
          open={openFull}
          onOpenChange={setOpenFull}
          height="full"
          title="Full Drawer"
          body={
            <div>
              <Text typo="body-1-regular">Full height drawer content</Text>
            </div>
          }
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpenFull(false)}>Close</Button>
            </div>
          }
        />
      </div>
    )
  },
}
