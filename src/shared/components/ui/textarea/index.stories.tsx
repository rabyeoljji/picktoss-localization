import { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "."

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const AllCases: StoryObj<typeof Textarea> = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "500px" }}>
      {/* Case 1: With label and helper text */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0 }}>Case 1: With label and helper text</p>
        <Textarea
          label="Description"
          placeholder="Enter a detailed description..."
          helperText="Please provide as much detail as possible."
        />
      </div>
      <hr />

      {/* Case 2: With label and error state */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0 }}>Case 2: With label and error state</p>
        <Textarea
          label="Feedback"
          placeholder="Enter your feedback..."
          helperText="Feedback cannot be empty."
          hasError
        />
      </div>
      <hr />

      {/* Case 3: Without label but with helper text */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0 }}>Case 3: Without label but with helper text</p>
        <Textarea placeholder="No label provided" helperText="This field can work without a label" />
      </div>
      <hr />

      {/* Case 4: Without label and helper text */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0 }}>Case 4: Without label and helper text</p>
        <Textarea placeholder="Just a basic textarea" />
      </div>
      <hr />

      {/* Case 5: Disabled textarea */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0 }}>Case 5: Disabled textarea</p>
        <Textarea placeholder="Disabled textarea" disabled helperText="This field is not editable" />
      </div>
    </div>
  ),
}
