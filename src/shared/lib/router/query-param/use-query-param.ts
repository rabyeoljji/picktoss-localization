import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { SearchConfig } from '../config'
import { buildUrl } from '../lib'
import { Pathname } from '../model/type'

// SearchConfig 경로 타입
type RouteKeys = keyof typeof SearchConfig;

// SearchConfig에서 경로에 따른 쿼리 파라미터 키 타입
type QueryParamKeys<R extends RouteKeys> = keyof (typeof SearchConfig)[R];

/**
 * 현재 URL 경로에서 pathname 추출
 */
const extractPathnameFromPath = (path: string): RouteKeys | undefined => {
  // URL에서 쿼리 문자열과 해시 제거
  const pathWithoutQuery = path.split('?')[0].split('#')[0]

  // 모든 경로 패턴과 비교
  for (const pattern of Object.keys(SearchConfig)) {
    // 정확한 일치 확인
    if (pattern === pathWithoutQuery) {
      return pattern as RouteKeys
    }

    // 동적 경로 매개변수 처리
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/')
      const pathParts = pathWithoutQuery.split('/')

      if (patternParts.length !== pathParts.length) {
        continue
      }

      let isMatch = true
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          continue
        }

        if (patternParts[i] !== pathParts[i]) {
          isMatch = false
          break
        }
      }

      if (isMatch) {
        return pattern as RouteKeys
      }
    }
  }

  return undefined
}

/**
 * URL 경로에서 params 값 추출
 */
const extractParamsFromPath = (pattern: string, path: string): string[] => {
  const patternParts = pattern.split('/')
  const pathParts = path.split('?')[0].split('#')[0].split('/')
  const params: string[] = []

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params.push(pathParts[i])
    }
  }

  return params
}

/**
 * 현재 URL의 쿼리 파라미터를 추출하고 설정하는 훅
 * 
 * @example 기본 사용법 - 초기값의 타입에 따라 반환 타입이 결정됨
 * const [name, setName] = useQueryParam('name', '')        // [string, (v: string) => void]
 * const [count, setCount] = useQueryParam('count', 0)      // [number, (v: number) => void]
 * const [active, setActive] = useQueryParam('active', false) // [boolean, (v: boolean) => void]
 * 
 * @example 명시적 경로 지정 - 해당 경로의 SearchConfig 기반 타입 검증
 * // '/random-quiz' 경로는 SearchConfig에 'date' 파라미터가 문자열로 정의됨
 * const [date, setDate] = useQueryParam('date', '', '/random-quiz')  // 정상 작동
 * const [invalid, setInvalid] = useQueryParam('invalid', '', '/random-quiz')  // 타입 오류
 */

// #1: 명시적 경로와 타입 검증을 위한 오버로드 (문자열 타입)
export function useQueryParam<
  R extends RouteKeys,
  K extends QueryParamKeys<R>
>(
  key: K & string, 
  initialValue: (typeof SearchConfig)[R][K] & string,
  explicitPath: R
): [(typeof SearchConfig)[R][K] & string, (value: (typeof SearchConfig)[R][K] & string) => void];

// #2: 명시적 경로와 타입 검증을 위한 오버로드 (숫자 타입)
export function useQueryParam<
  R extends RouteKeys,
  K extends QueryParamKeys<R>
>(
  key: K & string,
  initialValue: (typeof SearchConfig)[R][K] & number, 
  explicitPath: R
): [(typeof SearchConfig)[R][K] & number, (value: (typeof SearchConfig)[R][K] & number) => void];

// #3: 명시적 경로와 타입 검증을 위한 오버로드 (불리언 타입)
export function useQueryParam<
  R extends RouteKeys,
  K extends QueryParamKeys<R>
>(
  key: K & string,
  initialValue: (typeof SearchConfig)[R][K] & boolean,
  explicitPath: R
): [(typeof SearchConfig)[R][K] & boolean, (value: (typeof SearchConfig)[R][K] & boolean) => void];

// #4: 일반적인 문자열 타입 오버로드
export function useQueryParam(
  key: string,
  initialValue: string
): [string, (value: string) => void];

// #5: 일반적인 숫자 타입 오버로드
export function useQueryParam(
  key: string,
  initialValue: number
): [number, (value: number) => void];

// #6: 일반적인 불리언 타입 오버로드
export function useQueryParam(
  key: string,
  initialValue: boolean
): [boolean, (value: boolean) => void];

// 실제 구현
export function useQueryParam<T extends string | number | boolean>(
  key: string,
  initialValue: T,
  explicitPath?: RouteKeys
): [T, (value: T) => void] {
  const location = useLocation()
  const navigate = useNavigate()

  // 경로 결정
  const pathname = useMemo(() => {
    return explicitPath || extractPathnameFromPath(location.pathname)
  }, [location.pathname, explicitPath])

  // 쿼리 파라미터 추출
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

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
      return (paramValue === 'true') as T
    }

    return paramValue as T
  }, [key, searchParams, initialValue])

  // 값 설정 함수
  const setValue = useCallback((newValue: T) => {
    const newSearchParams = new URLSearchParams(location.search)

    if (newValue === undefined || newValue === null) {
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

    if (pathname && pathname in SearchConfig) {
      // 경로 패턴에서 params 추출
      const paramsFromPath = extractParamsFromPath(pathname, location.pathname)

      // URL 업데이트
      url = buildUrl(pathname as Pathname, {
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

    navigate(url, { replace: true })
  }, [key, location, navigate, pathname])

  return [value, setValue]
}
