import { Meta, StoryObj } from "@storybook/react"
import { Input } from "."

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
}
export default meta

export const AllCases: StoryObj<typeof Input> = {
  render: () => {
    return (
      <div style={{ display: "grid", gap: "20px", maxWidth: "400px" }}>
        {/* 기본 텍스트 입력 (required 상태 포함) */}
        <Input label="이름" placeholder="이름을 입력하세요" type="text" helperText="이름을 입력해주세요." required />

        {/* 비밀번호 입력 */}
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          type="password"
          helperText="최소 8자 이상 입력해주세요."
        />

        {/* 에러 상태 */}
        <Input
          label="이메일"
          placeholder="이메일을 입력하세요"
          value="error text"
          type="email"
          helperText="유효한 이메일 주소를 입력해주세요."
          hasError
        />

        {/* 비활성화 상태 */}
        <Input
          label="전화번호"
          placeholder="전화번호를 입력하세요"
          type="tel"
          helperText="현재 입력할 수 없는 상태입니다."
          disabled
        />
      </div>
    )
  },
}
