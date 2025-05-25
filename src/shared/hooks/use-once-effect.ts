import { useEffect, useRef } from 'react'

/**
 * 한 번만 실행되는 useEffect 훅
 * 의존성 배열이 변경되더라도 콜백 함수는 한 번만 실행됨
 *
 * @param callback 실행할 콜백 함수
 * @param dependencies 의존성 배열 (콜백이 실행되기 위한 조건)
 */
export const useOnceEffect = (callback: () => void | (() => void), dependencies: React.DependencyList = []) => {
  const hasRunRef = useRef(false)

  useEffect(() => {
    // 이미 실행되었으면 무시
    if (hasRunRef.current) return

    // 모든 의존성이 undefined가 아닌지 확인
    const allDependenciesDefined = dependencies.every((dep) => dep != null)

    // 모든 의존성이 정의되었고, 아직 실행되지 않았을 때만 실행
    if (allDependenciesDefined && !hasRunRef.current) {
      hasRunRef.current = true
      return callback()
    }
  }, dependencies)
}
