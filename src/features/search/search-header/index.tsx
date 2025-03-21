// import InputWithCancelButton from './input-with-cancel-button'
// import RecentSearches from './recent-searches'
import { ChangeEventHandler, RefObject } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import { IcBack, IcClose } from '@/shared/assets/icon'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { useRecentSearches } from '@/shared/hooks/use-search'
import { RoutePath, useRouter } from '@/shared/lib/router'

interface Props {
  keyword: string
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteKeyword: () => void
  handleUpdateKeyword: (selectedKeyword: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
  searchContainerRef: React.RefObject<HTMLDivElement | null>
  isSearchFocused: boolean
  setIsSearchFocused: (value: boolean) => void
}

const SearchHeader = ({
  keyword,
  onChangeKeyword,
  handleUpdateKeyword,
  handleDeleteKeyword,
  handleSubmit,
  searchContainerRef,
  searchInputRef,
  isSearchFocused,
  setIsSearchFocused,
}: Props) => {
  return (
    <>
      <InputWithCancelButton
        inputValue={keyword}
        onChangeInputValue={onChangeKeyword}
        onDeleteKeyword={handleDeleteKeyword}
        onSubmit={handleSubmit}
        searchInputRef={searchInputRef}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />

      {/* input 클릭 시 나타날 최근 검색어 */}
      {isSearchFocused && <RecentSearches containerRef={searchContainerRef} onUpdateKeyword={handleUpdateKeyword} />}
    </>
  )
}

export default SearchHeader

interface InputWithCancelButtonProps {
  inputValue: string
  onChangeInputValue: ChangeEventHandler<HTMLInputElement>
  searchInputRef: RefObject<HTMLInputElement | null>
  isSearchFocused: boolean
  setIsSearchFocused: (value: boolean) => void
  onDeleteKeyword: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const InputWithCancelButton = ({
  inputValue,
  onChangeInputValue,
  searchInputRef,
  setIsSearchFocused,
  onDeleteKeyword,
  onSubmit,
}: InputWithCancelButtonProps) => {
  const [searchParams] = useSearchParams()
  const prev = searchParams.get('prev')
  const router = useRouter()
  const pathname = useLocation().pathname

  const placeholder =
    pathname === '/home-search'
      ? '노트, 퀴즈, 컬렉션 검색'
      : pathname === RoutePath.noteSearch.pathname
        ? '노트명, 노트, 퀴즈 검색'
        : pathname === RoutePath.collectionSearch.pathname
          ? '컬렉션 검색'
          : '검색어를 입력해주세요'

  const handleCancel = () => {
    if (prev) {
      if (prev === 'home') {
        router.replace(RoutePath.root.pathname)
      }
    } else {
      router.back()
    }
  }

  return (
    <header className="flex-center relative right-1/2 z-20 h-[56px] w-full max-w-mobile grow translate-x-1/2  bg-surface-1 px-[16px] typo-subtitle-2-medium">
      <button type="button" onClick={handleCancel} className="ml-[17px] w-fit flex-none">
        <IcBack className="size-[24px] text-primary" />
      </button>

      <form onSubmit={onSubmit} tabIndex={-1} className="relative grow">
        <SearchInput
          autoFocus
          ref={searchInputRef}
          onFocus={() => setIsSearchFocused(true)}
          value={inputValue}
          onChange={onChangeInputValue}
          deleteKeyword={onDeleteKeyword}
          placeholder={placeholder}
          className="h-[40px] placeholder:text-caption"
        />
      </form>
    </header>
  )
}

interface RecentSearchesProps {
  containerRef: RefObject<HTMLDivElement | null>
  onUpdateKeyword: (keyword: string) => void
}

const RecentSearches = ({ containerRef, onUpdateKeyword }: RecentSearchesProps) => {
  const { recentSearches, deleteRecentSearch, deleteAllRecentSearches } = useRecentSearches()

  return (
    <div ref={containerRef} className="flex flex-col border-t border-divider px-[16px] py-[20px]">
      <div className="mb-[14px] flex items-center justify-between">
        <Text typo="body-1-bold" className="text-secondary">
          최근 검색어
        </Text>
        <button className="typo-button-4 text-sub" onClick={deleteAllRecentSearches}>
          전체삭제
        </button>
      </div>

      <div className="flex flex-col">
        {recentSearches.map((keyword) => (
          <div
            key={keyword}
            onClick={() => onUpdateKeyword(keyword)}
            className="flex cursor-pointer items-center justify-between py-[10px]"
          >
            <Text typo="body-1-medium">{keyword}</Text>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteRecentSearch(keyword)
              }}
              className="text-icon-sub"
            >
              <IcClose className="size-[20px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
