import { useState } from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { QuizCard } from '.'

const meta: Meta<typeof QuizCard> = {
  title: 'Quiz/QuizCard',
  component: QuizCard,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const MultipleChoiceQuizCard: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={1} right={<button className="text-[0.8rem]">Hint</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.Multiple>
            <div>Option A</div>
            <div>Option B</div>
            <div>Option C</div>
            <div>Option D</div>
          </QuizCard.Multiple>
          <QuizCard.Explanation open={open} onOpenChange={setOpen}>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuizCard.Explanation>
        </QuizCard>
      </div>
    )
  },
}

// Case 1: 하나만 show이고 정답일 때 (Only "O" is highlighted as correct)
export const OXQuizCard_하나만_show이고_정답일_때: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={1} right={<button className="text-[0.8rem]">Info</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.OX answer="O" showIndexs={[0]} />
          <QuizCard.Explanation open={open} onOpenChange={setOpen}>
            설명: 정답인 "O"만 강조되어 있습니다.
          </QuizCard.Explanation>
        </QuizCard>
      </div>
    )
  },
}

// Case 2: 하나만 show이고 오답일 때 (Only "X" is highlighted, but it's incorrect)
export const OXQuizCard_하나만_show이고_오답일_때: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={2} right={<button className="text-[0.8rem]">Info</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.OX answer="O" showIndexs={[1]} />
          <QuizCard.Explanation open={open} onOpenChange={setOpen}>
            설명: 오답인 "X"만 강조되어 있습니다.
          </QuizCard.Explanation>
        </QuizCard>
      </div>
    )
  },
}

// Case 3: 둘다 보여주고 answer이 존재할 때 (Both options are shown; "O" is correct)
export const OXQuizCard_둘다_보여주고_answer이_존재할_때: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={3} right={<button className="text-[0.8rem]">Info</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.OX answer="O" showIndexs={[0, 1]} />
          <QuizCard.Explanation open={open} onOpenChange={setOpen}>
            설명: 두 옵션("O"와 "X") 모두 표시되며, 정답은 "O"입니다.
          </QuizCard.Explanation>
        </QuizCard>
      </div>
    )
  },
}

// Case 4: 하나만 show이고 정답이면서 하나는 disabled일 때 (Show only "O" as correct; "X" is disabled)
export const OXQuizCard_하나만_show이고_정답이면서_하나는_disabled일_때: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={4} right={<button className="text-[0.8rem]">Info</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.OX answer="O" showIndexs={[0]} disabledIndexs={[1]} />
          <QuizCard.Explanation open={open} onOpenChange={setOpen}>
            설명: 정답인 "O"만 강조되고, "X"는 비활성화 처리되었습니다.
          </QuizCard.Explanation>
        </QuizCard>
      </div>
    )
  },
}

// Case 5: 하나만 show이고 오답이면서 하나는 disabled일 때 (Show only "X" as highlighted, incorrect; "O" is disabled)
export const OXQuizCard_하나만_show이고_오답이면서_하나는_disabled일_때: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={5} right={<button className="text-[0.8rem]">Info</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.OX answer="O" showIndexs={[1]} disabledIndexs={[0]} />
          <QuizCard.Explanation open={open} onOpenChange={setOpen}>
            설명: 오답인 "X"만 강조되고, 정답인 "O"는 비활성화 처리되었습니다.
          </QuizCard.Explanation>
        </QuizCard>
      </div>
    )
  },
}

export const ExplanationControlledExternally: StoryObj<typeof QuizCard> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <div className="flex p-10 flex-col gap-6">
        <QuizCard>
          <QuizCard.Header order={1} right={<button className="text-[0.8rem]">Hint</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.Multiple>
            <div>Option A</div>
            <div>Option B</div>
            <div>Option C</div>
            <div>Option D</div>
          </QuizCard.Multiple>
          <QuizCard.Explanation open={isOpen} onOpenChange={setIsOpen}>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuizCard.Explanation>
        </QuizCard>
        {/* 외부에서 해설의 open 상태를 제어하는 버튼 */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded self-center"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Toggle Explanation (External)
        </button>
      </div>
    )
  },
}
