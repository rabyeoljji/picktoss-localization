import { client } from '@/shared/lib/axios/client'

export interface SearchRequest {
  keyword: string
}

export interface IntegratedSearchResponse {
  documents: DocumentSearchResult[]
  collections: CollectionSearchResult[]
  quizzes: QuizSearchResult[]
}

export interface DocumentSearchResponse {
  documents: DocumentSearchResult[]
}

export interface DocumentSearchResult {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  directoryId: number
  directoryName: string
}

export interface CollectionSearchResult {
  id: number
  title: string
  description: string
  category: string
  isBookmarked: boolean
  quizCount: number
  bookmarkCount: number
  createdAt: string
  updatedAt: string
}

export interface QuizSearchResult {
  id: number
  question: string
  answer: string
  documentId: number
  documentTitle: string
  createdAt: string
}

/**
 * 통합 검색 API
 * 문서, 컬렉션, 퀴즈를 한 번에 검색합니다.
 */
export const searchIntegrated = async (keyword: string): Promise<IntegratedSearchResponse> => {
  const response = await client.post<IntegratedSearchResponse>('/integrated-search', {
    keyword,
  })
  return response.data
}

/**
 * 문서 검색 API
 * 문서만 검색합니다.
 */
export const searchDocuments = async (keyword: string): Promise<DocumentSearchResponse> => {
  const response = await client.post<DocumentSearchResponse>('/documents/search', {
    keyword,
  })
  return response.data
}
