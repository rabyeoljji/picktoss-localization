import { useNavigate } from 'react-router'

import * as R from 'remeda'

import { buildUrl } from '../lib'
import type { AllowedSearch, ExtendedOptions, ParamOptions, Pathname, SearchOf } from '../model'

export const useRouter = () => {
  const navigate = useNavigate()

  /**
   * push
   * - 파라미터가 있는 경로라면 options는 필수, 없는 경로는 생략 가능
   */
  function push<T extends Pathname>(path: T, ...rest: ParamOptions<T, AllowedSearch<SearchOf<T>>>) {
    const options = (rest[0] ?? {}) as ExtendedOptions<T, AllowedSearch<SearchOf<T>>>
    const url = buildUrl<T, AllowedSearch<SearchOf<T>>>(path, options)
    navigate(url, {
      ...R.omit(options, ['search', 'hash', 'params']),
    })
  }

  /**
   * replace
   * - push와 동일하되, navigate 옵션에 replace: true를 추가
   */
  function replace<T extends Pathname>(path: T, ...rest: ParamOptions<T, AllowedSearch<SearchOf<T>>>) {
    const options = (rest[0] ?? {}) as ExtendedOptions<T, AllowedSearch<SearchOf<T>>>
    const url = buildUrl<T, AllowedSearch<SearchOf<T>>>(path, options)
    navigate(url, {
      ...R.omit(options, ['search', 'hash', 'params']),
      replace: true,
    })
  }

  const back = () => navigate(-1)
  const forward = () => navigate(1)

  return { push, replace, back, forward }
}
