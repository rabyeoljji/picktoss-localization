import { Meta, StoryObj } from "@storybook/react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "."

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description for the dialog.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>Your dialog content goes here.</p>
        </div>
        <DialogFooter>
          <DialogClose>Close Dialog</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
