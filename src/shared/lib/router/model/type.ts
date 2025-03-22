import { type RouteConfig } from '../config'

/**
 * RouteConfig 키에서 추출한 경로 문자열 리터럴 타입
 * 예: '/', '/login', '/account' 등
 */
export type Pathname = keyof RouteConfig

/**
 * 주어진 경로에 대한 검색 파라미터 타입을 추출
 * @template T 경로 문자열 리터럴 타입
 */
export type SearchOf<T extends Pathname> = RouteConfig[T] extends { search: infer S extends object }
  ? S
  : Record<string, never>

/**
 * 검색 파라미터에서 허용되는 값 타입들
 * @template T 검색 파라미터 객체 타입
 */
export type AllowedSearch<T extends object> = {
  [K in keyof T]?: T[K] extends Array<infer _R>
    ? Array<string | number | boolean>
    : string | number | boolean
}

/**
 * 경로 문자열에서 파라미터를 추출하여 튜플 타입으로 변환
 * 예: '/user/:id' => [string]
 * @template T 경로 문자열 리터럴 타입
 */
export type ExtractRouteParamsTuple<T extends string> = T extends `${string}:${infer _Param}/${infer Rest}`
  ? [string, ...ExtractRouteParamsTuple<`/${Rest}`>]
  : T extends `${string}:${infer _Param}`
  ? [string]
  : []

/**
 * 경로에 따른 옵션 타입 (search, hash, params)
 * 파라미터가 없는 경로는 params 옵션을 받지 않음
 * @template T 경로 문자열 리터럴 타입
 * @template S 검색 파라미터 객체 타입
 */
export type Options<T extends Pathname, S extends object = AllowedSearch<SearchOf<T>>> =
  ExtractRouteParamsTuple<RouteConfig[T]['pathname']> extends infer P extends unknown[]
    ? P extends []
      ? { search?: string | S; hash?: string } // 파라미터가 없는 경로는 params 옵션 제외
      : { search?: string | S; hash?: string; params: P } // 파라미터가 있는 경로는 params 필수
    : never

/**
 * 내부 사용을 위한 확장된 옵션 타입
 * params를 선택적으로 만들고 빈 배열 할당 가능
 * @template T 경로 문자열 리터럴 타입
 * @template S 검색 파라미터 객체 타입
 */
export type ExtendedOptions<T extends Pathname, S extends object> = {
  search?: string | S
  hash?: string
  params?: ExtractRouteParamsTuple<RouteConfig[T]['pathname']>
}

/**
 * 경로에 따라 파라미터 옵션의 필수 여부를 결정하는 타입
 * 파라미터가 있는 경로는 옵션 객체가 필수, 없는 경로는 선택적
 * @template T 경로 문자열 리터럴 타입
 * @template S 검색 파라미터 객체 타입
 */
export type ParamOptions<T extends Pathname, S extends object> = ExtractRouteParamsTuple<
  RouteConfig[T]['pathname']
> extends []
  ? [options?: Options<T, S>]
  : [options: Options<T, S>]
