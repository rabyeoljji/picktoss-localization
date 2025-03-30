import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { QuizLoadingProgressBar } from '@/features/quiz/quiz-loading-progress-bar'

import { useGetSingleDocument } from '@/entities/document/api/hooks'
import { createErrorCheckQuizSet } from '@/entities/quiz/api'

import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'

// 폴링 간격 (ms)
const POLLING_INTERVAL = 2000
// 최대 폴링 횟수
const MAX_POLLING_COUNT = 60
// 예상 로딩 시간 (ms) - 이 값에 따라 프로그레스바 속도가 조절됨
const ESTIMATED_LOADING_TIME = 40000 // 40초

const QuizLoadingPage = () => {
  const [params] = useQueryParam('/quiz-loading')
  const { documentId, documentName, star } = params
  const router = useRouter()

  // 퀴즈 생성 완료 상태
  const [quizGenerated, setQuizGenerated] = useState(false)
  // 퀴즈 ID 상태
  const [quizId, setQuizId] = useState<string | null>(null)
  // 오류 상태 (나중에 사용할 수 있음)
  const [_error, setError] = useState<string | null>(null)
  // 폴링 카운터 (디버깅용)
  const [_pollingCount, setPollingCount] = useState(0)
  // 폴링 타이머 참조
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 폴링 자동 완료 타이머 참조 (최대 시간 후 자동 완료)
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 애니메이션 타이머 참조
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 프로그레스바 진행 상태
  const [progress, setProgress] = useState(0)
  // 시작 시간 참조
  const startTimeRef = useRef<number>(Date.now())

  // 단계적 진행 타임라인 (ms)와 타겟 진행률(%) - useMemo로 캐싱
  const progressTimeline = useMemo(
    () => [
      { time: 2000, target: 10 }, // 2초 후 10%
      { time: 4000, target: 20 }, // 4초 후 20%
      { time: 7000, target: 35 }, // 7초 후 35%
      { time: 10000, target: 45 }, // 10초 후 45%
      { time: 15000, target: 60 }, // 15초 후 60%
      { time: 22000, target: 75 }, // 22초 후 75%
      { time: 30000, target: 85 }, // 30초 후 85%
      { time: 40000, target: 92 }, // 40초 후 92%
      { time: 50000, target: 99 }, // 50초 후 99%
    ],
    [],
  ) // 의존성 없음 - 컴포넌트 마운트시 한 번만 생성

  // 마지막 증가 시간과 값 저장
  const lastProgressRef = useRef({ time: 0, value: 0 })

  // 문서 조회 훅 - 필요시 documentData 사용 가능
  const { refetch: refetchDocument } = useGetSingleDocument(documentId)

  // 폴링 중지 함수
  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current)
      pollingTimerRef.current = null
    }

    if (autoCompleteTimerRef.current) {
      clearTimeout(autoCompleteTimerRef.current)
      autoCompleteTimerRef.current = null
    }

    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current)
      animationTimerRef.current = null
    }
  }, [])

  // 프로그레스 바 애니메이션 시작 함수
  const startProgressAnimation = useCallback(() => {
    // 이미 애니메이션 중이면 중단
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current)
    }

    // 시작 시간 기록
    startTimeRef.current = Date.now()
    lastProgressRef.current = { time: 0, value: 0 }

    // 애니메이션 타이머 설정 (100ms마다 업데이트)
    animationTimerRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current

      // 현재 시간에 해당하는 타임라인 단계 찾기
      let targetProgress = 0
      let prevTime = 0
      let nextTime = 0
      let prevTarget = 0
      let nextTarget = 0

      // 타임라인 검색
      for (let i = 0; i < progressTimeline.length; i++) {
        if (elapsedTime < progressTimeline[i].time) {
          // 이전 단계와 다음 단계 설정
          prevTime = i > 0 ? progressTimeline[i - 1].time : 0
          nextTime = progressTimeline[i].time
          prevTarget = i > 0 ? progressTimeline[i - 1].target : 0
          nextTarget = progressTimeline[i].target
          break
        } else if (i === progressTimeline.length - 1) {
          // 마지막 단계 이후
          prevTime = progressTimeline[i].time
          nextTime = ESTIMATED_LOADING_TIME
          prevTarget = progressTimeline[i].target
          nextTarget = 99
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
      const shouldAddRandomJump = Math.random() < 0.07 // 7% 확률로 랜덤 점프

      if (shouldAddRandomJump && elapsedTime > 3000) {
        // 시작 후 3초 이후부터 랜덤 점프 추가
        // 마지막 업데이트 이후 일정 시간이 지났을 때만 랜덤 점프 (너무 잦은 점프 방지)
        if (elapsedTime - lastProgressRef.current.time > 1500) {
          const jumpSize = Math.random() * 3 // 0-3% 랜덤 점프
          targetProgress += jumpSize
          lastProgressRef.current = { time: elapsedTime, value: targetProgress }
        }
      }

      // 최종 진행률 설정 (99%가 최대)
      const finalProgress = Math.min(99, targetProgress)
      setProgress(finalProgress)
    }, 100)
  }, [progressTimeline])

  // 퀴즈 생성 완료 처리 함수 (ID 획득 시 호출)
  const completeQuizGeneration = useCallback(
    (newQuizId: string) => {
      // 퀴즈 ID가 없으면 저장
      if (!quizId) {
        setQuizId(newQuizId)
      }

      // 즉시 100%로 설정하고 완료 처리
      setProgress(100)
      setQuizGenerated(true)

      // 폴링 중지
      stopPolling()
    },
    [quizId, stopPolling],
  )

  // 폴링 시작 함수
  const startPolling = useCallback(() => {
    // 이미 폴링 중이면 중단
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current)
    }

    // 폴링 타이머 설정
    pollingTimerRef.current = setInterval(async () => {
      // 문서 정보 다시 가져오기
      refetchDocument()

      try {
        // 오류 체크 퀴즈 세트 생성 시도 - 직접 API 호출 방식
        const response = await createErrorCheckQuizSet(Number(documentId))

        console.log('퀴즈 생성 상태 확인 성공:', response)

        // 퀴즈 생성 완료 처리 함수 호출
        if (response && response.quizSetId) {
          completeQuizGeneration(response.quizSetId)
        }
      } catch (error) {
        console.error('퀴즈 생성 상태 확인 실패:', error)

        // HTTP 오류 처리 추가
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('알 수 없는 오류가 발생했습니다.')
        }

        // 아직 준비되지 않음, 폴링 카운트 증가 (디버깅용)
        setPollingCount((prev) => {
          const newCount = prev + 1
          // 최대 폴링 횟수 도달 시 자동 완료
          if (newCount >= MAX_POLLING_COUNT && quizId) {
            setQuizGenerated(true)
            setProgress(100)
            stopPolling()
          }
          return newCount
        })
      }
    }, POLLING_INTERVAL)
  }, [refetchDocument, documentId, quizId, stopPolling, completeQuizGeneration])

  // 퀴즈 생성 함수
  const generateQuiz = useCallback(async () => {
    try {
      // 프로그레스 애니메이션 시작
      startProgressAnimation()

      const response = await createErrorCheckQuizSet(documentId)
      // 퀴즈 생성 완료 처리 함수 호출 (ID를 얻으면 즉시 100%로 진행)
      completeQuizGeneration(response.quizSetId)

      // 폴링 시작 - 여전히 필요한지 체크 (백엔드 상태 확인을 위해)
      startPolling()

      // 안전장치: 최대 60초 후 자동 완료
      autoCompleteTimerRef.current = setTimeout(() => {
        if (!quizGenerated && quizId) {
          setQuizGenerated(true)
          setProgress(100)
        }
      }, 80000) // 80초 후 자동 완료
    } catch (err) {
      console.error('퀴즈 생성 오류:', err)
      setError('퀴즈 생성 중 오류가 발생했습니다.')
    }
  }, [startPolling, startProgressAnimation, completeQuizGeneration, documentId, quizId, setError, quizGenerated])

  // 퀴즈 생성 완료 후 퀴즈 페이지로 이동
  const handleQuizGenerationComplete = useCallback(() => {
    if (quizId) {
      // 폴링 중지
      stopPolling()

      // 라우터를 사용하여 퀴즈 페이지로 이동
      router.push('/progress-quiz/:quizId', {
        params: [quizId],
        search: {
          quizIndex: 0,
          selectedOption: null,
          autoNext: true,
        },
      })
    }
  }, [quizId, router, stopPolling])

  // 컴포넌트 마운트 시 퀴즈 생성 시작
  useEffect(() => {
    generateQuiz()

    // 컴포넌트 언마운트 시 폴링 중지
    return () => {
      stopPolling()
    }
  }, [generateQuiz, stopPolling])

  return (
    <div>
      <div className="border-divider border">
        <div className="pt-[14px] pb-[2px] pl-[17px] pr-[18px] flex items-center gap-2.5">
          <Text typo="subtitle-2-bold" color="primary">
            {documentName}
          </Text>
          <Text typo="body-1-medium" color="sub">
            {star} 문제
          </Text>
        </div>

        <QuizLoadingProgressBar
          completed={quizGenerated}
          onComplete={handleQuizGenerationComplete}
          progressOverride={progress}
          text="내용을 읽고 있어요"
        />
      </div>
    </div>
  )
}

export default QuizLoadingPage
