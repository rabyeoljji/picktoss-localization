import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  isSignUp: boolean
  setIsSignUp: (isSignUp: boolean) => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      isSignUp: false,
      setIsSignUp: (isSignUp: boolean) => set({ isSignUp }),
      clearToken: () => set({ token: null, isSignUp: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
