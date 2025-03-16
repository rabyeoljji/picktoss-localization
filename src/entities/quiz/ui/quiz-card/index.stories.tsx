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

export const OXQuizCard: StoryObj<typeof QuizCard> = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10">
        <QuizCard>
          <QuizCard.Header order={2} right={<button className="text-[0.8rem]">Info</button>} />
          <QuizCard.Question>식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?</QuizCard.Question>
          <QuizCard.OX>
            <div className="mr-[10px]">O</div>
            <div>X</div>
          </QuizCard.OX>
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
