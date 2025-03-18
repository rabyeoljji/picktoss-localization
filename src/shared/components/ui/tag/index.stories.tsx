/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from '@storybook/react'

import Tag from '.'

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
  render: () => {
    const colors: Array<
      | 'special'
      | 'primary'
      | 'primary-hover'
      | 'primary-loading'
      | 'info'
      | 'secondary'
      | 'disabled'
      | 'tertiary'
      | 'right'
      | 'wrong'
    > = [
      'special',
      'primary',
      'primary-hover',
      'primary-loading',
      'info',
      'secondary',
      'disabled',
      'tertiary',
      'right',
      'wrong',
    ]
    const sizes: Array<'sm' | 'md'> = ['sm', 'md']

    return (
      <div style={{ display: 'grid', gap: '40px' }}>
        {colors.map((color) => (
          <div key={color}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>{color}</h3>
            {sizes.map((size) => (
              <div key={size}>
                <h4 style={{ textTransform: 'capitalize', marginBottom: '8px' }}>{size}</h4>
                <Tag colors={color} size={size}>
                  태그
                </Tag>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
}
