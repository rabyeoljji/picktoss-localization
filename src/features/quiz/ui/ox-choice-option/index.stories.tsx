import { Meta, StoryObj } from '@storybook/react'

import { OXChoiceOption } from '.'

const meta: Meta<typeof OXChoiceOption> = {
  title: 'Quiz/OXChoiceOption',
  component: OXChoiceOption,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '퀴즈에서 사용되는 O/X 선택지 컴포넌트입니다. O 또는 X 타입과 선택 상태에 따라 다양한 스타일로 표시됩니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof OXChoiceOption>

export const OOption: Story = {
  args: {
    O: true,
    X: false,
    isCorrect: true,
    selectedOption: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'O 타입 선택지입니다. 파란색 배경과 O 아이콘으로 표시됩니다.',
      },
    },
  },
}

export const XOption: Story = {
  args: {
    O: false,
    X: true,
    isCorrect: false,
    selectedOption: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'X 타입 선택지입니다. 주황색 배경과 X 아이콘으로 표시됩니다.',
      },
    },
  },
}

export const CorrectSelected: Story = {
  args: {
    O: true,
    X: false,
    isCorrect: true,
    selectedOption: 'correct',
  },
  parameters: {
    docs: {
      description: {
        story: '정답인 선택지를 선택한 상태입니다. 녹색 배경과 체크 스타일을 표시합니다.',
      },
    },
  },
}

export const IncorrectSelected: Story = {
  args: {
    O: false,
    X: true,
    isCorrect: false,
    selectedOption: 'incorrect',
  },
  parameters: {
    docs: {
      description: {
        story: '오답인 선택지를 선택한 상태입니다. 빨간색 배경과 X 스타일을 표시합니다.',
      },
    },
  },
}

export const CorrectButNotSelected: Story = {
  args: {
    O: true,
    X: false,
    isCorrect: true,
    selectedOption: 'incorrect',
  },
  parameters: {
    docs: {
      description: {
        story: '정답이지만 사용자가 다른 선택지를 선택한 경우입니다. 정답임을 나타내는 스타일로 표시됩니다.',
      },
    },
  },
}

export const WithCustomClassName: Story = {
  args: {
    O: true,
    X: false,
    isCorrect: true,
    selectedOption: null,
    className: 'shadow-lg border-2 border-gray-200',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 클래스를 적용한 O 타입 선택지입니다.',
      },
    },
  },
}

export const OXOptions: Story = {
  render: () => (
    <div className="flex gap-4">
      <OXChoiceOption 
        O={true} 
        X={false} 
        isCorrect={true}
        selectedOption={null} 
        className="w-[165px]"
      />
      <OXChoiceOption 
        O={false} 
        X={true} 
        isCorrect={false}
        selectedOption={null}
        className="w-[165px]"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'O/X 선택지를 함께 표시합니다.',
      },
    },
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <OXChoiceOption 
        O={true} 
        X={false} 
        isCorrect={true}
        selectedOption={null}
        className="w-[165px]"
      />
      <OXChoiceOption 
        O={false} 
        X={true} 
        isCorrect={false}
        selectedOption={null}
        className="w-[165px]"
      />
      <OXChoiceOption 
        O={true} 
        X={false} 
        isCorrect={true}
        selectedOption="correct"
        className="w-[165px]"
      />
      <OXChoiceOption 
        O={false} 
        X={true} 
        isCorrect={false}
        selectedOption="incorrect" 
        className="w-[165px]"
      />
      <OXChoiceOption 
        O={true} 
        X={false} 
        isCorrect={true}
        selectedOption="incorrect"
        className="w-[165px]"
      />
      <OXChoiceOption 
        O={false} 
        X={true} 
        isCorrect={false}
        selectedOption="correct" 
        className="w-[165px]"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 가능한 상태의 O/X 선택지를 표시합니다.',
      },
    },
  },
}