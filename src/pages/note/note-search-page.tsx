/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent } from 'react'

import SearchHeader from '@/features/search/search-header'
import SearchItem from '@/features/search/search-item'
import { highlightAndTrimText } from '@/features/search/utils'

import { DocumentSearchResult, QuizSearchResult } from '@/entities/search/api'
import { useSearchDocuments, useSearchDocumentsQuery } from '@/entities/search/api/hooks'

import { Text } from '@/shared/components/ui/text'
import { useSearch } from '@/shared/hooks/use-search'
import { cn } from '@/shared/lib/utils'

const NoteSearchPage = () => {
  const {
    initialKeyword,
    keyword,
    setKeyword,
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    searchContainerRef,
    handleDeleteKeyword,
    handleUpdateKeyword,
    handleSubmit,
  } = useSearch()

  const { data, isPending } = useSearchDocumentsQuery(initialKeyword)
  const searchResults = [...(data?.documents ?? []), ...(data?.quizzes ?? [])]
  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  return (
    <div>
      <SearchHeader
        keyword={keyword}
        onChangeKeyword={onChangeKeyword}
        handleDeleteKeyword={handleDeleteKeyword}
        handleSubmit={handleSubmit}
        handleUpdateKeyword={handleUpdateKeyword}
        searchContainerRef={searchContainerRef}
        searchInputRef={searchInputRef}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />
      {!isSearchFocused &&
        (isPending ? (
          <></>
        ) : // todo: lading lottie
        // <Loading center />
        // 검색 결과 X
        !data || searchResults.length === 0 ? (
          <NoResults className="h-[calc(100dvh-56px)]" />
        ) : (
          // 검색 결과 O : 검색 결과 리스트
          data &&
          searchResults.length > 0 && (
            <div className="h-[calc(100dvh-56px)] overflow-y-auto text-text1-medium">
              <DocumentQuizSearchList
                length={searchResults.length}
                searchResults={searchResults}
                keyword={initialKeyword}
              />
            </div>
          )
        ))}
    </div>
  )
}

export default NoteSearchPage

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

const DocumentQuizSearchList = ({ length, searchResults, keyword }: Props) => {
  return (
    <div className="flex flex-col p-[16px]">
      <Text typo="body-1-medium">
        퀴즈 노트 <span className="text-accent">{length}</span>
      </Text>

      <div className="flex flex-col">
        {/* {searchResults.map((searchItem, idx) => (
          <SearchItem
            key={idx}
            documentId={searchItem.documentId || null}
            createType={searchItem.documentType as Document.Type}
            documentTitle={highlightAndTrimText(searchItem.documentName ?? '', keyword ?? '')}
            matchingSentence={
              searchItem.content ? (
                // 문서 결과
                <MarkdownProcessor markdownText={searchItem.content} keyword={keyword ?? ''} />
              ) : (
                // 퀴즈 결과
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
            resultType={searchItem.question ? 'quiz' : 'document'}
            relativeDirectory={
              searchItem.directory
                ? searchItem.directory.name === '기본 폴더'
                  ? '전체 노트'
                  : searchItem.directory.name
                : (searchItem.directoryName ?? '')
            }
            lastItem={idx === searchResults.length - 1}
          />
        ))} */}
      </div>
    </div>
  )
}
