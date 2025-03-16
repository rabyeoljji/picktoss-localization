import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/App.tsx'
import '@/app/styles/color-theme.css'
import '@/app/styles/index.css'
import '@/app/styles/typo.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
