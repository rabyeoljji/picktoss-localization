import { useQuery, useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import { SEARCH_KEYS } from './config'
import { searchIntegrated, searchDocuments, type IntegratedSearchResponse, type DocumentSearchResponse } from './index'

/**
 * 통합 검색 결과를 가져오는 훅 (쿼리 방식)
 * 문서, 컬렉션, 퀴즈를 한 번에 검색합니다.
 * 
 * @param keyword 검색어
 * @param options 쿼리 옵션
 */
export const useSearchIntegratedQuery = (
  keyword: string,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<IntegratedSearchResponse>({
    queryKey: SEARCH_KEYS.postIntegratedSearch(keyword),
    queryFn: () => searchIntegrated(keyword),
    enabled: !!keyword && (options?.enabled !== false),
  })
}

/**
 * 통합 검색을 위한 mutation 훅
 * 문서, 컬렉션, 퀴즈를 한 번에 검색합니다.
 */
export const useSearchIntegrated = (
  options?: UseMutationOptions<IntegratedSearchResponse, Error, string>
) => {
  return useMutation<IntegratedSearchResponse, Error, string>({
    mutationFn: (keyword: string) => searchIntegrated(keyword),
    ...options,
  })
}

/**
 * 문서 검색 결과를 가져오는 훅 (쿼리 방식)
 * 문서만 검색합니다.
 * 
 * @param keyword 검색어
 * @param options 쿼리 옵션
 */
export const useSearchDocumentsQuery = (
  keyword: string,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<DocumentSearchResponse>({
    queryKey: SEARCH_KEYS.postDocumentsSearch(keyword),
    queryFn: () => searchDocuments(keyword),
    enabled: !!keyword && (options?.enabled !== false),
  })
}

/**
 * 문서 검색을 위한 mutation 훅
 * 문서만 검색합니다.
 */
export const useSearchDocuments = (
  options?: UseMutationOptions<DocumentSearchResponse, Error, string>
) => {
  return useMutation<DocumentSearchResponse, Error, string>({
    mutationFn: (keyword: string) => searchDocuments(keyword),
    ...options,
  })
}
