import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router'

import { buildUrl } from '../lib'
import { ExtractRouteParamsTuple, Pathname } from '../model/type'

/**
 * CustomLinkProps:
 * - 파라미터가 없는 경로: params는 선택적입니다.
 * - 파라미터가 있는 경로: params가 반드시 필요합니다.
 * 또한 search, hash 옵션도 함께 사용할 수 있습니다.
 */
type CustomLinkProps<T extends Pathname> = Omit<RouterLinkProps, 'to'> &
  (ExtractRouteParamsTuple<T> extends []
    ? { to: T; search?: string; hash?: string; params?: [] }
    : { to: T; search?: string; hash?: string; params: ExtractRouteParamsTuple<T> })

export function Link<T extends Pathname>(props: CustomLinkProps<T>) {
  const { to, search, hash, params, ...rest } = props

  // buildUrl은 ExtendedOptions<T>를 받습니다.
  // ExtendedOptions<T>는 Options<T>와 NavigateOptions의 선택적 속성들의 조합입니다.
  // Link에서는 search, hash, params만 전달하면 되므로, 그대로 객체 리터럴로 생성합니다.
  const options = { search, hash, params }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url = buildUrl(to, options as any)

  return <RouterLink to={url} {...rest} />
}
