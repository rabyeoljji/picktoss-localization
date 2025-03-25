import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { QueryParamOptions } from '@/shared/lib/router/query-param/type'

import { SearchConfig } from '../config'
import { buildUrl } from '../lib'
import { Pathname } from '../model/type'
import { DEFAULT_QUERY_OPTIONS } from './config'

// SearchConfig 경로 타입
type RouteKeys = keyof typeof SearchConfig

// SearchConfig에서 경로에 따른 쿼리 파라미터 키 타입
type QueryParamKeys<R extends RouteKeys> = keyof (typeof SearchConfig)[R]

// SearchConfig에서 경로와 키에 따른 값 타입 (정확한 리터럴 타입 추론을 위해 개선)
type QueryParamValue<R extends RouteKeys, K extends QueryParamKeys<R>> = 
  (typeof SearchConfig)[R][K] extends infer V ? V : never

/**
 * URL 경로에서 params 값 추출
 */
const extractParamsFromPath = (pattern: string, path: string): string[] => {
  const patternParts = pattern.split('/')
  const pathParts = path.split('?')[0].split('#')[0].split('/')

  const params: string[] = []

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':') && i < pathParts.length) {
      params.push(pathParts[i])
    }
  }

  return params
}

/**
 * 현재 URL의 쿼리 파라미터를 추출하고 설정하는 훅
 * SearchConfig에 정의된 초기값을 자동으로 사용합니다.
 * 
 * @param path 경로 문자열 (예: '/search', '/random-quiz')
 * @param key 쿼리 파라미터 키 (예: 'q', 'page')
 * @param options 옵션 객체 (선택적)
 * 
 * @example 기본 사용법 - SearchConfig에 정의된 타입에 따라 반환 타입이 결정됨
 * const [name, setName] = useQueryParam('/progress-quiz/:quizId', 'name')  // ['유민' | '정우', (v: '유민' | '정우') => void]
 * const [date, setDate] = useQueryParam('/random-quiz', 'date')            // [string, (v: string) => void]
 *
 * @example 타입 검증
 * // '/random-quiz' 경로는 SearchConfig에 'date' 파라미터가 문자열로 정의됨
 * const [date, setDate] = useQueryParam('/random-quiz', 'date')  // 정상 작동
 * const [invalid, setInvalid] = useQueryParam('/random-quiz', 'invalid')  // 타입 오류
 *
 * @example 옵션 설정
 * const [filter, setFilter] = useQueryParam('/search', 'filter', {
 *   push: true, // 브라우저 히스토리에 새 항목을 추가함 (기본값: false)
 *   emptyHandling: 'preserve' // 빈 값을 URL에 유지 (예: ?filter=) (기본값: 'remove')
 * })
 */

// 타입 검증을 위한 오버로드 - 특정 경로와 키에 대한 정확한 타입 추론
export function useQueryParam<
  R extends RouteKeys, 
  K extends QueryParamKeys<R>
>(
  path: R,
  key: K,
  options?: QueryParamOptions,
): [QueryParamValue<R, K>, (value: QueryParamValue<R, K>) => void]

// 일반적인 문자열 파라미터에 대한 오버로드
export function useQueryParam(
  path: string,
  key: string,
  options?: QueryParamOptions,
): [string, (value: string) => void]

// 실제 구현
export function useQueryParam<
  R extends string, 
  K extends string,
  T = R extends RouteKeys 
      ? K extends QueryParamKeys<R & RouteKeys> 
        ? QueryParamValue<R & RouteKeys, K & QueryParamKeys<R & RouteKeys>> 
        : string
      : string
>(
  path: R,
  key: K,
  options: QueryParamOptions = DEFAULT_QUERY_OPTIONS,
): [T, (value: T) => void] {
  const location = useLocation()
  const navigate = useNavigate()

  // 쿼리 파라미터 추출
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  // SearchConfig에서 초기값 가져오기
  const initialValue = useMemo(() => {
    // path가 SearchConfig에 있고, key가 해당 path의 SearchConfig에 있는 경우
    if (
      path in SearchConfig && 
      SearchConfig[path as RouteKeys] && 
      typeof SearchConfig[path as RouteKeys] === 'object' &&
      key in (SearchConfig[path as RouteKeys] as Record<string, unknown>)
    ) {
      return (SearchConfig[path as RouteKeys] as Record<string, unknown>)[key] as T
    }
    
    // 기본값으로 빈 문자열 반환 (경로나 키가 SearchConfig에 정의되지 않은 경우)
    return ('' as unknown) as T
  }, [path, key])

  // 값 계산
  const value = useMemo(() => {
    const paramValue = searchParams.get(key)

    // URL에 해당 파라미터가 없으면 초기값 사용
    if (paramValue === null) {
      return initialValue
    }

    // 초기값 타입에 따른 변환
    if (typeof initialValue === 'number') {
      return Number(paramValue) as T
    }

    if (typeof initialValue === 'boolean') {
      return (paramValue === 'true') as unknown as T
    }

    // 특별한 경우 리터럴 타입을 유지하기 위한 처리
    if (
      path === '/progress-quiz/:quizId' && 
      key === 'name' && 
      (paramValue === '유민' || paramValue === '정우')
    ) {
      return paramValue as unknown as T
    }

    return paramValue as unknown as T
  }, [key, searchParams, initialValue, path])

  // 값 설정 함수
  const setValue = useCallback(
    (newValue: T) => {
      const newSearchParams = new URLSearchParams(location.search)

      if (
        newValue === undefined ||
        newValue === null ||
        (typeof newValue === 'string' && newValue === '' && options.emptyHandling === 'remove')
      ) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(newValue))
      }

      // 현재 모든 쿼리 파라미터를 객체로 변환
      const searchEntries: [string, string][] = []
      newSearchParams.forEach((value, key) => {
        searchEntries.push([key, value])
      })
      const searchObj = Object.fromEntries(searchEntries)

      // URL 생성
      let url: string

      if (path && path in SearchConfig) {
        // 경로 패턴에서 params 추출
        const paramsFromPath = extractParamsFromPath(path, location.pathname)

        // URL 업데이트
        url = buildUrl(path as Pathname, {
          search: searchObj,
          hash: location.hash ? location.hash.substring(1) : undefined,
          params: paramsFromPath,
        })
      } else {
        // 매치되는 pathname이 없으면 현재 URL에 쿼리 스트링만 변경
        const search = newSearchParams.toString()
        const newSearch = search ? `?${search}` : ''
        const hash = location.hash || ''
        url = `${location.pathname}${newSearch}${hash}`
      }

      // 히스토리 옵션에 따라 navigate 호출
      navigate(url, { replace: !options.push })
    },
    [key, location, navigate, path, options],
  )

  return [value, setValue]
}
