import { StorageKey, useLocalStorage } from '@/shared/lib/storage'
import { StorageKeyType } from '@/shared/lib/storage/model/type'

/**
 * 최근 검색어 관리를 위한 커스텀 훅
 *
 * @param storageKey 최근 검색어를 저장할 스토리지 키
 * @returns 최근 검색어 관련 상태와 핸들러 함수들
 */
export const useRecentSearches = (storageKey: StorageKeyType = StorageKey.exploreRecentSearchKeyword) => {
  const [recentKeywords, setRecentKeywords] = useLocalStorage(storageKey, [])

  /**
   * 특정 검색어 삭제 함수
   * @param keywordToRemove 삭제할 검색어
   */
  const removeKeyword = (keywordToRemove: string) => {
    if (Array.isArray(recentKeywords)) {
      setRecentKeywords(recentKeywords.filter((keyword) => keyword !== keywordToRemove))
    }
  }

  /**
   * 모든 검색어 삭제 함수
   */
  const clearAllKeywords = () => {
    setRecentKeywords([])
  }

  /**
   * 새 검색어 추가 함수
   * @param newKeyword 추가할 검색어
   * @param maxItems 최대 유지할 검색어 수 (기본값: 5)
   */
  const addKeyword = (newKeyword: string, maxItems: number = 5) => {
    if (!newKeyword.trim()) return

    setRecentKeywords(
      [
        newKeyword,
        ...(Array.isArray(recentKeywords) ? recentKeywords.filter((keyword) => keyword !== newKeyword) : []),
      ].slice(0, maxItems),
    )
  }

  return {
    recentKeywords,
    addKeyword,
    removeKeyword,
    clearAllKeywords,
  }
}
