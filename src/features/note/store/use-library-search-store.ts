import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface State {
  keyword: string
}

interface Actions {
  setKeyword: (keyword: string) => void
  clearKeyword: () => void
}

type Store = State & Actions

const useLibrarySearchStore = create<Store>()(
  immer<Store>((set) => ({
    keyword: '',

    setKeyword: (keyword: string) =>
      set((state) => {
        state.keyword = keyword
      }),
    clearKeyword: () =>
      set((state) => {
        state.keyword = ''
      }),
  })),
)

export const useLibrarySearchState = () => {
  const keyword = useLibrarySearchStore((state) => state.keyword)

  return { keyword }
}

export const useLibrarySearchKeyword = () => useLibrarySearchStore((state) => state.keyword)

export const useLibrarySearchActions = () => {
  const setKeyword = useLibrarySearchStore((state) => state.setKeyword)
  const clearKeyword = useLibrarySearchStore((state) => state.clearKeyword)

  return { setKeyword, clearKeyword }
}
