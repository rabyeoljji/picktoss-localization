import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const SEARCH = 'search'

export const SEARCH_KEYS = {
  // POST
  postIntegratedSearch: (keyword: string) =>
    originalCreateKey(SEARCH, SEARCH_ENDPOINTS.postIntegratedSearch(), keyword),
  postDocumentsSearch: (keyword: string) => originalCreateKey(SEARCH, SEARCH_ENDPOINTS.postDocumentsSearch(), keyword),
}

export const SEARCH_ENDPOINTS = {
  // POST
  postIntegratedSearch: () => '/integrated-search',
  postDocumentsSearch: () => '/documents/search',
}
