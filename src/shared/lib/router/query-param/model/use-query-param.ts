import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { SearchConfig } from '../../config'
import { buildUrl } from '../../lib'
import { Pathname } from '../../model/type'
import { extractParamsFromPath } from '../lib'
import { DEFAULT_QUERY_OPTIONS } from '../config'
import { QueryParamOptions } from './type'

// 더 명확한 리터럴 타입 추론을 위한 타입 정의
type RouteNames = keyof typeof SearchConfig

/**
 * ✅ StrictQueryParamKeys
 * 특정 경로에 대한 쿼리 파라미터 키 타입을 엄격하게 추출
 * 단순히 keyof보다 더 정확한 타입 추론을 제공
 */
type StrictQueryParamKeys<R extends RouteNames> = keyof typeof SearchConfig[R]

/**
 * ✅ StrictQueryParamValue
 * 특정 경로와 키에 대한 값 타입을 엄격하게 추출
 */
type StrictQueryParamValue<R extends RouteNames, K extends StrictQueryParamKeys<R>> = 
  typeof SearchConfig[R][K]

/**
 * ✅ QueryParamObject
 * 특정 경로에 대한 전체 쿼리 파라미터 객체 타입 추출
 */
type QueryParamObject<R extends string> = 
  R extends RouteNames
    ? typeof SearchConfig[R]
    : Record<string, unknown>

/**
 * 현재 URL의 쿼리 파라미터를 추출하고 설정하는 훅
 * SearchConfig에 정의된 초기값을 자동으로 사용합니다.
 * 
 * @param path 경로 문자열 (예: '/search', '/random-quiz')
 * @param key 쿼리 파라미터 키 (선택적, 키를 지정하지 않으면 모든 쿼리 파라미터를 객체로 반환)
 * @param options 옵션 객체 (선택적)
 * 
 * @example 기본 사용법 - 단일 파라미터 관리
 * const [name, setName] = useQueryParam('/progress-quiz/:quizId', 'name')  // ['유민' | '정우', (v: '유민' | '정우') => void]
 * const [date, setDate] = useQueryParam('/random-quiz', 'date')            // [string, (v: string) => void]
 *
 * @example 객체 형태로 모든 파라미터 관리
 * const [params, setParams] = useQueryParam('/progress-quiz/:quizId')  // [{ name: '유민' | '정우', emoji: string, date: string }, (updater) => void]
 * // 개별 값 업데이트
 * setParams({ ...params, name: '정우' })
 * // 함수형 업데이트
 * setParams(prev => ({ ...prev, name: '정우' }))
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

// 특정 경로와 키에 대한 정확한 타입 추론 (타입 검증이 강화됨)
// 가장 구체적인 오버로드를 첫 번째로 배치
export function useQueryParam<
  R extends RouteNames, 
  K extends StrictQueryParamKeys<R>
>(
  path: R,
  key: K,
  options?: QueryParamOptions,
): [StrictQueryParamValue<R, K>, (value: StrictQueryParamValue<R, K>, overrideOptions?: QueryParamOptions) => void, (overrideOptions?: QueryParamOptions) => void]

// 경로만 제공될 경우, 해당 경로의 모든 쿼리 파라미터 반환 (객체 형태)
export function useQueryParam<R extends RouteNames>(
  path: R,
  options?: QueryParamOptions,
): [
  QueryParamObject<R>, 
  (value: QueryParamObject<R> | ((prev: QueryParamObject<R>) => QueryParamObject<R>), overrideOptions?: QueryParamOptions) => void,
  (overrideOptions?: QueryParamOptions) => void
]

// 일반적인 string 경로와 키에 대한 오버로드 (가장 일반적인 오버로드이므로 마지막에 배치)
export function useQueryParam(
  path: string,
  key: string,
  options?: QueryParamOptions,
): [string, (value: string, overrideOptions?: QueryParamOptions) => void, (overrideOptions?: QueryParamOptions) => void]

// 실제 구현
export function useQueryParam<
  R extends string, 
  K extends string | undefined = undefined,
  T = K extends undefined 
      ? (R extends RouteNames ? QueryParamObject<R> : Record<string, unknown>)
      : (R extends RouteNames 
          ? (K extends StrictQueryParamKeys<R> 
              ? StrictQueryParamValue<R, K> 
              : string)
          : string)
>(
  path: R,
  keyOrOptions?: K | QueryParamOptions,
  optionsArg?: QueryParamOptions,
): [
  T, 
  (value: T | ((prev: T) => T), overrideOptions?: QueryParamOptions) => void,
  (overrideOptions?: QueryParamOptions) => void
] {
  const location = useLocation()
  const navigate = useNavigate()

  // key와 options 분리
  const key = typeof keyOrOptions === 'string' ? keyOrOptions : undefined
  const options = ((typeof keyOrOptions === 'string' ? optionsArg : keyOrOptions) || DEFAULT_QUERY_OPTIONS) as QueryParamOptions

  // 쿼리 파라미터 추출
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  // key가 제공되지 않은 경우 (객체 모드)
  const isObjectMode = key === undefined

  // 객체 모드: 모든 쿼리 파라미터 추출
  const paramsObject = useMemo(() => {
    if (!isObjectMode) return undefined

    // SearchConfig에서 초기값 가져오기
    const initialObject: Record<string, unknown> = {}
    
    if (path in SearchConfig && typeof SearchConfig[path as RouteNames] === 'object') {
      // SearchConfig의 모든 키에 대해 초기값 설정
      const configParams = SearchConfig[path as RouteNames] as Record<string, unknown>
      Object.keys(configParams).forEach(paramKey => {
        const paramValue = searchParams.get(paramKey)
        if (paramValue !== null) {
          // 타입에 따른 변환
          const initialValue = configParams[paramKey]
          if (typeof initialValue === 'number') {
            initialObject[paramKey] = Number(paramValue)
          } else if (typeof initialValue === 'boolean') {
            initialObject[paramKey] = paramValue === 'true'
          } else {
            initialObject[paramKey] = paramValue
          }
        } else {
          initialObject[paramKey] = configParams[paramKey]
        }
      })
    }

    return initialObject as T
  }, [isObjectMode, path, searchParams])

  // 단일 키 모드: 특정 키에 대한 값 추출
  const singleValue = useMemo(() => {
    if (isObjectMode || !key) return undefined
    
    // SearchConfig에서 초기값 가져오기
    let initialValue: unknown = ''
    
    if (
      path in SearchConfig && 
      SearchConfig[path as RouteNames] && 
      typeof SearchConfig[path as RouteNames] === 'object' &&
      key in (SearchConfig[path as RouteNames] as Record<string, unknown>)
    ) {
      initialValue = (SearchConfig[path as RouteNames] as Record<string, unknown>)[key]
    }

    const paramValue = searchParams.get(key)

    // URL에 해당 파라미터가 없으면 초기값 사용
    if (paramValue === null) {
      return initialValue as T
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
  }, [key, isObjectMode, searchParams, path])

  // 최종 반환 값
  const value = useMemo(() => {
    return isObjectMode ? paramsObject : singleValue
  }, [isObjectMode, paramsObject, singleValue]) as T

  // 값 설정 함수 - 객체 모드와 단일 키 모드 모두 지원
  const setValue = useCallback(
    (newValueOrUpdater: T | ((prev: T) => T), overrideOptions?: QueryParamOptions) => {
      // 함수형 업데이트 처리
      const newValue = typeof newValueOrUpdater === 'function' 
        ? (newValueOrUpdater as ((prev: T) => T))(value)
        : newValueOrUpdater

      // 현재 옵션과 오버라이드 옵션 병합
      const mergedOptions = { ...options, ...(overrideOptions || {}) }

      const newSearchParams = new URLSearchParams(location.search)

      if (isObjectMode && typeof newValue === 'object') {
        // 객체 모드: 모든 키에 대해 처리
        const params = newValue as Record<string, unknown>
        
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          if (
            paramValue === undefined ||
            paramValue === null ||
            (typeof paramValue === 'string' && paramValue === '' && mergedOptions.emptyHandling === 'remove')
          ) {
            newSearchParams.delete(paramKey)
          } else {
            newSearchParams.set(paramKey, String(paramValue))
          }
        })
      } else if (!isObjectMode && key) {
        // 단일 키 모드: 특정 키에 대해서만 처리
        if (
          newValue === undefined ||
          newValue === null ||
          (typeof newValue === 'string' && newValue === '' && mergedOptions.emptyHandling === 'remove')
        ) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(newValue))
        }
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

      // 탐색 방식 결정 (push 또는 replace)
      if (mergedOptions.push) {
        navigate(url)
      } else {
        navigate(url, { replace: true })
      }
    },
    [isObjectMode, key, location, navigate, path, options, value],
  )

  // 현재 경로에서 모든 쿼리 파라미터 삭제 함수
  const resetParam = useCallback((overrideOptions?: QueryParamOptions) => {
    // 현재 옵션과 오버라이드 옵션 병합
    const mergedOptions = { ...options, ...(overrideOptions || {}) }
    
    const newSearchParams = new URLSearchParams(location.search)
    
    if (isObjectMode) {
      // 객체 모드: 모든 쿼리 파라미터 삭제
      if (path in SearchConfig) {
        Object.keys(SearchConfig[path as RouteNames] || {}).forEach(paramKey => {
          newSearchParams.delete(paramKey)
        })
      }
    } else if (key) {
      // 단일 키 모드: 특정 키만 삭제
      newSearchParams.delete(key)
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
    
    // 탐색 방식 결정 (push 또는 replace)
    if (mergedOptions.push) {
      navigate(url)
    } else {
      navigate(url, { replace: true })
    }
  }, [isObjectMode, key, location, navigate, options, path])
  
  return [value, setValue, resetParam]
}
