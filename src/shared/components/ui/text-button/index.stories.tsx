import { Meta, StoryObj } from "@storybook/react"
import { TextButton } from "." // 실제 경로에 맞게 수정하세요.

// 더미 아이콘 컴포넌트 (size가 sm인 경우에만 사용)
const DummyIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8" />
  </svg>
)

const meta: Meta<typeof TextButton> = {
  title: "UI/TextButton",
  component: TextButton,
}
export default meta

export const AllCases: StoryObj<typeof TextButton> = {
  render: () => {
    // TextButton의 variant 종류
    const variants: Array<"default" | "primary" | "critical" | "secondary"> = [
      "default",
      "primary",
      "critical",
      "secondary",
    ]

    return (
      <div style={{ display: "grid", gap: "40px" }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ textTransform: "capitalize", marginBottom: "16px" }}>{variant}</h3>
            <div className="flex flex-col gap-5">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* lg 사이즈 (아이콘 미포함) */}
                <TextButton variant={variant} size="lg">
                  텍스트 버튼
                </TextButton>

                {/* lg 사이즈 (아이콘 포함) */}
                <TextButton variant={variant} size="lg" left={<DummyIcon />}>
                  텍스트 버튼
                </TextButton>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* md 사이즈 (아이콘 미포함) */}
                <TextButton variant={variant} size="md">
                  텍스트 버튼
                </TextButton>

                {/* md 사이즈 (아이콘 포함) */}
                <TextButton variant={variant} size="md" left={<DummyIcon />}>
                  텍스트 버튼
                </TextButton>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* sm 사이즈 - (아이콘 미포함) */}
                <TextButton variant={variant} size="sm">
                  텍스트 버튼
                </TextButton>

                {/* sm 사이즈 - (아이콘 포함) */}
                <TextButton variant={variant} size="sm" left={<DummyIcon />}>
                  텍스트 버튼
                </TextButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
