import { Meta, StoryObj } from "@storybook/react"
import { Input } from "."
import { SquareButton } from "../square-button"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const AllCases: StoryObj<typeof Input> = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" }}>
      {/* With label and helper text */}
      <Input
        label="Name"
        placeholder="Enter your full name"
        type="text"
        helperText="Please enter your first and last name"
      />

      {/* With label and error */}
      <Input
        label="Email"
        placeholder="Enter a valid email address"
        type="email"
        helperText="This email is invalid"
        hasError
      />

      {/* With right */}
      <Input
        label="Verify"
        placeholder="Enter a valid code"
        type="email"
        right={
          <SquareButton variant="tertiary" size="sm">
            인증하기
          </SquareButton>
        }
      />

      {/* Without label but with helper text */}
      <Input placeholder="No label provided" type="text" helperText="This field can work without a label" />

      {/* Without label and helper text */}
      <Input placeholder="Just a basic input" type="text" />

      <Input placeholder="Disabled" type="text" disabled />
    </div>
  ),
}
