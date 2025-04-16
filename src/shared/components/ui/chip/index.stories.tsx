import { Meta, StoryObj } from '@storybook/react'

import { IcChevronDown } from '@/shared/assets/icon'
import { Chip } from '@/shared/components/ui/chip'

const meta: Meta<typeof Chip> = {
  title: 'UI/Chip',
  component: Chip,
}
export default meta

export const AllCases: StoryObj<typeof Chip> = {
  render: () => {
    const variants: Array<'default' | 'selected' | 'activated' | 'darken'> = [
      'default',
      'selected',
      'activated',
      'darken',
    ]

    return (
      <div style={{ display: 'grid', gap: '40px' }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>{variant}</h3>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Chip variant={variant} left={<IcChevronDown />} right={<IcChevronDown />}>
                분야
              </Chip>
            </div>
          </div>
        ))}
        <div>
          <h3 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>disabled</h3>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Chip disabled variant={'default'} left={<IcChevronDown />} right={<IcChevronDown />}>
              분야
            </Chip>
          </div>
        </div>
      </div>
    )
  },
}
