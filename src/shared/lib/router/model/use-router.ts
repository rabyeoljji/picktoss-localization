import { useNavigate } from 'react-router'

import * as R from 'remeda'

import { buildUrl } from '../lib'
import { ParamOptions, Pathname } from './type'

/**
 * 라우터 내부용 buildUrl 옵션 타입
 */
type BuildUrlOptions = {
  search?: Record<string, unknown>
  hash?: string
  params?: string[] | readonly string[]
}

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
   * @param path 이동할 경로 (예: '/account', '/quiz-detail/:noteId')
   * @param options 이동 옵션 (파라미터가 있는 경로는 필수, 없는 경로는 선택적)
   *
   * @example
   * // 파라미터가 없는 경로로 이동
   * router.push('/account')
   * // 또는 옵션과 함께
   * router.push('/account', { search: { tab: 'profile' } })
   *
   * @example
   * // 파라미터가 있는 경로로 이동 (params는 필수)
   * router.push('/quiz-detail/:noteId', { params: ['123'] })
   */
  function push<T extends Pathname>(path: T, ...args: ParamOptions<T>) {
    // buildUrl에 전달할 옵션 객체를 생성
    const urlOptions: BuildUrlOptions = {}
    const options = args[0]

    if (options?.search) {
      urlOptions.search = options.search as Record<string, unknown>
    }

    if (options?.hash) {
      urlOptions.hash = options.hash
    }

    if (options && 'params' in options) {
      urlOptions.params = options.params as string[]
    }

    const url = buildUrl(path, urlOptions)
    navigate(url, {
      ...(options ? R.omit(options, ['search', 'hash', 'params']) : {}),
    })
  }

  /**
   * 현재 주소를 대체하여 이동 (히스토리에 추가되지 않음)
   *
   * @template T 경로 문자열 리터럴 타입
   * @param path 이동할 경로 (예: '/account', '/quiz-detail/:noteId')
   * @param options 이동 옵션 (파라미터가 있는 경로는 필수, 없는 경로는 선택적)
   */
  function replace<T extends Pathname>(path: T, ...args: ParamOptions<T>) {
    // buildUrl에 전달할 옵션 객체를 생성
    const urlOptions: BuildUrlOptions = {}
    const options = args[0]

    if (options?.search) {
      urlOptions.search = options.search as Record<string, unknown>
    }

    if (options?.hash) {
      urlOptions.hash = options.hash
    }

    if (options && 'params' in options) {
      urlOptions.params = options.params as string[]
    }

    const url = buildUrl(path, urlOptions)
    navigate(url, {
      ...(options ? R.omit(options, ['search', 'hash', 'params']) : {}),
      replace: true,
    })
  }

  return {
    push,
    replace,
    back: () => navigate(-1),
    forward: () => navigate(1),
  }
}
