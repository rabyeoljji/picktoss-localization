import { useState } from 'react'

import { useSearchIntegrated } from '@/entities/search/api/hooks'
import {
  CollectionSearchResult,
  DocumentSearchResult,
  IntegratedSearchResponse,
  QuizSearchResult,
} from '@/entities/search/api/index'

import { IcClose } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header/header'
import { SearchInput } from '@/shared/components/ui/search-input'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { StorageKey, useLocalStorage } from '@/shared/lib/storage'

export const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<IntegratedSearchResponse | null>(null)
  const [isSearched, setIsSearched] = useState(false)
  const [keyword, setKeyword] = useState('')

  const [recentKeywords, setRecentKeywords] = useLocalStorage(StorageKey.integratedRecentSearchKeyword, [])

  const { mutate: searchMutate, isPending } = useSearchIntegrated({
    onSuccess: (data: IntegratedSearchResponse) => {
      setSearchResults(data)
      setIsSearched(true)
      setRecentKeywords([keyword, ...recentKeywords])
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchMutate(keyword)
  }

  const hasSearchResults =
    searchResults &&
    (searchResults.documents?.length > 0 || searchResults.collections?.length > 0 || searchResults.quizzes?.length > 0)

  return (
    // 임시 스타일
    <div className="h-screen bg-base-1 flex flex-col">
      <Header
        left="back"
        content={
          <form onSubmit={handleSubmit}>
            <SearchInput onValueChange={(value: string) => setKeyword(value)} />
          </form>
        }
      />

      <div className="flex-1 overflow-auto">
        {/* 검색 결과가 없을 때 */}
        {isSearched && !isPending && !hasSearchResults && <NoResults />}

        {/* 최근 검색 키워드 */}
        {!isSearched && <RecentKeywords />}

        {/* 검색 결과 */}
        {isSearched && !isPending && hasSearchResults && searchResults && (
          <SearchResults
            documents={searchResults.documents}
            collections={searchResults.collections}
            quizzes={searchResults.quizzes}
          />
        )}
      </div>
    </div>
  )
}

interface SearchResultsProps {
  documents: IntegratedSearchResponse['documents']
  collections: IntegratedSearchResponse['collections']
  quizzes: IntegratedSearchResponse['quizzes']
}

const SearchResults = ({ documents, collections, quizzes }: SearchResultsProps) => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <Text typo="subtitle-2-medium" className="mb-2">
          문서 ({documents.length})
        </Text>
        {documents.map((document: DocumentSearchResult) => (
          <div key={document.id} className="p-3 rounded-lg bg-base-2 mb-2">
            <Text typo="subtitle-2-medium" className="line-clamp-1">
              {document.title}
            </Text>
            <Text typo="body-1-regular" color="sub" className="line-clamp-2 mt-1">
              {document.content}
            </Text>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <Text typo="subtitle-2-medium" className="mb-2">
          컬렉션 ({collections.length})
        </Text>
        {collections.map((collection: CollectionSearchResult) => (
          <div key={collection.id} className="p-3 rounded-lg bg-base-2 mb-2">
            <Text typo="subtitle-2-medium" className="line-clamp-1">
              {collection.title}
            </Text>
            <Text typo="body-1-regular" color="sub" className="line-clamp-2 mt-1">
              {collection.description}
            </Text>
          </div>
        ))}
      </div>

      <div>
        <Text typo="subtitle-2-medium" className="mb-2">
          퀴즈 ({quizzes.length})
        </Text>
        {quizzes.map((quiz: QuizSearchResult) => (
          <div key={quiz.id} className="p-3 rounded-lg bg-base-2 mb-2">
            <Text typo="subtitle-2-medium" className="line-clamp-1">
              {quiz.question}
            </Text>
            <Text typo="body-1-regular" color="sub" className="line-clamp-2 mt-1">
              {quiz.answer}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

const NoResults = () => {
  return (
    <div className="center text-center">
      <Text typo="subtitle-1-bold" color="primary">
        검색 결과가 없어요
      </Text>
      <Text typo="body-1-medium" color="sub" className="mt-1">
        다른 키워드를 입력해보세요
      </Text>
    </div>
  )
}

const RecentKeywords = () => {
  const [recentKeywords, setRecentKeywords, removeRecentKeywords] = useLocalStorage(
    StorageKey.integratedRecentSearchKeyword,
    [],
  )

  if (recentKeywords.length === 0) {
    return (
      <div className="mt-[37.5px] flex-center">
        <Text as="span" typo="body-1-bold">
          최근 검색 내역이 없어요
        </Text>
      </div>
    )
  }

  return (
    <div className="mt-4 px-4">
      <div className="flex items-center justify-between">
        <Text typo="body-1-bold">최근 검색어</Text>
        <TextButton variant="sub" size="sm" onClick={() => removeRecentKeywords()}>
          전체 삭제
        </TextButton>
      </div>
      <div className="mt-3">
        {recentKeywords.map((keyword, index) => (
          <div key={index} className="py-[9.5px] flex items-center justify-between">
            <Text typo="body-1-medium">{keyword}</Text>
            <button onClick={() => setRecentKeywords(recentKeywords.filter((_, i) => i !== index))}>
              <IcClose className="size-5 text-icon-sub" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
