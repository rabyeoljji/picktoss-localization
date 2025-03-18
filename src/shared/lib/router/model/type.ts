import type { NavigateOptions } from 'react-router'

import { RoutePath } from '../config'

/**
 * RoutePath의 구성 객체 타입
 */
export type RouteConfig = (typeof RoutePath)[keyof typeof RoutePath]

/**
 * 전체 Pathname 타입 (예: '/', '/login', '/workspace/:id', 등)
 */
export type Pathname = RouteConfig['pathname']

/**
 * 주어진 Pathname에 해당하는 search 객체 타입을 추출
 */
export type SearchOf<T extends Pathname> =
  Extract<RouteConfig, { pathname: T }> extends { search: infer S } ? S : Record<string, never>

/**
 * config에 정의된 search 타입은 항상 배열이므로, 각 프로퍼티의 타입은 배열의 요소 타입으로 변환
 * search는 모두 선택적(optional)으로 처리
 */
export type AllowedSearch<S> = {
  [K in keyof S]?: S[K] extends readonly (infer U)[] ? U : never
}

/**
 * 경로에서 파라미터를 tuple 형태로 추출하는 타입 헬퍼
 * 예: '/workspace/:id/details/:tabId' -> [string | number, string | number]
 */
export type ExtractRouteParamsTuple<T extends string> = T extends `${infer _Start}:${infer _Param}/${infer Rest}`
  ? [string | number, ...ExtractRouteParamsTuple<`/${Rest}`>]
  : T extends `${infer _Start}:${infer _Param}`
    ? [string | number]
    : []

/**
 * Options:
 * - 파라미터가 있는 경우 options.params는 해당 튜플과 정확히 일치해야 함
 * - search는 string 또는 AllowedSearch<SearchOf<T>>를 받을 수 있음
 */
export type Options<T extends Pathname, S extends object = AllowedSearch<SearchOf<T>>> =
  ExtractRouteParamsTuple<T> extends infer P extends unknown[]
    ? P extends []
      ? { search?: string | S; hash?: string; params?: [] }
      : { search?: string | S; hash?: string; params: P }
    : never

/**
 * ExtendedOptions:
 * - NavigateOptions에서 replace는 별도로 처리하므로 제외
 */
export type ExtendedOptions<T extends Pathname, S extends object = AllowedSearch<SearchOf<T>>> = Options<T, S> &
  Omit<NavigateOptions, 'replace'>

/**
 * ParamOptions:
 * - 파라미터 유무에 따라 options 인자의 필요 여부를 결정
 */
export type ParamOptions<T extends Pathname, S extends object = AllowedSearch<SearchOf<T>>> =
  ExtractRouteParamsTuple<T> extends [] ? [options?: ExtendedOptions<T, S>] : [options: ExtendedOptions<T, S>]
