import { Meta, StoryObj } from '@storybook/react'

import { MultipleChoiceOption } from '.'

const meta: Meta<typeof MultipleChoiceOption> = {
  title: 'Quiz/MultipleChoiceOption',
  component: MultipleChoiceOption,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '퀴즈에서 사용되는 객관식 선택지 컴포넌트입니다. 선택 상태와 정답 여부에 따라 다양한 스타일로 표시됩니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MultipleChoiceOption>

export const Unselected: Story = {
  args: {
    label: 'A',
    option: '선택지 내용입니다',
    selectedOption: null,
    isCorrect: true,
  },
  parameters: {
    docs: {
      description: {
        story: '아직 선택되지 않은 상태입니다. 선택지 레이블과 내용이 기본 스타일로 표시됩니다.',
      },
    },
  },
}

export const SelectedAndCorrect: Story = {
  args: {
    label: 'A',
    option: '정답 선택지 내용입니다',
    selectedOption: '정답 선택지 내용입니다',
    isCorrect: true,
  },
  parameters: {
    docs: {
      description: {
        story: '선택한 선택지가 정답인 경우입니다. 녹색 배경과 체크 아이콘으로 표시됩니다.',
      },
    },
  },
}

export const SelectedAndIncorrect: Story = {
  args: {
    label: 'B',
    option: '오답 선택지 내용입니다',
    selectedOption: '오답 선택지 내용입니다',
    isCorrect: false,
  },
  parameters: {
    docs: {
      description: {
        story: '선택한 선택지가 오답인 경우입니다. 빨간색 배경과 X 아이콘으로 표시됩니다.',
      },
    },
  },
}

export const CorrectButNotSelected: Story = {
  args: {
    label: 'C',
    option: '정답이지만 선택하지 않은 내용입니다',
    selectedOption: '다른 선택지를 선택했습니다',
    isCorrect: true,
  },
  parameters: {
    docs: {
      description: {
        story: '정답이지만 사용자가 다른 선택지를 선택한 경우입니다. 정답임을 나타내는 스타일로 표시됩니다.',
      },
    },
  },
}

export const AllOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <MultipleChoiceOption 
        label="A" 
        option="아직 선택되지 않은 상태" 
        selectedOption={null} 
        isCorrect={true} 
      />
      <MultipleChoiceOption 
        label="B" 
        option="선택한 정답" 
        selectedOption="선택한 정답" 
        isCorrect={true} 
      />
      <MultipleChoiceOption 
        label="C" 
        option="선택한 오답" 
        selectedOption="선택한 오답" 
        isCorrect={false} 
      />
      <MultipleChoiceOption 
        label="D" 
        option="정답이지만 선택하지 않음" 
        selectedOption="다른 선택지" 
        isCorrect={true} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '가능한 모든 상태의 선택지를 한 번에 보여줍니다.',
      },
    },
  },
}
