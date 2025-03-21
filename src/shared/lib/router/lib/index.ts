import { RoutePath } from '../config'
import type { ExtendedOptions, Pathname } from '../model/type'

/**
 * 객체 형태의 search 옵션을 URL 쿼리스트링으로 변환하는 헬퍼 함수
 */
const stringifySearch = (search: object): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)))
    } else {
      params.set(key, String(value))
    }
  }
  return params.toString()
}

/**
 * 주어진 경로와 옵션(search, hash, params)을 이용해 최종 URL을 생성
 */
export const buildUrl = <T extends Pathname, S extends object>(path: T, options: ExtendedOptions<T, S>): string => {
  // 실제 pathname을 가져옵니다. (예: '/workspace/:id' -> '/workspace/:id')
  const pathString = RoutePath[path]
  let url: string = pathString

  // path 내의 ":param"들을 순서대로 options.params의 값으로 치환
  if (options.params && options.params.length > 0) {
    let paramIndex = 0
    url = url.replace(/:([^/]+)/g, (_, key) => {
      if (paramIndex >= options.params.length) {
        throw new Error(`Missing parameter value for "${key}"`)
      }
      return encodeURIComponent(String(options.params[paramIndex++]))
    })
  }

  // search 옵션: 문자열이면 그대로, 객체면 URLSearchParams로 변환
  if (options.search) {
    const searchStr = typeof options.search === 'string' ? options.search : stringifySearch(options.search)
    url += (url.includes('?') ? '&' : '?') + searchStr
  }

  // hash 옵션 추가
  if (options.hash) {
    url += '#' + options.hash
  }

  return url
}
