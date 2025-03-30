/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from '@storybook/preview-api'
import { Meta, StoryObj } from '@storybook/react'

import { Slider } from '@/shared/components/ui/slider'

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const Default: StoryObj<typeof Slider> = {
  render: () => {
    const [value, setValue] = useState(5)

    return (
      <div className="flex-center">
        <div className="w-3/4">
          <Slider value={[value]} step={1} onValueChange={(value: number[]) => setValue(value[0])} min={1} max={10} />
        </div>
      </div>
    )
  },
}
