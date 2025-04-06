/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { QuestionCard } from '.'
import { Tag } from '../../ui/tag'

const meta: Meta<typeof QuestionCard> = {
  title: 'Card/QuestionCard',
  component: QuestionCard,
}
export default meta

export const MultipleDefault: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header
            order={1}
            right={
              <Tag size="md" color="green">
                정답
              </Tag>
            }
          />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.Multiple
            answerIndex={0}
            options={[
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
            ]}
          />
          <QuestionCard.Explanation>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const MultipleCorrect: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={1} right={<button className="text-[0.8rem]">Hint</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.Multiple
            answerIndex={0}
            showIndexs={[0]}
            options={[
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
            ]}
          />
          <QuestionCard.Explanation>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const MultipleIncorrect: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={1} right={<button className="text-[0.8rem]">Hint</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.Multiple
            answerIndex={0}
            showIndexs={[1]}
            options={[
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
            ]}
          />
          <QuestionCard.Explanation>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const MultipleBoth: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={1} right={<button className="text-[0.8rem]">Hint</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.Multiple
            answerIndex={0}
            showIndexs={[0, 1]}
            options={[
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
            ]}
          />
          <QuestionCard.Explanation>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const OXDefault: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={3} right={<button className="text-[0.8rem]">Info</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.OX answerIndex={0} />
          <QuestionCard.Explanation>설명: 두 옵션("O"와 "X") 모두 표시되며, 정답은 "O"입니다.</QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const OXCollect: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={4} right={<button className="text-[0.8rem]">Info</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.OX answerIndex={0} showIndexs={[0]} disabledIndexs={[1]} />
          <QuestionCard.Explanation>
            설명: 정답인 "O"만 강조되고, "X"는 비활성화 처리되었습니다.
          </QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const OXIncorrect: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={5} right={<button className="text-[0.8rem]">Info</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.OX answerIndex={1} showIndexs={[1]} disabledIndexs={[0]} />
          <QuestionCard.Explanation>
            설명: 오답인 "X"만 강조되고, 정답인 "O"는 비활성화 처리되었습니다.
          </QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const OXShowBoth: StoryObj<typeof QuestionCard> = {
  render: () => {
    return (
      <div className="p-10">
        <QuestionCard>
          <QuestionCard.Header order={3} right={<button className="text-[0.8rem]">Info</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.OX answerIndex={0} showIndexs={[0, 1]} />
          <QuestionCard.Explanation>설명: 두 옵션("O"와 "X") 모두 표시되며, 정답은 "O"입니다.</QuestionCard.Explanation>
        </QuestionCard>
      </div>
    )
  },
}

export const ExplanationControlledExternally: StoryObj<typeof QuestionCard> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <div className="flex p-10 flex-col gap-6">
        <QuestionCard>
          <QuestionCard.Header order={1} right={<button className="text-[0.8rem]">Hint</button>} />
          <QuestionCard.Question>
            식물기반 단백질 시장에서 대기업의 참여가 늘어나는 이유는 무엇인가요?
          </QuestionCard.Question>
          <QuestionCard.Multiple
            answerIndex={0}
            showIndexs={[0, 1]}
            options={[
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
              '기존의 배양육이 기존방식에서 생산되는 육류보다 토양이 비축된다',
            ]}
          />
          <QuestionCard.Explanation open={isOpen} onOpenChange={setIsOpen}>
            윌리엄 홀만 교수가 제시한 신식품 명명법의 주요 기준은 다섯 가지로, 전통적인 생선, 조개류, 소고기 또는
            가금류에 알레르기가 있는 사람들이 세포 기반 제품을 잠재적 알레르겐으로 식별할 수 있도록 해야 합니다. 또한,
            세포 기반 제품이나 기존 제품을 비하하지 않는 이름이어야 하며, 제품이 안전하고 건강하며 영양가 있다는 사실과
            일치하지 않는 생각, 이미지 또는 감정을 불러일으키지 않는 중립적인 이름이어야 합니다. 마지막으로, 소비자가
            제품을 식별할 수 있는 적절한 용어로 인식해야 한다고 합니다.
          </QuestionCard.Explanation>
        </QuestionCard>
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
