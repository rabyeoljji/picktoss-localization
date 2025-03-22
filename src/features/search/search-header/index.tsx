import { ChangeEventHandler, RefObject } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import { IcBack, IcClose } from '@/shared/assets/icon'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { useRecentSearches } from '@/shared/hooks/use-search'
import { RoutePath, useRouter } from '@/shared/lib/router'
import { StorageKeyType } from '@/shared/lib/storage/model/type'

interface Props {
  keyword: string
  searchInputRef: React.RefObject<HTMLInputElement | null>
  recentSearchRef: React.RefObject<HTMLDivElement | null>
  isSearchFocused: boolean
  recentStorageKey: StorageKeyType

  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteKeyword: () => void
  handleUpdateKeyword: (selectedKeyword: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setIsSearchFocused: (value: boolean) => void
}

const SearchHeader = ({
  keyword,
  onChangeKeyword,
  handleUpdateKeyword,
  handleDeleteKeyword,
  handleSubmit,
  recentSearchRef,
  searchInputRef,
  isSearchFocused,
  setIsSearchFocused,
  recentStorageKey,
}: Props) => {
  return (
    <>
      <InputWithBackButton
        inputValue={keyword}
        onChangeInputValue={onChangeKeyword}
        onDeleteKeyword={handleDeleteKeyword}
        onSubmit={handleSubmit}
        searchInputRef={searchInputRef}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />

      {/* input 클릭 시 나타날 최근 검색어 : 외부 영역 클릭 시 닫힘 */}
      {isSearchFocused && (
        <RecentSearches
          recentStorageKey={recentStorageKey}
          recentSearchRef={recentSearchRef}
          onUpdateKeyword={handleUpdateKeyword}
        />
      )}
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

/** 뒤로가기 버튼과 검색창을 결합한 컴포넌트 */
const InputWithBackButton = ({
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
    pathname === RoutePath.search
      ? '노트, 퀴즈, 컬렉션 검색'
      : pathname === RoutePath.noteSearch
        ? '노트명, 노트, 퀴즈 검색'
        : pathname === RoutePath.collectionSearch
          ? '컬렉션 검색'
          : '검색어를 입력해주세요'

  const handleBack = () => {
    if (prev) {
      if (prev === 'home') {
        router.replace(RoutePath.root)
      }
    } else {
      router.back()
    }
  }

  return (
    <header className="flex-center relative right-1/2 z-20 h-[56px] w-full max-w-xl grow translate-x-1/2  bg-surface-1 px-[16px] typo-subtitle-2-medium">
      <button type="button" onClick={handleBack} className="ml-[8px] mr-[12px] w-fit flex-none">
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
        />
      </form>
    </header>
  )
}

interface RecentSearchesProps {
  recentSearchRef: RefObject<HTMLDivElement | null>
  recentStorageKey: StorageKeyType
  onUpdateKeyword: (keyword: string) => void
}

/** 최근 검색어 컴포넌트 */
const RecentSearches = ({ recentSearchRef, recentStorageKey, onUpdateKeyword }: RecentSearchesProps) => {
  const { recentKeywords, deleteRecentSearch, deleteAllRecentSearches } = useRecentSearches(recentStorageKey)

  return (
    <div ref={recentSearchRef} className="flex flex-col border-t border-divider bg-surface-1 px-[16px] py-[20px]">
      <div className="mb-[14px] flex items-center justify-between">
        <Text typo="body-1-bold" className="text-secondary">
          최근 검색어
        </Text>
        <button className="typo-button-4 text-sub" onClick={deleteAllRecentSearches}>
          전체삭제
        </button>
      </div>

      <div className="flex flex-col">
        {recentKeywords.map((keyword) => (
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
