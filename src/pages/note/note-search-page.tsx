import { ChangeEvent } from 'react'

import SearchHeader from '@/features/search/search-header'
import SearchItem from '@/features/search/search-item-quiz-note'
import { MarkdownProcessor, highlightAndTrimText } from '@/features/search/utils'

import { DocumentSearchResult, QuizSearchResult } from '@/entities/search/api'
import { useSearchDocumentsQuery } from '@/entities/search/api/hooks'

import { Text } from '@/shared/components/ui/text'
import { useSearch } from '@/shared/hooks/use-search'
import { StorageKey } from '@/shared/lib/storage'
import { cn } from '@/shared/lib/utils'

const NoteSearchPage = () => {
  const {
    searchKeyword,
    keyword,
    setKeyword,
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    recentSearchRef,
    handleDeleteKeyword,
    handleUpdateKeyword,
    handleSubmit,
  } = useSearch(StorageKey.quizNoteRecentSearchKeyword)

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  return (
    <div className="size-full bg-surface-1">
      <SearchHeader
        keyword={keyword}
        onChangeKeyword={onChangeKeyword}
        handleDeleteKeyword={handleDeleteKeyword}
        handleSubmit={handleSubmit}
        handleUpdateKeyword={handleUpdateKeyword}
        recentSearchRef={recentSearchRef}
        searchInputRef={searchInputRef}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        recentStorageKey={StorageKey.quizNoteRecentSearchKeyword}
      />

      <SearchContent isSearchFocused={isSearchFocused} searchKeyword={searchKeyword} />
    </div>
  )
}

export default NoteSearchPage

/** 검색결과를 렌더링하는 컴포넌트 */
const SearchContent = ({ isSearchFocused, searchKeyword }: { isSearchFocused: boolean; searchKeyword: string }) => {
  const { data, isPending } = useSearchDocumentsQuery(searchKeyword)
  const searchResults = [...(data?.documents ?? []), ...(data?.quizzes ?? [])]
  const noResults = !data || searchResults.length === 0

  if (isSearchFocused) {
    if (isPending) {
      // todo: lading lottie
      return <></>
    }

    if (noResults) {
      return <NoResults className="h-[calc(100dvh-56px)]" />
    }

    if (data) {
      return (
        <div className="h-[calc(100dvh-56px)] px-[16px] overflow-y-auto text-text1-medium">
          <DocumentQuizSearchList length={searchResults.length} searchResults={searchResults} keyword={searchKeyword} />
        </div>
      )
    }
  }
}

/** 검색 결과가 없을 때 보여주는 컴포넌트 */
const NoResults = ({ className }: { className?: HTMLElement['className'] }) => {
  return (
    <div className={cn('flex-center flex-col gap-1', className)}>
      <Text typo="subtitle-1-bold">검색결과가 없어요</Text>
      <Text typo="body-1-medium" className="text-sub">
        다른 키워드를 입력해보세요
      </Text>
    </div>
  )
}

interface Props {
  length: number
  searchResults: (DocumentSearchResult | QuizSearchResult)[]
  keyword: string
}

/** 검색 결과가 있을 때 퀴즈와 노트 결과들을 보여주는 컴포넌트 */
const DocumentQuizSearchList = ({ length, searchResults, keyword }: Props) => {
  return (
    <div className="flex flex-col p-[16px]">
      <Text typo="body-1-medium">
        퀴즈 노트 <span className="text-accent">{length}</span>
      </Text>

      <div className="flex flex-col">
        {searchResults.map((searchItem, idx) => {
          const isQuizType = 'question' in searchItem && 'answer' in searchItem
          const isNoteType = 'content' in searchItem

          return (
            <SearchItem
              key={idx}
              documentId={searchItem.documentId || null}
              documentTitle={highlightAndTrimText(searchItem.documentName ?? '', keyword ?? '')}
              matchingSentence={
                // 문서 결과
                isNoteType ? (
                  <MarkdownProcessor markdownText={searchItem.content} keyword={keyword ?? ''} />
                ) : (
                  // 퀴즈 결과
                  isQuizType &&
                  highlightAndTrimText(
                    `Q.${searchItem.question ?? '...'} A.${
                      (searchItem.answer === 'correct'
                        ? 'O'
                        : searchItem.answer === 'incorrect'
                          ? 'X'
                          : searchItem.answer) ?? '...'
                    }`,
                    keyword ?? '',
                  )
                )
              }
              resultType={isQuizType ? 'quiz' : 'document'}
              quizCount={25} // todo: searchItem.-- 데이터 값으로 수정
              charCount={15430} // todo: searchItem.-- 데이터 값으로 수정
              relativeDirectory={
                isNoteType
                  ? searchItem.directory.name === '기본 폴더'
                    ? '전체 노트'
                    : searchItem.directory.name
                  : (searchItem.directoryName ?? '')
              }
              directoryEmoji="🎯"
              lastItem={idx === searchResults.length - 1}
            />
          )
        })}
      </div>
    </div>
  )
}
