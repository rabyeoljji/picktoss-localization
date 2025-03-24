import { useCallback, useEffect, useState } from 'react'

import { QueryParamOptions, QueryParamValue, UseQueryParamReturn } from '.'
import { DEFAULT_QUERY_OPTIONS } from '../config'
import { getQueryParam, removeQueryParam, setQueryParam } from '../lib'

/**
 * URL 쿼리 파라미터를 React 상태로 사용할 수 있게 해주는 훅
 *
 * @param paramKey 사용할 쿼리 파라미터 키
 * @param initialValue 초기값 (URL에 해당 쿼리 파라미터가 없을 경우 사용)
 * @param options 쿼리 파라미터 옵션
 * @returns 쿼리 파라미터 값과 관련 함수들
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * const { value, setValue } = useQueryParam('search')
 *
 * // 초기값 설정
 * const { value, setValue } = useQueryParam('page', '1')
 *
 * // 옵션 설정
 * const { value, setValue, removeParam } = useQueryParam('filter', null, {
 *   push: false, // 브라우저 히스토리에 새 항목을 추가하지 않음
 *   emptyHandling: 'preserve' // 빈 값을 URL에 유지 (예: ?filter=)
 * })
 * ```
 */
export function useQueryParam<T extends QueryParamValue = QueryParamValue>(
  paramKey: string,
  initialValue: T = null as T,
  options: QueryParamOptions & { syncWithUrl?: boolean } = {},
): UseQueryParamReturn<T> {
  // 옵션 설정 (기본값과 병합)
  const { syncWithUrl = DEFAULT_QUERY_OPTIONS.syncWithUrl, ...queryOptions } = {
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  }

  // URL에서 초기값을 가져옴 (없으면 전달받은 initialValue 사용)
  const getInitialValue = useCallback((): T => {
    // SSR에서는 초기값 사용
    if (typeof window === 'undefined') {
      return initialValue
    }

    const urlValue = getQueryParam(paramKey)
    return (urlValue !== null ? urlValue : initialValue) as T
  }, [paramKey, initialValue])

  // 상태 초기화
  const [value, setValueState] = useState<T>(getInitialValue)

  // 값 설정 함수
  const setValue = (newValue: T, setOptions?: QueryParamOptions) => {
    // 상태 업데이트
    setValueState(newValue)

    // URL 업데이트
    setQueryParam(paramKey, newValue, {
      ...queryOptions,
      ...setOptions,
    })
  }

  // 파라미터 제거 함수
  const removeParam = (removeOptions?: QueryParamOptions) => {
    // 상태 업데이트
    setValueState(null as T)

    // URL에서 파라미터 제거
    removeQueryParam(paramKey, {
      ...queryOptions,
      ...removeOptions,
    })
  }

  // URL 변경 이벤트 감지 및 상태 동기화
  useEffect(() => {
    if (!syncWithUrl || typeof window === 'undefined') {
      return
    }

    // URL 변경 시 상태 업데이트
    const handleLocationChange = () => {
      const newValue = getQueryParam(paramKey)
      setValueState(newValue !== null ? (newValue as T) : (initialValue as T))
    }

    // 초기 실행
    handleLocationChange()

    // 이벤트 리스너 등록
    const handlePopState = () => {
      handleLocationChange()
    }

    // 사용자 정의 이벤트 (URL 변경 시 발생)
    window.addEventListener('locationchange', handleLocationChange)

    // 브라우저 뒤로가기/앞으로가기 이벤트
    window.addEventListener('popstate', handlePopState)

    // 정리 함수
    return () => {
      window.removeEventListener('locationchange', handleLocationChange)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [paramKey, initialValue, syncWithUrl])

  return { value, setValue, removeParam }
}
