import { AppRouter } from '@/app/app-router'
import { Providers } from '@/app/providers'

import { useInstagramExternal } from '@/shared/hooks/use-instagram-external'
import { useKakaoExternal } from '@/shared/hooks/use-kakao-external'

function App() {
  useKakaoExternal()
  useInstagramExternal()

  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

export default App
