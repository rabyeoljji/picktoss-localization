import { Meta, StoryObj } from "@storybook/react"
import { Label } from "."

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
}
export default meta

export const Default: StoryObj<typeof Label> = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Label htmlFor="input-example">이메일 주소</Label>
        <input
          id="input-example"
          type="text"
          placeholder="이메일을 입력하세요"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
    )
  },
}

export const CustomStyle: StoryObj<typeof Label> = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Label htmlFor="input-custom" className="text-blue-600">
          사용자 정의 스타일 레이블
        </Label>
        <input
          id="input-custom"
          type="text"
          placeholder="입력하세요"
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
    )
  },
}
