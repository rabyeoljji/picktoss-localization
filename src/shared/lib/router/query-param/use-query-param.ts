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
 * 
 * @example 기본 사용법 - 초기값의 타입에 따라 반환 타입이 결정됨
 * const [name, setName] = useQueryParam('/random-quiz', 'name', '')        // [string, (v: string) => void]
 * const [count, setCount] = useQueryParam('/random-quiz', 'count', 0)      // [number, (v: number) => void]
 * const [active, setActive] = useQueryParam('/random-quiz', 'active', false) // [boolean, (v: boolean) => void]
 * 
 * @example 타입 검증
 * // '/random-quiz' 경로는 SearchConfig에 'date' 파라미터가 문자열로 정의됨
 * const [date, setDate] = useQueryParam('/random-quiz', 'date', '')  // 정상 작동
 * const [invalid, setInvalid] = useQueryParam('/random-quiz', 'invalid', '')  // 타입 오류
 */

// 타입 검증을 위한 오버로드
export function useQueryParam<R extends RouteKeys, K extends QueryParamKeys<R>>(
  path: R,
  key: K & string, 
  initialValue: (typeof SearchConfig)[R][K] & string
): [(typeof SearchConfig)[R][K] & string, (value: (typeof SearchConfig)[R][K] & string) => void]

export function useQueryParam<R extends RouteKeys, K extends QueryParamKeys<R>>(
  path: R,
  key: K & string,
  initialValue: (typeof SearchConfig)[R][K] & number
): [(typeof SearchConfig)[R][K] & number, (value: (typeof SearchConfig)[R][K] & number) => void]

export function useQueryParam<R extends RouteKeys, K extends QueryParamKeys<R>>(
  path: R,
  key: K & string,
  initialValue: (typeof SearchConfig)[R][K] & boolean
): [(typeof SearchConfig)[R][K] & boolean, (value: (typeof SearchConfig)[R][K] & boolean) => void]

// 일반적인 사용을 위한 오버로드
export function useQueryParam(
  path: string,
  key: string,
  initialValue: string
): [string, (value: string) => void]

export function useQueryParam(
  path: string,
  key: string,
  initialValue: number
): [number, (value: number) => void]

export function useQueryParam(
  path: string,
  key: string,
  initialValue: boolean
): [boolean, (value: boolean) => void]

// 실제 구현
export function useQueryParam<T extends string | number | boolean>(
  path: string,
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const location = useLocation()
  const navigate = useNavigate()

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

    navigate(url, { replace: true })
  }, [key, location, navigate, path])

  return [value, setValue]
}
