/**
 * URL 경로에서 params 값 추출
 * 
 * @param pattern 경로 패턴 (예: '/user/:id/profile')
 * @param path 실제 경로 (예: '/user/123/profile')
 * @returns 추출된 params 값 배열
 */
export const extractParamsFromPath = (pattern: string, path: string): string[] => {
  const patternParts = pattern.split('/')
  const pathParts = path.split('?')[0].split('#')[0].split('/')

  const params: string[] = []

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':') && i < pathParts.length) {
      params.push(pathParts[i])
    }
  }

  return params
}
