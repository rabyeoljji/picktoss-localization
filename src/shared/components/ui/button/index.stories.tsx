import { Meta, StoryObj } from "@storybook/react"
import { Button } from "."

// 더미 아이콘 컴포넌트 (size가 sm인 경우에만 사용)
const DummyIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8" />
  </svg>
)

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
}
export default meta

export const AllCases: StoryObj<typeof Button> = {
  render: () => {
    // 업데이트된 Button의 variant 종류
    const variants: Array<
      "primary" | "special" | "secondary1" | "secondary2" | "tertiary"
    > = ["primary", "special", "secondary1", "secondary2", "tertiary"]

    return (
      <div style={{ display: "grid", gap: "40px" }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ textTransform: "capitalize", marginBottom: "16px" }}>
              {variant}
            </h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* lg 사이즈 (아이콘 미포함) */}
              <Button variant={variant} size="lg">
                시작하기
              </Button>

              {/* Loading State */}
              <Button variant={variant} size="lg" data-state="loading">
                시작하기
              </Button>

              {/* md 사이즈 (아이콘 미포함) */}
              <Button variant={variant} size="md">
                시작하기
              </Button>

              {/* sm 사이즈 - 아이콘 없는 경우 */}
              <Button variant={variant} size="sm">
                시작하기
              </Button>

              {/* sm 사이즈 - 왼쪽 아이콘만 */}
              <Button variant={variant} size="sm" left={<DummyIcon />}>
                시작하기
              </Button>

              {/* sm 사이즈 - 오른쪽 아이콘만 */}
              <Button variant={variant} size="sm" right={<DummyIcon />}>
                시작하기
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
