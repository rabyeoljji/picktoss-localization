import { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "."

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
}
export default meta

export const AllCases: StoryObj<typeof Checkbox> = {
  render: () => {
    return (
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center gap-2.5">
          <span>Default</span>
          <Checkbox />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Checked</span>
          <Checkbox defaultChecked />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <span>Disabled</span>
          <Checkbox disabled />
        </div>
      </div>
    )
  },
}
