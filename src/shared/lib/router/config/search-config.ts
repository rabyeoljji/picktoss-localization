import { RouteConfig } from './index'

/**
 * 경로 문자열을 키로 사용하여 검색 파라미터 매핑
 * pathname -> search 객체 매핑을 위한 내부 유틸리티 타입
 */
type PathWithSearch = {
  [K in keyof typeof RouteConfig]: (typeof RouteConfig)[K] extends { pathname: infer P; search: infer S }
    ? P extends string
      ? { path: P; search: S }
      : never
    : never
}[keyof typeof RouteConfig]

/**
 * 경로별 검색 파라미터 설정
 * 
 * pathname을 키로 사용하고, 해당 경로에 대한 검색 파라미터를 값으로 갖는 객체
 * 
 * @example
 * // '/search' 경로에 대한 검색 파라미터 타입 추출
 * type SearchParams = typeof SearchConfig['/search']
 */
export const SearchConfig = Object.fromEntries(
  Object.entries(RouteConfig).flatMap(([_, value]) => {
    if ('search' in value) {
      return [[value.pathname, value.search]]
    }
    return []
  }),
) as {
  [P in PathWithSearch['path']]: Extract<PathWithSearch, { path: P }>['search']
}
