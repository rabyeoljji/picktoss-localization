import React from 'react'
import { I18nextProvider } from 'react-i18next'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { LanguageSwitcher } from '@/shared/components/ui/language-switcher'
import { Toaster } from '@/shared/components/ui/sonner'
import { AmplitudeProvider } from '@/shared/hooks/use-amplitude-context'
import { i18n, initializeI18next } from '@/shared/locales/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isI18nInitialized, setIsI18nInitialized] = React.useState(false)

  // i18next 초기화
  React.useEffect(() => {
    if (!isI18nInitialized) {
      initializeI18next()
      setIsI18nInitialized(true)
    }
  }, [isI18nInitialized])

  if (!isI18nInitialized) {
    return null // 초기화가 완료될 때까지 렌더링하지 않음
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AmplitudeProvider>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {children}
            <LanguageSwitcher />
            <Toaster expand position="bottom-center" duration={3000} style={{ marginBottom: '40px' }} />
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </AmplitudeProvider>
    </I18nextProvider>
  )
}
