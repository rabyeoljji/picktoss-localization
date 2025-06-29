import { Helmet } from 'react-helmet-async'

import { AppRouter } from '@/app/app-router'
import { Providers } from '@/app/providers'

import { useInstagramExternal } from '@/shared/hooks/use-instagram-external'
import { useKakaoExternal } from '@/shared/hooks/use-kakao-external'

function App() {
  useKakaoExternal()
  useInstagramExternal()

  return (
    <Providers>
      <Helmet>
        <title>픽토스: 나를 성장시키는 AI 퀴즈</title>
        <meta name="description" content="나를 성장시키는 똑똑한 퀴즈" />

        {/* OpenGraph meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://picktoss.com" />
        <meta property="og:title" content="픽토스: 나를 성장시키는 AI 퀴즈" />
        <meta property="og:description" content="나를 성장시키는 똑똑한 퀴즈" />
        <meta property="og:image" content="https://picktoss.com/images/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="픽토스: 나를 성장시키는 AI 퀴즈" />
        <meta name="twitter:description" content="나를 성장시키는 똑똑한 퀴즈" />
        <meta name="twitter:image" content="https://picktoss.com/images/og-image.png" />
      </Helmet>
      <AppRouter />
    </Providers>
  )
}

export default App
