import { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "."

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
}
export default meta

export const Default: StoryObj<typeof Textarea> = {
  render: () => {
    return (
      <div style={{ maxWidth: "400px", margin: "20px" }}>
        <Textarea placeholder="텍스트를 입력하세요..." />
      </div>
    )
  },
}

export const WithDefaultValue: StoryObj<typeof Textarea> = {
  render: () => {
    return (
      <div style={{ maxWidth: "400px", margin: "20px" }}>
        <Textarea defaultValue="기본 텍스트 내용" />
      </div>
    )
  },
}

export const Disabled: StoryObj<typeof Textarea> = {
  render: () => {
    return (
      <div style={{ maxWidth: "400px", margin: "20px" }}>
        <Textarea placeholder="비활성화 상태" disabled />
      </div>
    )
  },
}
