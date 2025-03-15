import { Meta, StoryObj } from "@storybook/react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "."
import { Badge, Check } from "lucide-react"

const meta: Meta<typeof DropdownMenu> = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
}
export default meta

export const Default: StoryObj<typeof DropdownMenu> = {
  render: () => <SimpleDropdown />,
}

function SimpleDropdown() {
  return (
    <div style={{ padding: "50px" }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="border p-3">Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem right={<Check />}>Item 1</DropdownMenuItem>
          <DropdownMenuItem right={<Check />}>Item 2</DropdownMenuItem>
          <DropdownMenuItem color="critical" right={<Badge />}>
            Item 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
