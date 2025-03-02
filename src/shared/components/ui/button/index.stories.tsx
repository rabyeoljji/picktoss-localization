import { Meta, StoryObj } from "@storybook/react"
import { Button } from "."
import { ChevronDown } from "lucide-react"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: "Click Me",
  },
}

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Button {...args} left={<ChevronDown />}>
        Default Button
      </Button>
      <Button {...args} right={<ChevronDown />}>
        Destructive Button
      </Button>
      <Button {...args} variant="outline">
        Outline Button
      </Button>
      <Button {...args} variant="secondary">
        Secondary Button
      </Button>
      <Button {...args} variant="ghost">
        Ghost Button
      </Button>
      <Button {...args} variant="link">
        Link Button
      </Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Button {...args} size="sm">
        Small Button
      </Button>
      <Button {...args} size="default">
        Default Button
      </Button>
      <Button {...args} size="lg">
        Large Button
      </Button>
      <Button {...args} size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </Button>
    </div>
  ),
}
