import * as React from 'react'

import { Meta, StoryObj } from '@storybook/react'

import { Tag } from '.'

const meta: Meta<typeof Tag> = {
  title: 'UI/Tag',
  component: Tag,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const AllCases: StoryObj<typeof Tag> = {
  render: () => (
    <div className="flex flex-col gap-2 p-4">
      {/* special */}
      <div className="flex items-center gap-2">
        <Tag color="special" size="sm">
          정답
        </Tag>
        <Tag color="special" size="md">
          정답
        </Tag>
      </div>
      {/* orange-strong */}
      <div className="flex items-center gap-2">
        <Tag color="orange-strong" size="sm">
          정답
        </Tag>
        <Tag color="orange-strong" size="md">
          정답
        </Tag>
      </div>
      {/* orange */}
      <div className="flex items-center gap-2">
        <Tag color="orange" size="sm">
          정답
        </Tag>
        <Tag color="orange" size="md">
          정답
        </Tag>
      </div>
      {/* blue-strong */}
      <div className="flex items-center gap-2">
        <Tag color="blue-strong" size="sm">
          정답
        </Tag>
        <Tag color="blue-strong" size="md">
          정답
        </Tag>
      </div>
      {/* orange-weak */}
      <div className="flex items-center gap-2">
        <Tag color="orange-weak" size="sm">
          정답
        </Tag>
        <Tag color="orange-weak" size="md">
          정답
        </Tag>
      </div>
      {/* gray */}
      <div className="flex items-center gap-2">
        <Tag color="gray" size="sm">
          정답
        </Tag>
        <Tag color="gray" size="md">
          정답
        </Tag>
      </div>
      {/* green */}
      <div className="flex items-center gap-2">
        <Tag color="green" size="sm">
          정답
        </Tag>
        <Tag color="green" size="md">
          정답
        </Tag>
      </div>
      {/* red */}
      <div className="flex items-center gap-2">
        <Tag color="red" size="sm">
          정답
        </Tag>
        <Tag color="red" size="md">
          정답
        </Tag>
      </div>
    </div>
  ),
}
