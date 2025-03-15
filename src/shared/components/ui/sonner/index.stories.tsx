import { Meta, StoryObj } from "@storybook/react"
import { Toaster } from "."
import { Button } from "../button"
import { toast } from "sonner"

const meta: Meta = {
  title: "UI/Toast",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="h-[300px] w-[375px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const Default: StoryObj<typeof Toaster> = {
  render: () => (
    <div>
      <Button onClick={() => toast("toast")}>open toast</Button>
    </div>
  ),
}

export const WithActionButton: StoryObj<typeof Toaster> = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toast("toast", {
            action: {
              label: "버튼명",
              onClick: () => {},
            },
          })
        }
      >
        open toast
      </Button>
    </div>
  ),
}

export const WithCancelButton: StoryObj<typeof Toaster> = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toast("toast", {
            cancel: {
              label: "X",
              onClick: () => {},
            },
          })
        }
      >
        open toast
      </Button>
    </div>
  ),
}

export const WithLongTitle: StoryObj<typeof Toaster> = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toast(
            "toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast toast",
          )
        }
      >
        open toast
      </Button>
    </div>
  ),
}
