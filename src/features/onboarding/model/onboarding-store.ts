import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface OnboardingState {
  hasCompletedOnboarding: boolean
  shouldShowOnboardingReward: boolean
  setOnboardingCompleted: () => void
  setShouldShowOnboardingReward: (show: boolean) => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      shouldShowOnboardingReward: false,
      setOnboardingCompleted: () => 
        set({ 
          hasCompletedOnboarding: true, 
          shouldShowOnboardingReward: true 
        }),
      setShouldShowOnboardingReward: (show: boolean) => 
        set({ shouldShowOnboardingReward: show }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
