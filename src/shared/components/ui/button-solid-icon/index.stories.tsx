import { Meta, StoryObj } from '@storybook/react'

import { IcAdd } from '@/shared/assets/icon'

import { ButtonSolidIcon } from '.'

const meta: Meta<typeof ButtonSolidIcon> = {
  title: 'UI/ButtonSolidIcon',
  component: ButtonSolidIcon,
}
export default meta

export const AllCases: StoryObj<typeof ButtonSolidIcon> = {
  render: () => {
    const variants: Array<'special' | 'primary' | 'secondary' | 'tertiary'> = [
      'special',
      'primary',
      'secondary',
      'tertiary',
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
              {/* lg 사이즈 (아이콘 미포함) */}
              <ButtonSolidIcon variant={variant} size="lg">
                <IcAdd className="size-[24px]" />
              </ButtonSolidIcon>

              {/* Loading State */}
              <ButtonSolidIcon variant={variant} size="lg" data-state="loading">
                <IcAdd className="size-[24px]" />
              </ButtonSolidIcon>

              {/* md 사이즈 (아이콘 미포함) */}
              <ButtonSolidIcon variant={variant} size="md">
                <IcAdd className="size-[20px]" />
              </ButtonSolidIcon>
            </div>
          </div>
        ))}
      </div>
    )
  },
}
