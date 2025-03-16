import React from 'react'
import { BrowserRouter } from 'react-router'

import type { Preview } from '@storybook/react'

import { Providers } from '../src/app/providers'
import '../src/app/styles/color-theme.css'
import '../src/app/styles/index.css'
import '../src/app/styles/typo.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Providers>
          <Story />
        </Providers>
      </BrowserRouter>
    ),
  ],
}

export default preview
