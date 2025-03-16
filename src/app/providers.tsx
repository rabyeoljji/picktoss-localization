import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toaster } from '@/shared/components/ui/sonner'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster expand position="bottom-center" duration={3000} />
    </QueryClientProvider>
  )
}
