import { ExtendedOptions, Pathname } from '../model'

export const buildUrl = <T extends Pathname>(path: T, options: ExtendedOptions<T>): string => {
  let url: string = path

  // path에 있는 ":param"들을 순서대로 options.params의 값으로 치환
  if (options.params && options.params.length > 0) {
    let paramIndex = 0
    url = url.replace(/:([^/]+)/g, (_, key) => {
      if (paramIndex >= options.params.length) {
        throw new Error(`Missing parameter value for "${key}"`)
      }
      return encodeURIComponent(String(options.params[paramIndex++]))
    })
  }

  // 쿼리스트링 추가
  if (options.search) {
    url += (url.includes('?') ? '&' : '?') + options.search
  }

  // 해시 추가
  if (options.hash) {
    url += '#' + options.hash
  }

  return url
}
