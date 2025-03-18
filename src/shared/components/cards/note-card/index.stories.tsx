/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from '@storybook/react'

import { IcDelete, IcMove } from '@/shared/assets/icon'

import { NoteCard } from '.'
import { Checkbox } from '../../ui/checkbox'
import Tag from '../../ui/tag'
import { Text } from '../../ui/text'

const meta: Meta<typeof NoteCard> = {
  title: 'Card/NoteCard',
  component: NoteCard,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const WrittenTypeNoteCard: StoryObj<typeof NoteCard> = {
  render: () => {
    return (
      <div className="p-10">
        <NoteCard
          id={1}
          selectMode={false}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2 text-info">
              <IcMove className="mb-[4px] text-info" />
              <Text typo="body-1-medium" color="info" className="size-fit">
                이동
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
          <NoteCard.Left
            type="TEXT"
            checkBox={<Checkbox id={'note_1'} className="mx-[8px] size-[20px]" />}
            selectMode={false}
          />

          <NoteCard.Contents>
            <NoteCard.Header title="금융투자분석사 노트정리" />
            <NoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <NoteCard.Detail quizCount={28} charCount={10528} directory="경영경제" />
          </NoteCard.Contents>
        </NoteCard>
      </div>
    )
  },
}

export const FileTypeNoteCard: StoryObj<typeof NoteCard> = {
  render: () => {
    return (
      <div className="p-10">
        <NoteCard
          id={2}
          selectMode={false}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2 text-info">
              <IcMove className="mb-[4px] text-info" />
              <Text typo="body-1-medium" color="info" className="size-fit">
                이동
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
          <NoteCard.Left
            type="FILE"
            checkBox={<Checkbox id={'note_2'} className="mx-[8px] size-[20px]" />}
            selectMode={false}
          />

          <NoteCard.Contents>
            <NoteCard.Header title="금융투자분석사 노트정리" />
            <NoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <NoteCard.Detail quizCount={28} charCount={10528} directory="경영경제" />
          </NoteCard.Contents>
        </NoteCard>
      </div>
    )
  },
}

export const SelectModeNoteCard: StoryObj<typeof NoteCard> = {
  render: () => {
    return (
      <div className="p-10">
        <NoteCard
          id={3}
          selectMode={true}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2 text-info">
              <IcMove className="mb-[4px] text-info" />
              <Text typo="body-1-medium" color="info" className="size-fit">
                이동
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
          <NoteCard.Left
            type="FILE"
            checkBox={<Checkbox id={'note_3'} className="mx-[8px] size-[20px]" />}
            selectMode={true}
          />

          <NoteCard.Contents>
            <NoteCard.Header title="금융투자분석사 노트정리" />
            <NoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <NoteCard.Detail quizCount={28} charCount={10528} directory="경영경제" />
          </NoteCard.Contents>
        </NoteCard>
      </div>
    )
  },
}

export const ReviewPickNoteCard: StoryObj<typeof NoteCard> = {
  render: () => {
    return (
      <div className="p-10">
        <NoteCard
          id={4}
          selectMode={false}
          onClick={() => {}}
          swipeOptions={[
            <button className="flex-center w-[72px] flex-col bg-info p-2 text-info">
              <IcMove className="mb-[4px] text-info" />
              <Text typo="body-1-medium" color="info" className="size-fit">
                이동
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
          <NoteCard.Left
            type="TEXT"
            checkBox={<Checkbox id={'note_4'} className="mx-[8px] size-[20px]" />}
            selectMode={false}
          />

          <NoteCard.Contents>
            <NoteCard.Header title="금융투자분석사 노트정리" tag={<Tag colors={'secondary'}>복습 필요 {5}</Tag>} />
            <NoteCard.Preview content="1. 금융투자분석사 개요 금융투자분석사는 투자분석 및 포트폴리오 관리를 수행하는 전문가로서" />
            <NoteCard.Detail quizCount={28} charCount={10528} directory="경영경제" />
          </NoteCard.Contents>
        </NoteCard>
      </div>
    )
  },
}
