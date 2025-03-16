import { useState } from "react"
import { Meta, StoryObj } from "@storybook/react"
import { Switch } from "."

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
}
export default meta

export const AllCases: StoryObj<typeof Switch> = {
  render: () => {
    const [checkedMd, setCheckedMd] = useState(false)
    const [checkedSm, setCheckedSm] = useState(false)

    return (
      <div className="flex flex-col gap-8">
        {/* MD Size */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Switch (Size: md)</h3>
          <div className="flex flex-col gap-2">
            <span className="text-sm">Interactive</span>
            <Switch size="md" checked={checkedMd} onCheckedChange={setCheckedMd} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm">Default Checked</span>
            <Switch size="md" defaultChecked />
          </div>
        </div>

        {/* SM Size */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Switch (Size: sm)</h3>
          <div className="flex flex-col gap-2">
            <span className="text-sm">Interactive</span>
            <Switch size="sm" checked={checkedSm} onCheckedChange={setCheckedSm} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm">Default Checked</span>
            <Switch size="sm" defaultChecked />
          </div>
        </div>
      </div>
    )
  },
}
