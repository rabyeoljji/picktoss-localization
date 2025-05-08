import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { IcClose } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { type Pathname, useRouter } from '@/shared/lib/router'
import { type StorageKeyType } from '@/shared/lib/storage/model/type'
import { useLocalStorage } from '@/shared/lib/storage/model/use-storage'

import { useRecentSearches } from './use-recent-search-keyword'

/**
 * 검색 기능을 위한 커스텀 훅
 *
 * 검색어 관리, 최근 검색어 기록, 검색 폼 제출 등의 기능을 제공합니다.
 *
 * @param storageKey 최근 검색어를 저장할 스토리지 키
 * @returns 검색 관련 상태와 핸들러 함수들
 */
export const useSearch = (storageKey: StorageKeyType) => {
  const router = useRouter()
  const [searchParams] = useSearchParams()

  // URL 쿼리 파라미터에서 검색어 가져오기
  const queryKeyword = searchParams.get('keyword') || ''

  // 내부 상태 관리
  const [inputValue, setInputValue] = useState(queryKeyword)
  const [showRecentKeywords, setShowRecentKeywords] = useState(false)
  const [recentKeywords, setRecentKeywords] = useLocalStorage(storageKey, [])

  // 참조 객체들
  const searchInputRef = useRef<HTMLInputElement>(null)
  const recentSearchListRef = useRef<HTMLDivElement>(null)

  // 검색 결과 영역 외부 클릭 감지 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickedOutside =
        !searchInputRef.current?.contains(event.target as Node) &&
        !recentSearchListRef.current?.contains(event.target as Node)

      if (isClickedOutside) {
        setShowRecentKeywords(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /**
   * 최근 검색어 업데이트 유틸리티 함수
   * @param keyword 추가할 키워드
   */
  const updateRecentKeywords = (keyword: string) => {
    if (!keyword) return

    // 중복 검색어 제거 후 최대 5개만 유지
    const updatedKeywords = [
      keyword,
      ...(Array.isArray(recentKeywords) ? recentKeywords.filter((k) => k !== keyword) : []),
    ].slice(0, 5)
    setRecentKeywords(updatedKeywords)
  }

  /**
   * 검색어로 검색 페이지 이동 또는 갱신하는 함수
   * @param keyword 검색할 키워드
   * @param currentPath 현재 경로 (기본값: 현재 위치)
   */
  const navigateToSearch = (keyword: string, currentPath: Pathname = location.pathname as Pathname) => {
    router.replace(currentPath, {
      search: { keyword: keyword ? [keyword] : [] },
    })
  }

  /**
   * 최근 검색어 선택 시 호출되는 핸들러
   * @param selectedKeyword 선택된 검색어
   */
  const handleSelectRecentKeyword = (selectedKeyword: string) => {
    setInputValue(selectedKeyword)
    navigateToSearch(selectedKeyword)
    setShowRecentKeywords(false)
    updateRecentKeywords(selectedKeyword)
  }

  /**
   * 검색어 삭제 시 호출되는 핸들러
   */
  const handleClearKeyword = () => {
    setInputValue('')
    navigateToSearch('')

    // Focus the input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  /**
   * 검색 폼 제출 시 호출되는 함수
   */
  const onSearchSubmit = () => {
    const trimmedKeyword = inputValue.trim()

    // 검색어가 있는 경우에만 최근 검색어에 추가
    if (trimmedKeyword) {
      updateRecentKeywords(trimmedKeyword)
    }

    navigateToSearch(trimmedKeyword)
    searchInputRef.current?.blur()
    setShowRecentKeywords(false)
  }

  const RecentSearchKeywords = () => {
    const { recentKeywords, removeKeyword, clearAllKeywords } = useRecentSearches(storageKey)

    return (
      <div ref={recentSearchListRef} className="absolute top-[var(--header-height)] w-full left-0">
        <div className="flex flex-col bg-surface-1 px-4 py-[20px]">
          <div className="mb-[14px] flex items-center justify-between">
            <Text typo="body-1-bold" className="text-secondary">
              최근 검색어
            </Text>
            <button className="typo-button-4 text-sub" onClick={clearAllKeywords}>
              전체삭제
            </button>
          </div>

          <div className="flex flex-col">
            {Array.isArray(recentKeywords) &&
              recentKeywords.map((keyword) => (
                <div
                  key={keyword}
                  onClick={() => handleSelectRecentKeyword(keyword)}
                  className="flex cursor-pointer items-center justify-between py-[10px]"
                >
                  <Text typo="body-1-medium">{keyword}</Text>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeKeyword(keyword)
                    }}
                    className="text-icon-sub"
                  >
                    <IcClose className="size-[20px]" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return {
    // 상태
    inputValue,
    queryKeyword,
    showRecentKeywords,
    recentKeywords,

    // 업데이트 함수
    setInputValue,
    setShowRecentKeywords,

    // 참조
    searchInputRef,
    recentSearchListRef,

    // 핸들러
    handleSelectRecentKeyword,
    handleClearKeyword,
    onSearchSubmit,

    RecentSearchKeywords,
  }
}
