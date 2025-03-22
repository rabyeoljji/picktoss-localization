import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { LOCAL_KEY } from '@/shared/config'
import { RouteConfig, useRouter } from '@/shared/lib/router'
import { useLocalStorage } from '@/shared/lib/storage'
import { StorageKeyType } from '@/shared/lib/storage/model/type'
import { removeLocalStorage } from '@/shared/lib/utils/storage'

export const useSearch = (storageKey: StorageKeyType) => {
  const router = useRouter()
  const [searchParams] = useSearchParams()
  const searchKeyword = searchParams.get('keyword') || ''

  const [keyword, setKeyword] = useState(searchKeyword)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentKeywords, setRecentKeywords] = useLocalStorage(storageKey, [])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const recentSearchRef = useRef<HTMLDivElement>(null)

  // 검색 input과 최신 검색어 바깥영역을 클릭했을 때 최신 검색어 닫음
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!searchInputRef.current?.contains(e.target as Node) && !recentSearchRef.current?.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 검색 후 로컬스토리지에 반영
  useEffect(() => {
    if (!searchKeyword) return

    // 최신 검색어를 적절하게 5개로 잘라 업데이트합니다 (새로운 키워드는 앞에 추가해 맨 위에 노출될 수 있도록)
    const newSearches = [searchKeyword, ...recentKeywords.filter((search) => search !== searchKeyword)].slice(0, 5)
    setRecentKeywords(newSearches)
  }, [searchKeyword])

  /** 최근 검색어 리스트에서 특정 검색어 클릭 시 검색창에 키워드가 반영되도록하는 함수 */
  const handleUpdateKeyword = (selectedKeyword: string) => {
    setKeyword(selectedKeyword)

    router.replace(location.pathname as keyof RouteConfig, { search: { keyword: [selectedKeyword] } })

    setIsSearchFocused(false)
  }

  /** 검색창에 입력되어있는 키워드를 삭제하는 함수 */
  const handleDeleteKeyword = () => {
    setKeyword('')

    router.replace(location.pathname as keyof RouteConfig, { search: { keyword: [''] } })
  }

  // 검색
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.')
      return
    }

    router.replace(location.pathname as keyof RouteConfig, { search: { keyword: [keyword] } })

    searchInputRef.current?.blur()
    setIsSearchFocused(false)
  }

  return {
    keyword,
    setKeyword,
    searchKeyword,
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    recentSearchRef,
    handleUpdateKeyword,
    handleDeleteKeyword,
    handleSubmit,
  }
}

/** 최신검색어 관련 로직을 위한 훅 */
export const useRecentSearches = (storageKey: StorageKeyType) => {
  const [recentKeywords, setRecentKeywords] = useLocalStorage(storageKey, [])

  /** 로컬스토리지에서 특정 검색어 삭제 */
  const deleteRecentSearch = (keyword: string) => {
    const newRecentSearches = recentKeywords.filter((search) => search !== keyword)
    setRecentKeywords(newRecentSearches)
  }

  /** 전체 검색어 삭제 */
  const deleteAllRecentSearches = () => {
    removeLocalStorage(LOCAL_KEY.RECENT_SEARCHES)
    setRecentKeywords([])
  }

  return {
    recentKeywords,
    setRecentKeywords,
    deleteRecentSearch,
    deleteAllRecentSearches,
  }
}
