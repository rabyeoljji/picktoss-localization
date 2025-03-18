import { Meta, StoryObj } from '@storybook/react'

import { SearchInput } from '.'

const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const Default: StoryObj<typeof SearchInput> = {
  render: () => (
    <div className="p-4">
      <SearchInput 
        onValueChange={(value) => console.log('Value changed:', value)} 
        clear={() => console.log('Input cleared')} 
      />
    </div>
  ),
}
