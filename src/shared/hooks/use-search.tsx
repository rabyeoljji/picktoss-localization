import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { LOCAL_KEY } from '@/shared/config'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/shared/lib/utils/storage'

export const useSearch = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialKeyword = searchParams.get('keyword') || ''

  const [keyword, setKeyword] = useState(initialKeyword)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !searchInputRef.current?.contains(e.target as Node) &&
        !searchContainerRef.current?.contains(e.target as Node)
      ) {
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
    if (!initialKeyword) return

    const storageSearches = getLocalStorage<string[]>(LOCAL_KEY.RECENT_SEARCHES) ?? []
    const newSearches = [initialKeyword, ...storageSearches.filter((search) => search !== initialKeyword)].slice(0, 5)
    setLocalStorage(LOCAL_KEY.RECENT_SEARCHES, newSearches)
  }, [initialKeyword])

  /** 최근 검색어 리스트에서 특정 검색어 클릭 시 검색창에 키워드가 반영되도록하는 함수 */
  const handleUpdateKeyword = (selectedKeyword: string) => {
    setKeyword(selectedKeyword)

    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.set('keyword', selectedKeyword)
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true })

    setIsSearchFocused(false)
  }

  /** 검색창에 입력되어있는 키워드를 삭제하는 함수 */
  const handleDeleteKeyword = () => {
    setKeyword('')

    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.delete('keyword')
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true })
  }

  // 검색
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.')
      return
    }

    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.set('keyword', keyword)
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true })

    searchInputRef.current?.blur()
    setIsSearchFocused(false)
  }

  return {
    keyword,
    setKeyword,
    initialKeyword,
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    searchContainerRef,
    handleUpdateKeyword,
    handleDeleteKeyword,
    handleSubmit,
  }
}

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const storageSearches = getLocalStorage<string[]>(LOCAL_KEY.RECENT_SEARCHES) ?? []
    setRecentSearches(storageSearches)
  }, [])

  /** 로컬스토리지에서 특정 검색어 삭제 */
  const deleteRecentSearch = (keyword: string) => {
    const newRecentSearches = recentSearches.filter((search) => search !== keyword)
    setLocalStorage(LOCAL_KEY.RECENT_SEARCHES, newRecentSearches)
    setRecentSearches(newRecentSearches)
  }

  /** 전체 검색어 삭제 */
  const deleteAllRecentSearches = () => {
    removeLocalStorage(LOCAL_KEY.RECENT_SEARCHES)
    setRecentSearches([])
  }

  return {
    recentSearches,
    setRecentSearches,
    deleteRecentSearch,
    deleteAllRecentSearches,
  }
}
