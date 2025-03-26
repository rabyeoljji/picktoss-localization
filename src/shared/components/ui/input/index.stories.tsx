import { Meta, StoryObj } from '@storybook/react'

import { Input } from '.'
import { SquareButton } from '../square-button'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    docs: {
      page: null,
    },
  },
}
export default meta

export const AllCases: StoryObj<typeof Input> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '400px' }}>
      {/* With label and helper text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 1: With label and helper text</p>
        <Input
          label="Name"
          placeholder="Enter your full name"
          type="text"
          helperText="Please enter your first and last name"
        />
      </div>
      <hr />

      {/* With label and error */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 2: With label and error state</p>
        <Input
          label="Email"
          placeholder="Enter a valid email address"
          type="email"
          helperText="This email is invalid"
          hasError
        />
      </div>
      <hr />

      {/* With right component */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 3: With a right-aligned SquareButton</p>
        <Input
          label="Verify"
          placeholder="Enter a valid code"
          type="email"
          right={
            <SquareButton variant="tertiary" size="sm">
              인증하기
            </SquareButton>
          }
        />
      </div>
      <hr />

      {/* Without label but with helper text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 4: Without label but with helper text</p>
        <Input placeholder="입력해주세요" hasClear type="text" helperText="This field can work without a label" />
      </div>
      <hr />

      {/* With custom width and right component */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 5: With custom width and right component</p>
        <Input
          label="Custom width"
          placeholder="Enter a valid code"
          width={200}
          type="email"
          right={
            <SquareButton variant="tertiary" size="sm">
              인증하기
            </SquareButton>
          }
        />
      </div>
      <hr />

      {/* Repeated case: With label and helper text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 6: Repeated with label and helper text</p>
        <Input
          label="Name"
          placeholder="Enter your full name"
          type="text"
          helperText="Please enter your first and last name"
        />
      </div>
      <hr />

      {/* Disabled input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>Case 7: Disabled input</p>
        <Input placeholder="Disabled" type="text" disabled />
      </div>
    </div>
  ),
}
