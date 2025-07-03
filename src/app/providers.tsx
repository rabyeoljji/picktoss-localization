import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toaster } from '@/shared/components/ui/sonner'
import { AmplitudeProvider } from '@/shared/hooks/use-amplitude-context'

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
  return (
    <AmplitudeProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
          <Toaster expand position="bottom-center" duration={3000} style={{ marginBottom: '40px' }} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </AmplitudeProvider>
  )
}
