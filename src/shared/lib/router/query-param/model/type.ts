/**
 * 쿼리 파라미터 값의 타입 (문자열, 문자열 배열, 또는 null)
 */
export type QueryParamValue = string | string[] | null

/**
 * 쿼리 파라미터 상태를 나타내는 타입
 */
export type QueryParams = Record<string, QueryParamValue>

/**
 * 쿼리 파라미터 설정 옵션
 */
export interface QueryParamOptions {
  /**
   * 브라우저 히스토리에 새 항목을 추가할지 여부
   * - true: pushState 사용 (새 히스토리 항목 생성)
   * - false: replaceState 사용 (현재 히스토리 항목 대체)
   * @default false
   */
  push?: boolean

  /**
   * 빈 값 처리 방법
   * - 'remove': 빈 값을 URL에서 완전히 제거
   * - 'preserve': 빈 값을 URL에 유지 (예: ?param=)
   * @default 'remove'
   */
  emptyHandling?: 'remove' | 'preserve'
}

/**
 * useQueryParam 훅의 반환 타입
 */
export interface UseQueryParamReturn<T extends QueryParamValue = QueryParamValue> {
  /**
   * 현재 쿼리 파라미터 값
   */
  value: T

  /**
   * 쿼리 파라미터 값을 설정하는 함수
   */
  setValue: (newValue: T, options?: QueryParamOptions) => void

  /**
   * 쿼리 파라미터를 초기화하는 함수
   */
  resetParam: (options?: QueryParamOptions) => void
}
