import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router'

import { buildUrl } from '../lib'
import type {
  ExtractRouteParamsTuple,
  Pathname,
  SearchOf,
  ExtendedOptions,
  AllowedSearch,
} from '../model/type'

/**
 * - 파라미터가 없는 경로: params는 선택적(optional)
 * - 파라미터가 있는 경로: params는 필수
 * 그리고 search, hash 옵션도 함께 사용할 수 있음.
 */
type CustomLinkProps<T extends Pathname> = Omit<RouterLinkProps, 'to'> &
  (ExtractRouteParamsTuple<T> extends []
    ? { to: T; search?: string | AllowedSearch<SearchOf<T>>; hash?: string; params?: [] }
    : {
        to: T
        search?: string | AllowedSearch<SearchOf<T>>
        hash?: string
        params: ExtractRouteParamsTuple<T>
      })

export function Link<T extends Pathname>(props: CustomLinkProps<T>) {
  const { to, search, hash, params, ...rest } = props

  const options = { search, hash, params } as unknown as ExtendedOptions<
    T,
    AllowedSearch<SearchOf<T>>
  >
  const url = buildUrl<T, AllowedSearch<SearchOf<T>>>(to, options)
  return <RouterLink to={url} {...rest} />
}
