import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router'

import { buildUrl } from '../lib'
import type { AllowedSearch, ExtendedOptions, ExtractRouteParamsTuple, Pathname, SearchOf } from '../model/type'
import { type RouteConfig } from '../config'

/**
 * 라우트 경로에 따라 다르게 동작하는 링크 컴포넌트의 속성 타입
 * 
 * @template T 경로 문자열 리터럴 타입
 * 
 * 파라미터가 없는 경로:
 * - params는 선택적(optional)이며 빈 배열로 제한됨
 * 
 * 파라미터가 있는 경로:
 * - params는 필수이며 경로에 맞는 파라미터 튜플이어야 함
 * 
 * 모든 경로:
 * - search, hash는 선택적 옵션
 */
type CustomLinkProps<T extends Pathname> = Omit<RouterLinkProps, 'to'> &
  (ExtractRouteParamsTuple<RouteConfig[T]['pathname']> extends []
    ? { 
        to: T; 
        search?: string | AllowedSearch<SearchOf<T>>; 
        hash?: string; 
        params?: [] 
      }
    : {
        to: T
        search?: string | AllowedSearch<SearchOf<T>>
        hash?: string
        params: ExtractRouteParamsTuple<RouteConfig[T]['pathname']>
      })

/**
 * 타입 안전한 라우터 링크 컴포넌트
 * 
 * @template T 경로 문자열 리터럴 타입
 * @param props 링크 속성 (to, search, hash, params 및 기타 React Router Link 속성)
 * @returns Link 컴포넌트
 * 
 * @example
 * // 파라미터가 없는 경로
 * <Link to="/account">계정</Link>
 * 
 * @example
 * // 파라미터가 있는 경로
 * <Link to="/note/:noteId" params={["123"]}>노트 123</Link>
 * 
 * @example
 * // 검색 파라미터 추가
 * <Link to="/collection/search" search={{ query: "react" }}>React 검색</Link>
 */
export function Link<T extends Pathname>(props: CustomLinkProps<T>) {
  const { to, search, hash, params, ...rest } = props

  const options = { search, hash, params } as unknown as ExtendedOptions<T, AllowedSearch<SearchOf<T>>>
  const url = buildUrl<T, AllowedSearch<SearchOf<T>>>(to, options)
  return <RouterLink to={url} {...rest} />
}
