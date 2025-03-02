import { Meta, StoryObj } from "@storybook/react";
import { SystemDialog } from ".";
import { Text } from "@/shared/components/ui/text";

const meta: Meta<typeof SystemDialog> = {
  title: "Component/SystemDialog",
  component: SystemDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof SystemDialog>;

export const Default: Story = {
  render: () => (
    <SystemDialog
      trigger={<button>Open Dialog</button>}
      title="타이틀"
      content={<input className="border border-gray-400" />}
      onConfirm={() => {}}
    />
  ),
};

export const CriticalInput: Story = {
  render: () => (
    <SystemDialog
      trigger={<button>Open Dialog</button>}
      title="타이틀"
      variant="critical"
      content={
        <Text typo="body1-medium" color="secondary">
          전공 공부 폴더와{" "}
          <span className="text-text-critical">14개의 노트</span>가 모두
          삭제됩니다
        </Text>
      }
      cancelLabel="닫기"
      confirmLabel="확인"
      onConfirm={() => {}}
    />
  ),
};
