import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  image?: File
  socialPlatform: 'KAKAO' | 'GOOGLE'
  role: 'ROLE_USER' | 'ROLE_ADMIN'
  interestCategories: string[]
  documentUsage: {
    possessDocumentCount: number
    maxPossessDocumentCount: number
  }
  star: number
  quizNotificationEnabled: boolean
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
