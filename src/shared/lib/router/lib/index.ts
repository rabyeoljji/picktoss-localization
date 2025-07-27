/**
 * 객체 형태의 search 옵션을 URL 쿼리스트링으로 변환하는 헬퍼 함수
 * @param search 쿼리 파라미터 객체
 * @returns URL 쿼리스트링 (예: 'key1=value1&key2=value2')
 */
const stringifySearch = (search: object): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)))
    } else if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  }
  return params.toString()
}

/**
 * 주어진 경로와 옵션(search, hash, params)을 이용해 최종 URL을 생성
 * @template T 경로 문자열 리터럴 타입
 * @param path 라우트 경로 (예: '/account', '/quiz-detail/:noteId')
 * @param options URL 생성 옵션 (search, hash, params)
 * @returns 완성된 URL 문자열
 */
export const buildUrl = <T extends string>(
  path: T,
  options: {
    search?: Record<string, unknown> | string | object
    hash?: string
    params?: string[] | readonly string[]
  },
): string => {
  // 실제 pathname을 가져옵니다. (경로 문자열 key 자체가 pathname)
  const pathString = path
  let url: string = pathString

  // path 내의 ":param"들을 순서대로 options.params의 값으로 치환
  if (options.params && options.params.length > 0) {
    let paramIndex = 0
    url = url.replace(/:([^/]+)/g, (_, key) => {
      if (paramIndex >= (options.params?.length || 0)) {
        throw new Error(`Missing parameter value for "${key}"`)
      }
      return encodeURIComponent(String(options.params?.[paramIndex++]))
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
