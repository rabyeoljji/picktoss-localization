import { Meta, StoryObj } from "@storybook/react"
import { SquareButton } from "."

// 더미 아이콘 컴포넌트 (모든 사이즈에서 사용)
const DummyIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8" />
  </svg>
)

const meta: Meta<typeof SquareButton> = {
  title: "UI/SquareButton",
  component: SquareButton,
}
export default meta

export const AllCases: StoryObj<typeof SquareButton> = {
  render: () => {
    const variants: Array<"primary" | "secondary" | "tertiary"> = ["primary", "secondary", "tertiary"]
    const sizes: Array<"lg" | "md" | "sm"> = ["lg", "md", "sm"]

    return (
      <div style={{ display: "grid", gap: "40px" }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ textTransform: "capitalize", marginBottom: "16px" }}>{variant}</h3>
            {sizes.map((size) => (
              <div key={size}>
                <h4 style={{ textTransform: "capitalize", marginBottom: "8px" }}>{size}</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {/* 기본 버튼 */}
                  <SquareButton variant={variant} size={size}>
                    전체보기
                  </SquareButton>
                  {/* 왼쪽 아이콘 */}
                  {size !== "sm" && (
                    <SquareButton variant={variant} size={size} left={<DummyIcon />}>
                      전체보기
                    </SquareButton>
                  )}
                  {/* 오른쪽 아이콘 */}
                  {size !== "sm" && (
                    <SquareButton variant={variant} size={size} right={<DummyIcon />}>
                      전체보기
                    </SquareButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
}
