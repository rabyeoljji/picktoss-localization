import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { IcClose } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { type Pathname, RouteNames, useQueryParam, useRouter } from '@/shared/lib/router'
import { type StorageKeyType } from '@/shared/lib/storage/model/type'

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
  const [queryParams] = useQueryParam(location.pathname as RouteNames)
  const { t } = useTranslation()

  // 스토리지와 연결된 최신 검색어
  const { recentKeywords, addKeyword, removeKeyword, clearAllKeywords } = useRecentSearches(storageKey)

  // URL 쿼리 파라미터에서 검색어 가져오기
  const queryKeyword = searchParams.get('keyword') || ''

  // 내부 상태 관리
  const [inputValue, setInputValue] = useState(queryKeyword)
  const [showRecentKeywords, setShowRecentKeywords] = useState(false)

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
    addKeyword(keyword)
  }

  /**
   * 검색어로 검색 페이지 이동 또는 갱신하는 함수
   * @param keyword 검색할 키워드
   * @param currentPath 현재 경로 (기본값: 현재 위치)
   */
  const navigateToSearch = (keyword: string, currentPath: Pathname = location.pathname as Pathname) => {
    router.replace(currentPath, {
      search: { ...queryParams, keyword: keyword ? [keyword] : [] },
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
    return (
      <div
        ref={recentSearchListRef}
        className="absolute top-[var(--header-height)] w-screen max-w-xl left-1/2 -translate-x-1/2"
      >
        {Array.isArray(recentKeywords) &&
          (recentKeywords.length > 0 ? (
            <div className="flex flex-col bg-surface-1 px-4 py-[20px]">
              <div className="mb-[14px] flex items-center justify-between">
                <Text typo="body-1-bold" className="text-secondary">
                  {t('explore.explore_search_page.recent_keyword')}
                </Text>
                <button className="typo-button-4 text-caption" onClick={clearAllKeywords}>
                  {t('explore.explore_search_page.delete_all')}
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
                      <Text typo="body-1-medium" color="secondary">
                        {keyword}
                      </Text>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeKeyword(keyword)
                        }}
                        className="text-icon-sub"
                      >
                        <IcClose className="size-[20px]" fill="var(--color-gray-300)" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="h-[96px] bg-surface-1 flex-center">
              <Text typo="body-1-bold" color="sub">
                {t('explore.explore_search_page.no_results_recent')}
              </Text>
            </div>
          ))}
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
