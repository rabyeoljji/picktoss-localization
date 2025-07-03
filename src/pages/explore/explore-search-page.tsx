import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'
import { highlightAndTrimText } from '@/features/search/lib'
import { useSearch } from '@/features/search/model/use-search'

import { SearchPublicDocumentsDto } from '@/entities/document/api'
import {
  useCreateDocumentBookmark,
  useDeleteDocumentBookmark,
  useSearchPublicDocuments,
} from '@/entities/document/api/hooks'

import { IcBookmark, IcBookmarkFilled } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { BookmarkVerticalCard } from '@/shared/components/cards/bookmark-vertical-card'
import { Header } from '@/shared/components/header'
import Loading from '@/shared/components/ui/loading'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'
import { StorageKey } from '@/shared/lib/storage'
import { cn } from '@/shared/lib/utils'

const ExploreSearchPage = () => {
  const { isPWA } = usePWA()

  const {
    inputValue,
    setInputValue,
    queryKeyword,
    showRecentKeywords,
    setShowRecentKeywords,
    searchInputRef,
    handleClearKeyword,
    onSearchSubmit,
    RecentSearchKeywords,
  } = useSearch(StorageKey.exploreRecentSearchKeyword)

  // 쿼리를 사용하여 queryKeyword 변경 시 자동으로 검색 실행
  const { data: searchResultsData, isLoading } = useSearchPublicDocuments(
    { keyword: queryKeyword },
    {
      enabled: !!queryKeyword && !showRecentKeywords,
    },
  )
  const searchResults = searchResultsData?.publicDocuments ?? []
  const hasSearchResults = searchResults && searchResults.length > 0

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // onSearchSubmit 호출 시 URL이 업데이트되고 queryKeyword가 변경됨
    // 이에 따라 자동으로 useSearchDocumentsQuery가 실행됨
    onSearchSubmit()
  }

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div
      className={cn(
        'h-full bg-base-1 flex flex-col',
        isMobile && !isPWA && 'h-[calc(100%-var(--safe-area-inset-top))]',
      )}
    >
      <Header
        left={<BackButton className="mr-1" />}
        content={
          <>
            <form onSubmit={handleSubmit} tabIndex={-1} className="relative grow">
              <SearchInput
                autoFocus
                ref={searchInputRef}
                onFocus={() => setShowRecentKeywords(true)}
                value={inputValue}
                onChange={onChangeKeyword}
                clearKeyword={handleClearKeyword}
                placeholder="퀴즈 제목, 내용 검색"
              />
            </form>

            {/* input 클릭 시 나타날 최근 검색어 : 외부 영역 클릭 시 닫힘 */}
            {showRecentKeywords && <RecentSearchKeywords />}
          </>
        }
      />

      <HeaderOffsetLayout className="flex-1 overflow-auto">
        {isLoading && <Loading center />}

        {!showRecentKeywords && !isLoading && !hasSearchResults && !!queryKeyword && (
          <div className="size-full flex-center flex-col gap-[8px] pb-[108px]">
            <Text typo="subtitle-1-bold">검색 결과가 없어요</Text>
            <Text typo="body-1-medium" color="sub">
              다른 키워드를 입력해보세요
            </Text>
          </div>
        )}

        {!showRecentKeywords && !isLoading && hasSearchResults && (
          <div className="h-full px-[16px] pt-[20px] flex flex-col gap-[10px] overflow-y-auto">
            <Text typo="body-1-medium">
              결과 <span className="text-accent">{searchResults.length}</span>
            </Text>

            <div className="w-full h-fit pb-[59px]">
              <div className="h-fit w-full max-w-[342px] sm:max-w-full mx-auto grid grid-cols-[repeat(auto-fit,_minmax(166px,_166px))] gap-x-[10px] gap-y-[16px]">
                {searchResults.map((searchItem) => {
                  return <ExploreSearchResultCard key={searchItem.id} searchItem={searchItem} keyword={queryKeyword} />
                })}
              </div>
            </div>
          </div>
        )}
      </HeaderOffsetLayout>
    </div>
  )
}

interface ExploreSearchResultsProps {
  searchItem: SearchPublicDocumentsDto
  keyword: string
}

/** 내 문서에서 검색 결과가 있을 때 결과들을 보여주는 컴포넌트 */
const ExploreSearchResultCard = ({ searchItem, keyword }: ExploreSearchResultsProps) => {
  const token = useStore(useAuthStore, (state) => state.token)

  const router = useRouter()

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const [isBookmarked, setIsBookmarked] = useState(searchItem.isBookmarked)

  const { mutate: bookmark } = useCreateDocumentBookmark(searchItem.id)
  const { mutate: deleteBookmark } = useDeleteDocumentBookmark(searchItem.id)

  // 낙관적 업데이트 적용한 북마크 핸들러
  const handleBookmark = () => {
    if (!token) {
      setIsLoginOpen(true)
      return
    }

    const nextState = !isBookmarked
    setIsBookmarked(nextState)

    if (nextState) {
      bookmark(undefined, {
        onError: () => setIsBookmarked(false),
      })
    } else {
      deleteBookmark(undefined, {
        onError: () => setIsBookmarked(true),
      })
    }
  }

  return (
    <>
      <BookmarkVerticalCard
        role="link"
        onClick={() => {
          router.push('/explore/detail/:noteId', {
            params: [String(searchItem.id)],
          })
        }}
      >
        <BookmarkVerticalCard.Header
          emoji={searchItem.emoji}
          isOwner={searchItem.isOwner}
          bookmarkBtn={
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleBookmark()
              }}
            >
              {isBookmarked ? (
                <IcBookmarkFilled className="size-[24px] text-icon-primary" />
              ) : (
                <IcBookmark className="size-[24px] text-icon-secondary" />
              )}
            </button>
          }
          category={searchItem.category}
        />

        <BookmarkVerticalCard.Content title={highlightAndTrimText(searchItem.name, keyword, 'subtitle-2-bold')} />
        <BookmarkVerticalCard.Detail
          isPublic
          quizCount={searchItem.totalQuizCount}
          playedCount={searchItem.tryCount}
          bookmarkCount={searchItem.bookmarkCount}
        />

        <BookmarkVerticalCard.Footer creator={searchItem.creatorName} />
      </BookmarkVerticalCard>

      {/* 로그인 모달 */}
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}

export default withHOC(ExploreSearchPage, {})
