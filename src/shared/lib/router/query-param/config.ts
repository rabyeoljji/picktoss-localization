/**
 * 쿼리 파라미터 관련 기본 설정
 */
export const DEFAULT_QUERY_OPTIONS = {
  /**
   * 브라우저 히스토리에 새 항목을 추가할지 여부 (기본값: true)
   */
  push: false,

  /**
   * 빈 값 처리 방법 (기본값: 'remove')
   */
  emptyHandling: 'remove' as const,

  /**
   * URL 변경 시 상태를 자동으로 동기화할지 여부 (기본값: true)
   */
  syncWithUrl: true,
}
