import React from "react"
import { BrowserRouter } from "react-router"
import "../src/app/index.css"
import type { Preview } from "@storybook/react"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [(Story) => <BrowserRouter>{Story()}</BrowserRouter>],
}

export default preview
