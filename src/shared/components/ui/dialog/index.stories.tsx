import { Meta, StoryObj } from "@storybook/react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCTA,
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
          <DialogDescription>This is a description for the dialog.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div>IM Body</div>
        </div>

        <DialogFooter>
          <DialogCTA label="나가기" onClick={() => {}} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithoutBody: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a description for the dialog.</DialogDescription>
        </DialogHeader>

        <div className="py-4" />

        <DialogFooter>
          <DialogCTA label="나가기" onClick={() => {}} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const CtaWithClose: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a description for the dialog.</DialogDescription>
        </DialogHeader>

        <div className="py-4">Main</div>

        <DialogFooter>
          <DialogCTA label="나가기" onClick={() => {}} hasClose />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
export const CtaB: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a description for the dialog.</DialogDescription>
        </DialogHeader>

        <div className="py-4">Main</div>

        <DialogFooter>
          <DialogCTA.B
            primaryButtonLabel="나가기"
            secondaryButtonLabel="닫기"
            onPrimaryButtonClick={() => {}}
            onSecondaryButtonClick={() => {}}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
