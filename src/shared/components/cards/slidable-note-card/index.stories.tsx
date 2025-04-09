/* eslint-disable react-hooks/rules-of-hooks */
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'
import { subDays } from 'date-fns'

import { IcDelete, IcUpload } from '@/shared/assets/icon'

import { SlidableNoteCard } from '.'
import { Checkbox } from '../../ui/checkbox'
import { Tag } from '../../ui/tag'
import { Text } from '../../ui/text'

/**
 * slide 로직을 포함하는 Slidable Card 컴포넌트입니다
 */

const meta: Meta<typeof SlidableNoteCard> = {
  title: 'Card/Slidable',
  component: SlidableNoteCard,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-gray-100">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    selectMode: {
      control: 'boolean',
    },
  },
}
export default meta

export const DefaultNoteCard: StoryObj<typeof SlidableNoteCard> = {
  render: () => {
    const yesterday = subDays(new Date(), 1).toISOString()
    const [{ selectMode }, updateArgs] = useArgs()
    const id = 0

    const changeSelectMode = (value: boolean) => {
      updateArgs({ selectMode: value })
    }

    return (
      <div className="p-10 flex-center">
        <SlidableNoteCard
          id={id}
          selectMode={selectMode}
          changeSelectMode={changeSelectMode}
          onSelect={() => {}}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-orange p-2 text-inverse">
              <IcUpload className="mb-[4px] text-inverse" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                공유
              </Text>
            </button>,
            <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
              <IcDelete className="mb-[4px]" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                삭제
              </Text>
            </button>,
          ]}
        >
          <SlidableNoteCard.Left
            content="📄"
            checkBox={<Checkbox id={`note_${id}`} className="mx-[8px] size-[20px]" />}
            selectMode={selectMode}
          />

          <SlidableNoteCard.Content>
            <SlidableNoteCard.Header title="금융투자분석사 노트정리" />
            <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SlidableNoteCard.Detail quizCount={28} directory="경영경제" lastUpdated={yesterday} />
          </SlidableNoteCard.Content>
        </SlidableNoteCard>
      </div>
    )
  },
}

export const NoteCardWithCustomEmoji: StoryObj<typeof SlidableNoteCard> = {
  render: () => {
    const yesterday = subDays(new Date(), 1).toISOString()
    const [{ selectMode }, updateArgs] = useArgs()
    const id = 0

    const changeSelectMode = (value: boolean) => {
      updateArgs({ selectMode: value })
    }

    return (
      <div className="p-10 flex-center">
        <SlidableNoteCard
          id={id}
          selectMode={selectMode}
          changeSelectMode={changeSelectMode}
          onSelect={() => {}}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-orange p-2 text-inverse">
              <IcUpload className="mb-[4px] text-inverse" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                공유
              </Text>
            </button>,
            <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
              <IcDelete className="mb-[4px]" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                삭제
              </Text>
            </button>,
          ]}
        >
          <SlidableNoteCard.Left
            content="🚀"
            checkBox={<Checkbox id={`note_${id}`} className="mx-[8px] size-[20px]" />}
            selectMode={selectMode}
          />

          <SlidableNoteCard.Content>
            <SlidableNoteCard.Header title="금융투자분석사 노트정리" />
            <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SlidableNoteCard.Detail quizCount={28} directory="경영경제" lastUpdated={yesterday} />
          </SlidableNoteCard.Content>
        </SlidableNoteCard>
      </div>
    )
  },
}

export const SlidNoteCard: StoryObj<typeof SlidableNoteCard> = {
  render: () => {
    const yesterday = subDays(new Date(), 1).toISOString()
    const [{ selectMode }, updateArgs] = useArgs()
    const id = 0

    const changeSelectMode = (value: boolean) => {
      updateArgs({ selectMode: value })
    }

    return (
      <div className="p-10 flex-center">
        <SlidableNoteCard
          defaultSlid
          id={id}
          selectMode={selectMode}
          changeSelectMode={changeSelectMode}
          onSelect={() => {}}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-orange p-2 text-inverse">
              <IcUpload className="mb-[4px] text-inverse" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                공유
              </Text>
            </button>,
            <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
              <IcDelete className="mb-[4px]" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                삭제
              </Text>
            </button>,
          ]}
        >
          <SlidableNoteCard.Left
            content="🚀"
            checkBox={<Checkbox id={`note_${id}`} className="mx-[8px] size-[20px]" />}
            selectMode={selectMode}
          />

          <SlidableNoteCard.Content>
            <SlidableNoteCard.Header title="금융투자분석사 노트정리" />
            <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SlidableNoteCard.Detail quizCount={28} directory="경영경제" lastUpdated={yesterday} />
          </SlidableNoteCard.Content>
        </SlidableNoteCard>
      </div>
    )
  },
}

export const SelectModeNoteCard: StoryObj<typeof SlidableNoteCard> = {
  args: {
    selectMode: true, // 기본값을 true로 설정
  },
  render: () => {
    const yesterday = subDays(new Date(), 1).toISOString()
    const [{ selectMode }, updateArgs] = useArgs()
    const id = 2

    const changeSelectMode = (value: boolean) => {
      updateArgs({ selectMode: value })
    }

    return (
      <div className="p-10 flex-center">
        <SlidableNoteCard
          id={id}
          selectMode={selectMode}
          changeSelectMode={changeSelectMode}
          onSelect={() => {}}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2 text-info">
              <IcUpload className="mb-[4px] text-inverse" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                공유
              </Text>
            </button>,
            <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
              <IcDelete className="mb-[4px]" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                삭제
              </Text>
            </button>,
          ]}
        >
          <SlidableNoteCard.Left
            content="🚀"
            checkBox={<Checkbox id={`note_${id}`} className="mx-[8px] size-[20px]" />}
            selectMode={selectMode}
          />

          <SlidableNoteCard.Content>
            <SlidableNoteCard.Header title="금융투자분석사 노트정리" />
            <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SlidableNoteCard.Detail quizCount={28} directory="경영경제" lastUpdated={yesterday} />
          </SlidableNoteCard.Content>
        </SlidableNoteCard>
      </div>
    )
  },
}

export const SelectModeNoteCardIsSelected: StoryObj<typeof SlidableNoteCard> = {
  args: {
    selectMode: true, // 기본값을 true로 설정
  },
  render: () => {
    const yesterday = subDays(new Date(), 1).toISOString()
    const [{ selectMode }, updateArgs] = useArgs()
    const id = 2

    const changeSelectMode = (value: boolean) => {
      updateArgs({ selectMode: value })
    }

    return (
      <div className="p-10 flex-center">
        <SlidableNoteCard
          id={id}
          selectMode={selectMode}
          changeSelectMode={changeSelectMode}
          onSelect={() => {}}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2 text-info">
              <IcUpload className="mb-[4px] text-inverse" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                공유
              </Text>
            </button>,
            <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
              <IcDelete className="mb-[4px]" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                삭제
              </Text>
            </button>,
          ]}
        >
          <SlidableNoteCard.Left
            content="🚀"
            checkBox={<Checkbox id={`note_${id}`} className="mx-[8px] size-[20px]" defaultChecked />}
            selectMode={selectMode}
          />

          <SlidableNoteCard.Content>
            <SlidableNoteCard.Header title="금융투자분석사 노트정리" />
            <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SlidableNoteCard.Detail quizCount={28} directory="경영경제" lastUpdated={yesterday} />
          </SlidableNoteCard.Content>
        </SlidableNoteCard>
      </div>
    )
  },
}

export const NoteCardWithTag: StoryObj<typeof SlidableNoteCard> = {
  render: () => {
    const yesterday = subDays(new Date(), 1).toISOString()
    const [{ selectMode }, updateArgs] = useArgs()
    const id = 3

    const changeSelectMode = (value: boolean) => {
      updateArgs({ selectMode: value })
    }

    return (
      <div className="p-10 flex-center">
        <SlidableNoteCard
          id={id}
          selectMode={selectMode}
          changeSelectMode={changeSelectMode}
          onSelect={() => {}}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2">
              <IcUpload className="mb-[4px] text-inverse" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                공유
              </Text>
            </button>,
            <button className="flex-center w-[72px] flex-col bg-critical p-2 text-inverse">
              <IcDelete className="mb-[4px]" />
              <Text typo="body-1-medium" color="inverse" className="size-fit">
                삭제
              </Text>
            </button>,
          ]}
        >
          <SlidableNoteCard.Left
            content="🚀"
            checkBox={<Checkbox id={`note_${id}`} className="mx-[8px] size-[20px]" />}
            selectMode={selectMode}
          />

          <SlidableNoteCard.Content>
            <SlidableNoteCard.Header title="금융투자분석사 노트정리" tag={<Tag color="orange-weak">{5} 오답</Tag>} />
            <SlidableNoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <SlidableNoteCard.Detail quizCount={28} directory="경영경제" lastUpdated={yesterday} />
          </SlidableNoteCard.Content>
        </SlidableNoteCard>
      </div>
    )
  },
}
