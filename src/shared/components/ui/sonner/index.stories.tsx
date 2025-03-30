import { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'

import { IcWarningFilled } from '@/shared/assets/icon'

import { Toaster } from '.'
import { Button } from '../button'

const meta: Meta = {
  title: 'UI/Toast',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] py-10">
        <Story />
      </div>
    ),
  ],
}
export default meta

// AllCases story displaying all scenarios together
export const AllCases: StoryObj<typeof Toaster> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Case 1: Default Toast */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 1: Default Toast</p>
        <Button onClick={() => toast('This is a default toast')}>Open Default Toast</Button>
      </div>
      <hr />

      {/* Case 2: Toast with Action Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 2: Toast with Action Button</p>
        <Button
          onClick={() =>
            toast('This toast has an action button', {
              action: {
                label: 'Action',
                onClick: () => alert('Action clicked'),
              },
            })
          }
        >
          Open Toast with Action
        </Button>
      </div>
      <hr />

      {/* Case 3: Toast with Cancel Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 3: Toast with Cancel Button</p>
        <Button
          onClick={() =>
            toast('This toast has a cancel button', {
              cancel: {
                label: 'X',
                onClick: () => alert('Cancel clicked'),
              },
            })
          }
        >
          Open Toast with Cancel
        </Button>
      </div>
      <hr />

      {/* Case 4: Toast with Icon */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 4: Toast with Icon</p>
        <Button
          onClick={() =>
            toast('This toast has a Icon', {
              icon: <IcWarningFilled className="size-4 text-icon-critical" />,
            })
          }
        >
          Open Toast with Icon
        </Button>
      </div>
      <hr />

      {/* Case 5: Toast with Long Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 5: Toast with Long Title</p>
        <Button
          onClick={() =>
            toast(
              'This is a very long toast message that should wrap nicely and display all of the content without breaking the layout. Enjoy reading the long message!',
            )
          }
        >
          Open Toast with Long Title
        </Button>
      </div>
    </div>
  ),
}
