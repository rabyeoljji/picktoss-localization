import { useEffect, useRef, useState } from 'react'

import { QuizSetType } from '@/pages/progress-quiz-page'

import { useGetSingleDocument } from '@/entities/document/api/hooks'
import { useCreateErrorCheckQuizSet } from '@/entities/quiz/api/hooks'

// 문서 상태 정의
export type DocumentStatus =
  | 'UNPROCESSED'
  | 'PROCESSED'
  | 'PROCESSING'
  | 'COMPLETELY_FAILED'
  | 'PARTIAL_SUCCESS'
  | 'QUIZ_GENERATION_ERROR'

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

  onSuccess?: (result: { quizSetId: string; quizSetType: QuizSetType }) => void
}

/**
 * 폴링 결과 타입
 */
export interface PollingResult {
  /**
   * 에러 메시지
   */
  error: string | null
}

/**
 * 퀴즈 생성 및 폴링 훅
 * @param documentId 문서 ID
 * @param options 폴링 옵션
 * @returns 폴링 관련 상태 및 메서드
 */
export const useQuizGenerationPolling = (documentId: number, options?: PollingOptions) => {
  const { pollingInterval = 2000, maxPollingCount = 60, autoCompleteTime = 70000 } = options || {}
  const [error, setError] = useState<string | null>(null)
  const [pollingCount, setPollingCount] = useState(0)

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { data: document, refetch } = useGetSingleDocument(documentId)
  const { mutate: generateQuizSet } = useCreateErrorCheckQuizSet()

  // 폴링 정지 함수
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

  // 문서 상태 확인 및 처리
  useEffect(() => {
    if (!document) return

    // 문서 상태에 따라 처리
    if (document.quizGenerationStatus === 'PROCESSED') {
      generateQuizSet(documentId, {
        onSuccess: ({ quizSetId, quizSetType }) => {
          stopPolling()
          options?.onSuccess?.({ quizSetId, quizSetType })
        },
        onError: (err) => {
          const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
          setError(errorMessage)
          stopPolling()
        },
      })
    } else if (
      document.quizGenerationStatus === 'COMPLETELY_FAILED' ||
      document.quizGenerationStatus === 'QUIZ_GENERATION_ERROR'
    ) {
      // 퀴즈 생성에 실패한 경우
      setError('퀴즈 생성에 실패했습니다.')
      stopPolling()
    }
  }, [document])

  const startPolling = () => {
    // 폴링이 진행 중이면 중단
    if (pollingTimerRef.current) {
      return
    }

    if (pollingCount >= maxPollingCount) {
      stopPolling()
      return
    }

    // 폴링 타이머 설정
    pollingTimerRef.current = setInterval(() => {
      // 문서 정보 다시 가져오기
      refetch()

      // 폴링 카운트 증가 및 최대 폴링 횟수 체크
      setPollingCount((prev) => prev + 1)
    }, pollingInterval)

    // 안전장치: 최대 시간 후 종료
    autoCompleteTimerRef.current = setTimeout(() => {
      stopPolling()
      setError('퀴즈 생성에 실패했습니다.')
    }, autoCompleteTime)
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    startPolling()

    return () => {
      stopPolling()
    }
  }, [])

  return {
    error,
  }
}
