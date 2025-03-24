import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router'

import { RoutePath, SearchConfig } from '../config'
import { buildUrl } from '../lib'

/**
 * 경로 문자열 리터럴 타입
 */
type Pathname = (typeof RoutePath)[keyof typeof RoutePath]

/**
 * 주어진 경로에 대한 검색 파라미터 타입을 추출
 */
type SearchOf<T extends Pathname> = T extends keyof typeof SearchConfig
  ? (typeof SearchConfig)[T] extends infer S
    ? S extends undefined
      ? Record<string, unknown>
      : { [K in keyof S]?: S[K] }
    : Record<string, unknown>
  : Record<string, unknown>

/**
 * 경로 문자열에서 파라미터를 추출하여 튜플 타입으로 변환
 */
type ExtractRouteParamsTuple<T extends string> = T extends `${string}:${infer _Param}/${infer Rest}`
  ? [string, ...ExtractRouteParamsTuple<`/${Rest}`>]
  : T extends `${string}:${infer _Param}`
    ? [string]
    : []

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
  (ExtractRouteParamsTuple<T> extends []
    ? {
        to: T
        search?: SearchOf<T> | string
        hash?: string
        params?: []
      }
    : {
        to: T
        search?: SearchOf<T> | string
        hash?: string
        params: string[]
      })

/**
 * 타입 안전한 링크 컴포넌트
 *
 * 경로에 파라미터가 있는지에 따라 다른 속성을 요구
 *
 * @param props 컴포넌트 속성
 * @returns 렌더링된 링크 컴포넌트
 *
 * @example
 * // 파라미터가 없는 경로 (params 선택적)
 * <Link to="/account">계정</Link>
 * <Link to="/account" search={{ tab: 'profile' }}>프로필</Link>
 *
 * @example
 * // 파라미터가 있는 경로 (params 필수)
 * <Link to="/note/:noteId" params={['123']}>노트 123</Link>
 */
export const Link = <T extends Pathname>({ to, search, hash, params, ...rest }: CustomLinkProps<T>) => {
  const url = buildUrl(to, {
    search: search as Record<string, unknown>,
    hash,
    params,
  })
  return <RouterLink to={url} {...rest} />
}
