import { useEffect, useRef, useState } from 'react'

/**
 * 프로그레스 애니메이션 타임라인 구간
 */
interface ProgressTimelinePoint {
  /**
   * 경과 시간 (ms)
   */
  time: number
  /**
   * 해당 시간에 도달할 타겟 진행률 (%)
   */
  target: number
}

/**
 * 프로그레스 애니메이션 옵션
 */
interface ProgressAnimationOptions {
  /**
   * 애니메이션 타임라인 (필수)
   */
  timeline: ProgressTimelinePoint[]
  /**
   * 예상 로딩 시간 (ms)
   */
  estimatedLoadingTime?: number
  /**
   * 업데이트 간격 (ms)
   */
  updateInterval?: number
  /**
   * 랜덤 점프 확률 (0-1 사이)
   */
  randomJumpProbability?: number
  /**
   * 랜덤 점프 최대 크기 (%)
   */
  randomJumpMaxSize?: number
  /**
   * 랜덤 점프 최소 간격 (ms)
   */
  randomJumpMinInterval?: number
  /**
   * 랜덤 점프 시작 시간 (ms)
   */
  randomJumpStartTime?: number
  /**
   * 최대 진행률 (%)
   */
  maxProgress?: number
}

/**
 * 프로그레스 애니메이션 훅
 *
 * 로딩 진행 상황을 자연스럽게 애니메이션화하는 훅
 * @param options 프로그레스 애니메이션 옵션
 * @returns 프로그레스 애니메이션 관련 상태 및 메서드
 */
export const useProgressAnimation = (options: ProgressAnimationOptions) => {
  const {
    timeline,
    estimatedLoadingTime = 40000,
    updateInterval = 100,
    randomJumpProbability = 0.07,
    randomJumpMaxSize = 3,
    randomJumpMinInterval = 1500,
    randomJumpStartTime = 3000,
    maxProgress = 99,
  } = options

  // 진행률 상태
  const [progress, setProgress] = useState(0)
  // 애니메이션 타이머 참조
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 시작 시간 참조
  const startTimeRef = useRef<number>(Date.now())
  // 마지막 점프 시간과 값 저장
  const lastJumpRef = useRef({ time: 0, value: 0 })

  /**
   * 애니메이션 중지 함수
   */
  const stopAnimation = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current)
      animationTimerRef.current = null
    }
  }

  /**
   * 진행률 강제 설정 함수
   * @param value 설정할 진행률 값 (0-100)
   */
  const setProgressValue = (value: number) => {
    setProgress(Math.min(100, Math.max(0, value)))
  }

  /**
   * 애니메이션 시작 함수
   */
  const startAnimation = () => {
    // 이미 애니메이션 중이면 중단
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current)
    }

    // 시작 시간 기록
    startTimeRef.current = Date.now()
    lastJumpRef.current = { time: 0, value: 0 }

    // 애니메이션 타이머 설정
    animationTimerRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current

      // 현재 시간에 해당하는 타임라인 단계 찾기
      let targetProgress = 0
      let prevTime = 0
      let nextTime = 0
      let prevTarget = 0
      let nextTarget = 0

      // 타임라인 검색
      for (let i = 0; i < timeline.length; i++) {
        if (elapsedTime < timeline[i].time) {
          // 이전 단계와 다음 단계 설정
          prevTime = i > 0 ? timeline[i - 1].time : 0
          nextTime = timeline[i].time
          prevTarget = i > 0 ? timeline[i - 1].target : 0
          nextTarget = timeline[i].target
          break
        } else if (i === timeline.length - 1) {
          // 마지막 단계 이후
          prevTime = timeline[i].time
          nextTime = estimatedLoadingTime
          prevTarget = timeline[i].target
          nextTarget = maxProgress
        }
      }

      // 현재 단계에서의 진행률 계산 (선형 보간)
      if (nextTime > prevTime) {
        const ratio = (elapsedTime - prevTime) / (nextTime - prevTime)
        targetProgress = prevTarget + ratio * (nextTarget - prevTarget)
      } else {
        targetProgress = prevTarget
      }

      // 가끔 약간의 랜덤성 추가 (약간의 움직임을 랜덤하게 만들기)
      const shouldAddRandomJump = Math.random() < randomJumpProbability // 랜덤 점프 확률

      if (shouldAddRandomJump && elapsedTime > randomJumpStartTime) {
        // 시작 후 일정 시간 이후부터 랜덤 점프 추가
        // 마지막 업데이트 이후 일정 시간이 지났을 때만 랜덤 점프 (너무 잦은 점프 방지)
        if (elapsedTime - lastJumpRef.current.time > randomJumpMinInterval) {
          const jumpSize = Math.random() * randomJumpMaxSize // 랜덤 점프 크기
          targetProgress += jumpSize
          lastJumpRef.current = { time: elapsedTime, value: targetProgress }
        }
      }

      // 최종 진행률 설정 (설정된 최대값이 상한)
      const finalProgress = Math.min(maxProgress, targetProgress)
      setProgress(finalProgress)
    }, updateInterval)
  }

  /**
   * 완료 함수 - 즉시 100%로 설정
   */
  const complete = () => {
    setProgress(100)
    stopAnimation()
  }

  /**
   * 재설정 함수 - 진행률을 0으로 초기화
   */
  const reset = () => {
    setProgress(0)
    stopAnimation()
  }

  useEffect(() => {
    startAnimation()

    return () => {
      stopAnimation()
    }
  }, [])

  return {
    // 상태
    progress,
    isAnimating: animationTimerRef.current !== null,

    // 메서드
    startAnimation,
    stopAnimation,
    setProgressValue,
    complete,
    reset,
  }
}
