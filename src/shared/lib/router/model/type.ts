import { NavigateOptions } from 'react-router'

import { RoutePath } from '../config'

/**
 * 전체 Pathname 타입 (예: '/home', '/users/:id', '/users/:id/friends/:friendId' 등)
 */
export type Pathname = (typeof RoutePath)[keyof typeof RoutePath]

/**
 * 경로에서 파라미터를 tuple 형태로 추출하는 타입 헬퍼
 * 예: '/users/:id/friends/:friendId' -> [string | number, string | number]
 */
export type ExtractRouteParamsTuple<T extends string> = T extends `${infer _Start}:${infer _Param}/${infer Rest}`
  ? [string | number, ...ExtractRouteParamsTuple<`/${Rest}`>]
  : T extends `${infer _Start}:${infer _Param}`
    ? [string | number]
    : []

/**
 * 파라미터가 있는 경우, options.params는 해당 튜플과 정확히 일치해야 함
 */
export type Options<T extends Pathname> =
  ExtractRouteParamsTuple<T> extends infer P extends unknown[]
    ? P extends []
      ? { search?: string; hash?: string; params?: [] }
      : { search?: string; hash?: string; params: P }
    : never

/**
 * NavigateOptions에서 replace는 push와 replace 메서드로 구분해서 처리하므로 제외
 */
export type ExtendedOptions<T extends Pathname> = Options<T> & Omit<NavigateOptions, 'replace'>

/**
 * "파라미터가 있는 경로" vs "파라미터가 없는 경로"에 따라
 * options 인자의 필요 여부를 구분하는 타입
 */
export type ParamOptions<T extends Pathname> =
  ExtractRouteParamsTuple<T> extends [] // 파라미터가 없다면
    ? [options?: ExtendedOptions<T>] // options는 선택
    : [options: ExtendedOptions<T>] // 파라미터가 있으면 반드시 options 필요
