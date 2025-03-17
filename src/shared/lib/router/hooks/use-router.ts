import { useNavigate } from 'react-router'

import * as R from 'remeda'

import { buildUrl } from '../lib'
import { ExtendedOptions, ParamOptions, Pathname } from '../model/type'

export const useRouter = () => {
  const navigate = useNavigate()

  /**
   * push 함수:
   * - 파라미터가 있는 경로라면 options 필수
   * - 파라미터가 없는 경로라면 options 생략 가능
   */
  function push<T extends Pathname>(path: T, ...rest: ParamOptions<T>) {
    // rest[0]이 없으면 빈 객체로 대체
    const options = (rest[0] ?? {}) as ExtendedOptions<T>
    const url = buildUrl(path, options)
    navigate(url, {
      ...R.omit(options, ['search', 'hash', 'params']),
    })
  }

  /**
   * replace 함수:
   * - 위와 동일하지만, navigate에 replace: true 추가
   */
  function replace<T extends Pathname>(path: T, ...rest: ParamOptions<T>) {
    const options = (rest[0] ?? {}) as ExtendedOptions<T>
    const url = buildUrl(path, options)
    navigate(url, {
      ...R.omit(options, ['search', 'hash', 'params']),
      replace: true,
    })
  }

  const back = () => {
    navigate(-1)
  }

  const forward = () => {
    navigate(1)
  }

  return {
    push,
    replace,
    back,
    forward,
  }
}
