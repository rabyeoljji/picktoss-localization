import { AppRouter } from '@/app/app-router'
import { Providers } from '@/app/providers'

import { useExternalBrowser } from '@/shared/hooks/use-external-browser'
import { useInstagramExternal } from '@/shared/hooks/use-instagram-external'

function App() {
  useExternalBrowser()
  useInstagramExternal()

  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

export default App
