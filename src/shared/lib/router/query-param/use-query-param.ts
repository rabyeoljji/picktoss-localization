import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { SearchConfig } from '../config'
import { buildUrl } from '../lib'
import { Pathname, SearchOf } from '../model/type'

/**
 * 현재 URL 경로에서 pathname을 추출하는 함수
 * 예: '/progress-quiz/123?name=유민' => '/progress-quiz/:quizId'
 */
const extractPathnameFromPath = (path: string): string | undefined => {
  // URL에서 쿼리 문자열과 해시를 제거
  const pathWithoutQuery = path.split('?')[0].split('#')[0]

  // 모든 경로 패턴과 비교
  for (const pattern of Object.keys(SearchConfig)) {
    // 정확한 일치 먼저 확인
    if (pattern === pathWithoutQuery) {
      return pattern
    }

    // 패턴에 매개변수가 있으면 정규표현식으로 매칭
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/')
      const pathParts = pathWithoutQuery.split('/')

      // 경로 세그먼트 수가 다르면 일치하지 않음
      if (patternParts.length !== pathParts.length) {
        continue
      }

      let isMatch = true
      for (let i = 0; i < patternParts.length; i++) {
        // 패턴 세그먼트가 ':param'으로 시작하면 경로 매개변수로 간주하고 무조건 매치
        if (patternParts[i].startsWith(':')) {
          continue
        }

        // 일반 세그먼트는 정확히 일치해야 함
        if (patternParts[i] !== pathParts[i]) {
          isMatch = false
          break
        }
      }

      if (isMatch) {
        return pattern
      }
    }
  }

  return undefined
}

/**
 * 현재 URL 경로에서 params 값을 추출하는 함수
 * 예: 패턴 '/progress-quiz/:quizId'와 경로 '/progress-quiz/123' => ['123']
 */
const extractParamsFromPath = (pattern: string, path: string): (string | number)[] => {
  const patternParts = pattern.split('/')
  const pathParts = path.split('?')[0].split('#')[0].split('/')
  const params: (string | number)[] = []

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramValue = pathParts[i]
      // 숫자인 경우 숫자로 변환
      if (!isNaN(Number(paramValue)) && paramValue !== '') {
        params.push(Number(paramValue))
      } else {
        params.push(paramValue)
      }
    }
  }

  return params
}

/**
 * 현재 URL의 쿼리 파라미터를 추출하고 설정하는 훅
 * SearchConfig를 기반으로 해당 경로에 맞는 파라미터 타입을 자동으로 추론
 *
 * @template P 경로 패턴(자동 추론 또는 명시적으로 지정)
 * @template K 쿼리 파라미터 키
 * @param {K} key 쿼리 파라미터 키
 * @param {V} initialValue 초기값 (선택적)
 * @param {P} explicitPath 명시적 경로 패턴 (선택적)
 * @returns {[V, (value: V) => void]} 쿼리 파라미터 값과 설정 함수의 튜플
 *
 * @example
 * // 현재 URL이 '/progress-quiz/123?name=유민'일 경우
 * const [name, setName] = useQueryParam('name', '유민')
 * console.log(name) // '유민' (URL에서 가져온 값)
 *
 * // 명시적으로 경로 패턴을 지정하는 경우
 * const [date, setDate] = useQueryParam('date', '', '/random-quiz')
 */
export function useQueryParam<
  P extends keyof typeof SearchConfig = keyof typeof SearchConfig,
  K extends string = string,
  V = K extends keyof (typeof SearchConfig)[P] ? (typeof SearchConfig)[P][K] : string,
>(key: K, initialValue?: V, explicitPath?: P): [V, (value: V) => void] {
  const location = useLocation()
  const navigate = useNavigate()

  // 명시적으로 지정된 경로가 있으면 사용, 없으면 현재 경로에서 추출
  const pathname = useMemo(() => {
    return explicitPath || extractPathnameFromPath(location.pathname)
  }, [location.pathname, explicitPath])

  // 현재 URL에서 쿼리 파라미터 추출
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  // 쿼리 파라미터 값 계산
  const value = useMemo(() => {
    const paramValue = searchParams.get(key)

    // URL에 해당 파라미터가 없으면 초기값 사용
    if (paramValue === null) {
      return initialValue as V
    }

    // 현재 경로에 대한 SearchConfig가 없으면 문자열 그대로 반환
    if (!pathname || !(pathname in SearchConfig) || SearchConfig[pathname as P] === undefined) {
      return paramValue as unknown as V
    }

    // SearchConfig 기반으로 타입 변환
    const config = SearchConfig[pathname as P] as Record<string, unknown>

    // 타입에 따라 적절한 변환 수행
    if (key in config) {
      const expectedValue = config[key]

      if (typeof expectedValue === 'number') {
        return Number(paramValue) as unknown as V
      }

      if (typeof expectedValue === 'boolean') {
        return (paramValue === 'true') as unknown as V
      }
    }

    return paramValue as unknown as V
  }, [key, searchParams, pathname, initialValue])

  // 쿼리 파라미터 설정 함수
  const setValue = useCallback(
    (newValue: V) => {
      const newSearchParams = new URLSearchParams(location.search)

      if (newValue === undefined || newValue === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(newValue))
      }

      // 현재 모든 query params 를 객체로 변환
      const searchEntries: [string, string][] = []
      newSearchParams.forEach((value, key) => {
        searchEntries.push([key, value])
      })

      // Record<string, string>에서 SearchOf<P>로 변환
      const searchObj = Object.fromEntries(searchEntries) as unknown as SearchOf<P>

      // router.buildUrl 대신 직접 URL 생성
      let url: string

      if (pathname && pathname in SearchConfig) {
        // 경로 패턴에서 params 추출
        const paramsFromPath = extractParamsFromPath(pathname, location.pathname)

        // 모든 params를 문자열로 변환
        const stringParams = paramsFromPath.map(String)

        // 현재 URL 업데이트 (경로는 동일하게 유지)
        // buildUrl 함수를 사용하여 URL 생성
        url = buildUrl(pathname as Pathname, {
          search: searchObj,
          hash: location.hash ? location.hash.substring(1) : undefined,
          params: stringParams,
        })
      } else {
        // 매치되는 pathname이 없으면 현재 URL에 쿼리 스트링만 변경
        const search = newSearchParams.toString()
        const newSearch = search ? `?${search}` : ''
        const hash = location.hash || ''
        url = `${location.pathname}${newSearch}${hash}`
      }

      // replace 대신 navigate 사용 (history 스택에 새 항목 추가하지 않음)
      navigate(url, { replace: true })
    },
    [key, location, navigate, pathname],
  )

  return [value, setValue] as const
}
