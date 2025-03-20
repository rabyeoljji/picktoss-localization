/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from '@storybook/react'
import { useArgs } from 'storybook/internal/preview-api'

import { NoteIcon } from '.'

const meta: Meta<typeof NoteIcon> = {
  title: 'BgIcon/NoteIcon',
  component: NoteIcon,
  parameters: {
    docs: {
      page: null,
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['TEXT', 'FILE'],
    },
  },
}
export default meta

export const WriteNoteIcon: StoryObj<typeof NoteIcon> = {
  args: {
    type: 'TEXT', // 기본값을 'TEXT'로 설정
  },
  render: () => {
    const [{ type }] = useArgs()
    return <NoteIcon type={type} />
  },
}

export const FileNoteIcon: StoryObj<typeof NoteIcon> = {
  args: {
    type: 'FILE', // 기본값을 'FILE'로 설정
  },
  render: () => {
    const [{ type }] = useArgs()
    return <NoteIcon type={type} />
  },
}

// 추후 노션 기능 구현 후 활성화
// export const NotionNoteIcon: StoryObj<typeof NoteIcon> = {
//   render: () => {
//     return (
//       <NoteIcon type='NOTION' />
//     )
//   },
// }
