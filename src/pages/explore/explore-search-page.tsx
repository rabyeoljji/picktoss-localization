import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import LoginDialog from '@/features/explore/ui/login-dialog'
import { formatQAText, highlightAndTrimText } from '@/features/search/lib'
import { useSearch } from '@/features/search/model/use-search'

import { SearchPublicDocumentsDto } from '@/entities/document/api'
import { useSearchPublicDocuments } from '@/entities/document/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import SearchQuizItem from '@/shared/components/items/search-quiz-item'
import Loading from '@/shared/components/ui/loading'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useRouter } from '@/shared/lib/router'
import { StorageKey } from '@/shared/lib/storage'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

const ExploreSearchPage = () => {
  const { isPWA } = usePWA()
  const { t } = useTranslation()

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
  const searchResults = searchResultsData?.documents ?? []
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
                placeholder={t('explore.explore_search_page.search_placeholder')}
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
            <Text typo="subtitle-1-bold">{t('explore.explore_search_page.no_results_title')}</Text>
            <Text typo="body-1-medium" color="sub">
              {t('explore.explore_search_page.try_different_keywords')}
            </Text>
          </div>
        )}

        {!showRecentKeywords && !isLoading && hasSearchResults && (
          <div className="h-[calc(100%-48px)] flex flex-col px-[16px] pt-[16px] overflow-y-auto">
            <Text typo="body-1-medium">
              {t('explore.explore_search_page.results_count')}{' '}
              <span className="text-accent">{searchResults.length}</span>
            </Text>

            <div className="h-fit flex flex-col pb-[16px]">
              {searchResults.map((searchItem, idx) => {
                return (
                  <ExploreSearchResultCard
                    key={searchItem.id}
                    searchItem={searchItem}
                    keyword={queryKeyword}
                    isLastItem={idx === searchResults.length - 1}
                  />
                )
              })}
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
  isLastItem?: boolean
}

/** 내 문서에서 검색 결과가 있을 때 결과들을 보여주는 컴포넌트 */
const ExploreSearchResultCard = ({ searchItem, keyword, isLastItem }: ExploreSearchResultsProps) => {
  const router = useRouter()

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleClickMoveToDetailPageBtn = () => {
    if (searchItem.isOwner) {
      router.push('/quiz-detail/:noteId', { params: [String(searchItem.id)] })
    } else {
      router.push('/quiz-detail/:noteId', { params: [String(searchItem.id)] })
    }
  }

  return (
    <>
      <div onClick={handleClickMoveToDetailPageBtn}>
        <SearchQuizItem
          documentTitle={highlightAndTrimText(searchItem.name, keyword, 'subtitle-2-bold')}
          documentEmoji={searchItem.emoji}
          matchingSentence={
            searchItem.quizzes && highlightAndTrimText(formatQAText(searchItem.quizzes), keyword ?? '', 'body-1-bold')
          }
          quizCount={searchItem.totalQuizCount}
          isPublic={true}
          playedCount={searchItem.tryCount}
          bookmarkCount={searchItem.bookmarkCount}
          lastItem={isLastItem}
        />
      </div>

      {/* 로그인 모달 */}
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}

export default withHOC(ExploreSearchPage, {})
