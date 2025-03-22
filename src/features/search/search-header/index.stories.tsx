/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import SearchHeader from '@/features/search/search-header'

import { StorageKey } from '@/shared/lib/storage'

const meta: Meta<typeof SearchHeader> = {
  title: 'search/SearchHeader',
  component: SearchHeader,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    keyword: { control: 'text' },
    isSearchFocused: { control: 'boolean' },
    setIsSearchFocused: { table: {} },
    searchInputRef: { table: {} },
    recentSearchRef: { table: {} },
    onChangeKeyword: { action: 'changed' },
    handleDeleteKeyword: { action: 'deleted' },
    handleUpdateKeyword: { action: 'updated' },
    handleSubmit: { action: 'submitted' },
  },
}

export default meta
type Story = StoryObj<typeof SearchHeader>

export const Default: Story = {
  render: () => {
    // useSearch 훅으로 검색 관련 상태와 로직들을 통합 관리
    const [keyword, setKeyword] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const recentSearchRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          !searchInputRef.current?.contains(e.target as Node) &&
          !recentSearchRef.current?.contains(e.target as Node)
        ) {
          setIsSearchFocused(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    }
    const handleUpdateKeyword = (selectedKeyword: string) => {
      setKeyword(selectedKeyword)
    }
    const handleDeleteKeyword = () => {
      setKeyword('')
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
    }

    return (
      <SearchHeader
        keyword={keyword}
        onChangeKeyword={handleChangeKeyword}
        handleDeleteKeyword={handleDeleteKeyword}
        handleUpdateKeyword={handleUpdateKeyword}
        handleSubmit={handleSubmit}
        searchInputRef={searchInputRef}
        recentSearchRef={recentSearchRef}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        recentStorageKey={StorageKey.integratedRecentSearchKeyword}
      />
    )
  },
}
