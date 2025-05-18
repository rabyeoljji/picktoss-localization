import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { MarkdownProcessor, formatQAText, highlightAndTrimText } from '@/features/search/lib'
import { useSearch } from '@/features/search/model/use-search'

import { SearchBookmarkDocumentsDto, SearchDocumentsDto } from '@/entities/document/api'
import { useSearchDocument } from '@/entities/document/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import SearchQuizNoteItem from '@/shared/components/items/search-quiz-note-item'
import Loading from '@/shared/components/ui/loading'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Text } from '@/shared/components/ui/text'
import { Link, useQueryParam } from '@/shared/lib/router'
import { StorageKey } from '@/shared/lib/storage'

type Tab = 'MY' | 'BOOKMARK'

const NoteSearchPage = () => {
  const [activeTab, setTab] = useQueryParam('/library/search', 'tab')
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
  } = useSearch(StorageKey.libraryRecentSearchKeyword)

  // 쿼리를 사용하여 queryKeyword 변경 시 자동으로 검색 실행
  const { data: searchResultsData, isFetching } = useSearchDocument(
    { keyword: queryKeyword },
    {
      enabled: !!queryKeyword && !showRecentKeywords,
    },
  )
  const searchResultsMyDocs = searchResultsData?.documents ?? []
  const searchResultsBookmarks = searchResultsData?.bookmarkedDocuments ?? []

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

  const hasSearchResultsMyDocs = searchResultsMyDocs && searchResultsMyDocs.length > 0
  const hasSearchResultsBookmarks = searchResultsBookmarks && searchResultsBookmarks.length > 0

  return (
    <div className="h-screen bg-base-1 flex flex-col">
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
        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={(tab) => setTab(tab as Tab)}>
          <TabsList className="bg-surface-1 rounded-none h-fit p-0">
            <TabsTrigger
              className="typo-button-2 bg-surface-1 border-b border-divider data-[state=active]:border-b-2 data-[state=active]:border-black text-sub data-[state=active]:text-primary h-[48px] w-1/2 rounded-none"
              value={'MY' as Tab}
            >
              내 퀴즈
            </TabsTrigger>
            <TabsTrigger
              className="typo-button-2 bg-surface-1 border-b border-divider data-[state=active]:border-b-2 data-[state=active]:border-black text-sub data-[state=active]:text-primary h-[48px] w-1/2 rounded-none"
              value={'BOOKMARK' as Tab}
            >
              북마크
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isFetching && <Loading center />}

        {/* 내 퀴즈 탭일 때 */}
        {activeTab === 'MY' && (
          <>
            {!showRecentKeywords && !isFetching && !hasSearchResultsMyDocs && !!queryKeyword && (
              <div className="size-full flex-center flex-col gap-[8px] pb-[108px]">
                <Text typo="subtitle-1-bold">검색 결과가 없어요</Text>
                <Text typo="body-1-medium" color="sub">
                  다른 키워드를 입력해보세요
                </Text>
              </div>
            )}

            {!showRecentKeywords && !isFetching && hasSearchResultsMyDocs && (
              <MyDocumentQuizSearchResults tab={activeTab} documents={searchResultsMyDocs} keyword={queryKeyword} />
            )}
          </>
        )}

        {/* 북마크 탭일 때 */}
        {activeTab === 'BOOKMARK' && (
          <>
            {!showRecentKeywords && !isFetching && !hasSearchResultsBookmarks && !!queryKeyword && (
              <div className="size-full flex-center flex-col gap-[8px] pb-[108px]">
                <Text typo="subtitle-1-bold">검색 결과가 없어요</Text>
                <Text typo="body-1-medium" color="sub">
                  다른 키워드를 입력해보세요
                </Text>
              </div>
            )}

            {!showRecentKeywords && !isFetching && hasSearchResultsBookmarks && (
              <MyDocumentQuizSearchResults tab={activeTab} documents={searchResultsBookmarks} keyword={queryKeyword} />
            )}
          </>
        )}
      </HeaderOffsetLayout>
    </div>
  )
}

interface DocumentQuizSearchResultsProps {
  tab: Tab
  documents: SearchDocumentsDto[] | SearchBookmarkDocumentsDto[]
  keyword: string
}

/** 내 문서에서 검색 결과가 있을 때 결과들을 보여주는 컴포넌트 */
const MyDocumentQuizSearchResults = ({ tab, documents, keyword }: DocumentQuizSearchResultsProps) => {
  function isSearchDocumentsDto(item: SearchDocumentsDto | SearchBookmarkDocumentsDto): item is SearchDocumentsDto {
    return 'content' in item && typeof item.content === 'string'
  }

  return (
    <div className="h-[calc(100dvh-56px)] px-[16px] overflow-y-auto text-text1-medium">
      <div className="flex flex-col p-[16px]">
        <Text typo="body-1-medium">
          결과 <span className="text-accent">{documents.length}</span>
        </Text>

        <div className="flex flex-col">
          {documents.map((searchItem, idx) => {
            return (
              <Link
                key={idx}
                to={tab === 'MY' ? '/library/:noteId' : '/explore/detail/:noteId'}
                params={[String(searchItem.id)]}
              >
                <SearchQuizNoteItem
                  documentTitle={highlightAndTrimText(searchItem.name ?? '', keyword ?? '')}
                  documentEmoji={searchItem.emoji}
                  matchingSentence={
                    isSearchDocumentsDto(searchItem) && searchItem.content.includes(keyword) ? (
                      <MarkdownProcessor markdownText={searchItem.content} keyword={keyword ?? ''} />
                    ) : (
                      highlightAndTrimText(formatQAText(searchItem.quizzes), keyword ?? '')
                    )
                  }
                  quizCount={searchItem.totalQuizCount}
                  isPublic={isSearchDocumentsDto(searchItem) ? searchItem.isPublic : true}
                  playedCount={searchItem.tryCount}
                  bookmarkCount={searchItem.bookmarkCount}
                  lastItem={idx === documents.length - 1}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default withHOC(NoteSearchPage, {})
