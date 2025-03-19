/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from '@storybook/react'

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
  render: () => {
    return <NoteIcon type="TEXT" />
  },
}

export const FileNoteIcon: StoryObj<typeof NoteIcon> = {
  render: () => {
    return <NoteIcon type="FILE" />
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
