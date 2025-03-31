/**
 * 쿼리 파라미터 관련 기본 설정
 */
export const DEFAULT_QUERY_OPTIONS = {
  /**
   * 브라우저 히스토리에 새 항목을 추가할지 여부
   * - true: pushState 사용 (새 히스토리 항목 생성)
   * - false: replaceState 사용 (현재 히스토리 항목 대체)
   * @default false
   */
  push: false,

  /**
   * 빈 값 처리 방법
   * - 'remove': 빈 값을 URL에서 완전히 제거 (예: ?filter='' → URL에서 제거)
   * - 'preserve': 빈 값을 URL에 유지 (예: ?filter='')
   * @default 'remove'
   */
  emptyHandling: 'remove' as const,
} as const
