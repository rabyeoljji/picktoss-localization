import { RouteConfig } from './index'

/**
 * 기존 RoutePath 호환성 유지를 위한 변환
 *
 * @example
 * // 다음과 같이 기존 방식으로 사용 가능
 * <Link to={RoutePath.account}>계정</Link>
 * router.push(RoutePath.login)
 */
export const RoutePath = Object.fromEntries(
  Object.entries(RouteConfig).map(([key, value]) => [key, value.pathname]),
) as {
  [K in keyof typeof RouteConfig]: (typeof RouteConfig)[K]['pathname']
}
