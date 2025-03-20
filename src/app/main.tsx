import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/App.tsx'
import '@/app/styles/color-theme.css'
import '@/app/styles/index.css'
import '@/app/styles/typo.css'

// PWA 서비스 워커 업데이트
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(const registration of registrations) {
      registration.update();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
