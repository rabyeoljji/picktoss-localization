import { useEffect, useMemo, useState } from 'react'

import { useGetAllDocuments, useGetBookmarkedDocuments } from '@/entities/document/api/hooks'

import { useCheckList } from '@/shared/hooks/use-check-list'
import { useQueryParam } from '@/shared/lib/router'

/**
 * useNoteList
 *
 * (도서관)노트 메인 페이지(`/library`)의 상태 및 데이터 관리를 담당하는 커스텀 훅입니다.
 *
 * 주요 기능:
 * - 현재 활성 탭(`MY` / `BOOKMARK`) 관리
 * - 탭 전환 시 정렬 옵션 초기화
 * - 전체/개별 선택 모드를 관리 (`selectMode`)
 * - 내 문서 목록, 북마크 문서 목록을 가져오기
 * - 내 문서 체크리스트 상태 관리 (`useCheckList` 활용)
 * - 로딩 상태 제공
 *
 * @returns {Object}
 * - `activeTab`: 현재 활성화된 탭
 * - `setTab(tab: Tab)`: 탭 변경 함수
 * - `selectMode`: 선택 모드 활성화 여부
 * - `changeSelectMode(selectMode: boolean)`: 선택 모드 변경 함수
 * - `myDocsCheckList`: 내 문서 체크리스트 객체
 * - `isLoading`: 데이터 로딩 상태
 * - `myDocuments`: 내 문서 데이터 배열
 * - `bookmarkedDocuments`: 북마크한 문서 데이터 배열
 */
export const useNoteList = () => {
  const [selectMode, setSelectMode] = useState(false)

  // search params로 탭과 정렬 옵션 관리
  const [params, setParams] = useQueryParam('/library')
  const activeTab = params.tab
  const sortOption = params.sortOption
  const bookmarkedSortOption = params.bookmarkedSortOption

  type Tab = typeof activeTab

  // 정렬 옵션에 따라 데이터 페칭
  const memoizedOptions = useMemo(() => {
    return activeTab !== 'MY' ? { enabled: false } : sortOption ? { sortOption } : undefined
  }, [activeTab, sortOption])
  const memoizedBookmarkOptions = useMemo(() => {
    return activeTab !== 'BOOKMARK'
      ? { enabled: false }
      : bookmarkedSortOption
        ? { sortOption: bookmarkedSortOption }
        : undefined
  }, [activeTab, bookmarkedSortOption])

  const { data: myDocumentsData, isLoading: myDocumentsLoading } = useGetAllDocuments(memoizedOptions)
  const { data: bookmarkedDocumentsData, isLoading: bookmarkedDocumentsLoading } =
    useGetBookmarkedDocuments(memoizedBookmarkOptions)

  // 전체 로딩 상태
  const isLoading = myDocumentsLoading || bookmarkedDocumentsLoading

  // 데이터 페칭 중인지 여부
  // const isLoading = myDocumentFetching || bookmarkedFetching

  // 체크리스트 관리
  const myDocsCheckList = useCheckList(myDocumentsData?.documents ?? [])
  const { unCheckAll, set } = myDocsCheckList

  const setTab = (tab: Tab) => {
    if (tab === activeTab) return
    setParams({ tab, sortOption: null, bookmarkedSortOption: null })
  }

  const changeSelectMode = (selectMode: boolean) => {
    setSelectMode(selectMode)
  }

  useEffect(() => {
    if (!selectMode) {
      unCheckAll()
    }
  }, [selectMode])

  useEffect(() => {
    if (myDocumentsData?.documents) {
      set(myDocumentsData?.documents)
    }
  }, [myDocumentsData?.documents])

  return {
    activeTab,
    setTab,

    selectMode,
    changeSelectMode,

    myDocsCheckList,

    isLoading,
    myDocuments: myDocumentsData?.documents,
    bookmarkedDocuments: bookmarkedDocumentsData?.documents,
  }
}
