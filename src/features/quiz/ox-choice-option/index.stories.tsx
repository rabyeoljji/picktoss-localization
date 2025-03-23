import { Meta, StoryObj } from '@storybook/react'

import { OXChoiceOption } from '.'

const meta: Meta<typeof OXChoiceOption> = {
  title: 'Quiz/OXChoiceOption',
  component: OXChoiceOption,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
  },
}

export default meta

type Story = StoryObj<typeof OXChoiceOption>

export const BlueO: Story = {
  render: () => <OXChoiceOption variant="blue" type="o" />,
}

export const OrangeX: Story = {
  render: () => <OXChoiceOption variant="orange" type="x" />,
}

export const GreenO: Story = {
  render: () => <OXChoiceOption variant="green" type="o" />,
}

export const RedX: Story = {
  render: () => <OXChoiceOption variant="red" type="x" />,
}

export const GrayO: Story = {
  render: () => <OXChoiceOption variant="gray" type="o" />,
}

export const GrayX: Story = {
  render: () => <OXChoiceOption variant="gray" type="x" />,
}

export const Disabled: Story = {
  render: () => <OXChoiceOption variant="disabled" type="o" selectable={false} />,
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <OXChoiceOption variant="blue" type="o" />
      <OXChoiceOption variant="orange" type="x" />
      <OXChoiceOption variant="green" type="o" />
      <OXChoiceOption variant="red" type="x" />
      <OXChoiceOption variant="gray" type="o" />
      <OXChoiceOption variant="gray" type="x" />
    </div>
  ),
}