import { useEffect, useRef, useState } from 'react'

import { createErrorCheckQuizSet } from '@/entities/quiz/api'

/**
 * 퀴즈 생성 폴링 옵션 타입
 */
interface PollingOptions {
  /**
   * 폴링 간격 (ms)
   */
  pollingInterval?: number
  /**
   * 최대 폴링 횟수
   */
  maxPollingCount?: number
  /**
   * 자동 완료 시간 (ms) - 이 시간이 지나면 자동으로 완료 처리
   */
  autoCompleteTime?: number
}

/**
 * 폴링 결과 타입
 */
interface PollingResult {
  /**
   * 퀴즈 ID (퀴즈 생성 완료 시 설정됨)
   */
  quizId: string | null
  /**
   * 에러 메시지
   */
  error: string | null
  /**
   * 로딩 상태 (폴링 완료 여부)
   */
  isComplete: boolean
  /**
   * 폴링 시도 횟수
   */
  pollingCount: number
}

/**
 * 퀴즈 생성 및 폴링 훅
 * @param documentId 문서 ID
 * @param options 폴링 옵션
 * @returns 폴링 관련 상태 및 메서드
 */
export const useQuizGenerationPolling = (documentId: number, options?: PollingOptions) => {
  const { pollingInterval = 2000, maxPollingCount = 60, autoCompleteTime = 70000 } = options || {}

  // 퀴즈 생성 완료 상태
  const [isComplete, setIsComplete] = useState(false)
  // 퀴즈 ID 상태
  const [quizId, setQuizId] = useState<string | null>(null)
  // 오류 상태
  const [error, setError] = useState<string | null>(null)
  // 폴링 카운터
  const [pollingCount, setPollingCount] = useState(0)

  // 폴링 타이머 참조
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 자동 완료 타이머 참조
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 폴링 중지 함수
  const stopPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current)
      pollingTimerRef.current = null
    }

    if (autoCompleteTimerRef.current) {
      clearTimeout(autoCompleteTimerRef.current)
      autoCompleteTimerRef.current = null
    }
  }

  // 퀴즈 생성 완료 처리 함수
  const completePolling = (newQuizId: string) => {
    // 퀴즈 ID가 없으면 저장
    if (!quizId) {
      setQuizId(newQuizId)
    }

    // 완료 처리
    setIsComplete(true)

    // 폴링 중지
    stopPolling()
  }

  // 퀴즈 ID로 초기화 (이미 퀴즈가 생성된 경우)
  const initWithQuizId = (initialQuizId: string) => {
    setQuizId(initialQuizId)
    setIsComplete(true)
    stopPolling()
  }

  // 폴링 시작 함수
  const startPolling = (onSuccess?: (id: string) => void) => {
    // 이미 퀴즈 생성이 완료되었거나 폴링이 진행 중이면 중단
    if (isComplete || quizId || pollingTimerRef.current) {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current)
      }

      // 이미 ID가 있으면 완료 처리만 하고 종료
      if (quizId && !isComplete) {
        setIsComplete(true)
      }

      return
    }

    // 폴링 타이머 설정
    pollingTimerRef.current = setInterval(async () => {
      try {
        // 오류 체크 퀴즈 세트 생성 시도
        const response = await createErrorCheckQuizSet(documentId)

        console.log('퀴즈 생성 상태 확인 성공:', response)

        // 퀴즈 생성 완료 처리
        if (response && response.quizSetId) {
          completePolling(response.quizSetId)

          // 성공 콜백 호출
          if (onSuccess) {
            onSuccess(response.quizSetId)
          }
        }
      } catch (error) {
        console.error('퀴즈 생성 상태 확인 실패:', error)

        // HTTP 오류 처리 추가
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('알 수 없는 오류가 발생했습니다.')
        }

        // 폴링 카운트 증가
        setPollingCount((prev) => {
          const newCount = prev + 1
          // 최대 폴링 횟수 도달 시 자동 완료
          if (newCount >= maxPollingCount && quizId) {
            setIsComplete(true)
            stopPolling()
          }
          return newCount
        })
      }
    }, pollingInterval)

    // 안전장치: 최대 시간 후 자동 완료
    autoCompleteTimerRef.current = setTimeout(() => {
      if (!isComplete && quizId) {
        setIsComplete(true)
        stopPolling()
      }
    }, autoCompleteTime)
  }

  // 퀴즈 생성 시작 함수
  const generateQuiz = async (onSuccess?: (id: string) => void) => {
    try {
      // 직접 API 호출하여 퀴즈 생성 시도
      const response = await createErrorCheckQuizSet(Number(documentId))

      // 퀴즈 생성 완료 처리
      if (response && response.quizSetId) {
        completePolling(response.quizSetId)

        // 성공 콜백 호출
        if (onSuccess) {
          onSuccess(response.quizSetId)
        }

        // 이미 완료되었으므로 폴링 시작하지 않음
        return response
      }

      // 퀴즈 ID가 없는 경우에만 폴링 시작
      startPolling(onSuccess)

      return response
    } catch (err) {
      console.error('퀴즈 생성 오류:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('퀴즈 생성 중 오류가 발생했습니다.')
      }

      return null
    }
  }

  // 상태 초기화 함수
  const reset = () => {
    setIsComplete(false)
    setQuizId(null)
    setError(null)
    setPollingCount(0)
    stopPolling()
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  return {
    // 상태
    pollingResult: {
      quizId,
      error,
      isComplete,
      pollingCount,
    } as PollingResult,

    // 메서드
    startPolling,
    stopPolling,
    generateQuiz,
    reset,
    initWithQuizId,
  }
}
