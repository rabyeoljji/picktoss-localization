/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'

import SearchHeader from '@/features/search/search-header'

import { useSearch } from '@/shared/hooks/use-search'

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
    // useSearch 훅으로 검색 관련 상태 통합 관리
    const {
      keyword,
      setKeyword,
      isSearchFocused,
      setIsSearchFocused,
      searchInputRef,
      recentSearchRef,
      handleUpdateKeyword,
      handleDeleteKeyword,
    } = useSearch()

    const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
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
      />
    )
  },
}
