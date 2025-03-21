import { useNavigate } from 'react-router'

import * as R from 'remeda'

import { buildUrl } from '../lib'
import type { AllowedSearch, ExtendedOptions, ParamOptions, Pathname, SearchOf } from '../model/type'

/**
 * 타입 안전한 라우팅을 위한 커스텀 훅
 * 
 * React Router의 navigate 기능을 확장하여 타입 체크와 URL 생성을 제공
 * 
 * @returns 네비게이션 함수들을 포함한 객체
 * - push: 새 주소로 이동
 * - replace: 현재 주소를 대체하여 이동 (히스토리에 추가되지 않음)
 * - back: 뒤로 가기
 * - forward: 앞으로 가기
 */
export const useRouter = () => {
  const navigate = useNavigate()

  /**
   * 새 주소로 이동
   * 
   * @template T 경로 문자열 리터럴 타입
   * @param path 이동할 경로 (예: '/account', '/note/:noteId')
   * @param rest 이동 옵션 (파라미터가 있는 경로는 필수, 없는 경로는 선택적)
   * 
   * @example
   * // 파라미터가 없는 경로로 이동
   * router.push('/account')
   * // 또는 옵션과 함께
   * router.push('/account', { search: { tab: 'profile' } })
   * 
   * @example
   * // 파라미터가 있는 경로로 이동 (params는 필수)
   * router.push('/note/:noteId', { params: ['123'] })
   */
  function push<T extends Pathname>(path: T, ...rest: ParamOptions<T, AllowedSearch<SearchOf<T>>>) {
    const options = (rest[0] ?? {}) as ExtendedOptions<T, AllowedSearch<SearchOf<T>>>
    const url = buildUrl<T, AllowedSearch<SearchOf<T>>>(path, options)
    navigate(url, {
      ...R.omit(options, ['search', 'hash', 'params']),
    })
  }

  /**
   * 현재 주소를 대체하여 이동 (히스토리에 추가되지 않음)
   * 
   * @template T 경로 문자열 리터럴 타입
   * @param path 이동할 경로 (예: '/account', '/note/:noteId')
   * @param rest 이동 옵션 (파라미터가 있는 경로는 필수, 없는 경로는 선택적)
   * 
   * @example
   * // 현재 주소를 대체하여 이동
   * router.replace('/account')
   * 
   * @example
   * // 파라미터와 함께 현재 주소 대체
   * router.replace('/note/:noteId', { params: ['123'] })
   */
  function replace<T extends Pathname>(path: T, ...rest: ParamOptions<T, AllowedSearch<SearchOf<T>>>) {
    const options = (rest[0] ?? {}) as ExtendedOptions<T, AllowedSearch<SearchOf<T>>>
    const url = buildUrl<T, AllowedSearch<SearchOf<T>>>(path, options)
    navigate(url, {
      ...R.omit(options, ['search', 'hash', 'params']),
      replace: true,
    })
  }

  /**
   * 이전 페이지로 이동 (브라우저의 뒤로 가기와 동일)
   */
  const back = () => navigate(-1)
  
  /**
   * 다음 페이지로 이동 (브라우저의 앞으로 가기와 동일)
   */
  const forward = () => navigate(1)

  return { push, replace, back, forward }
}
