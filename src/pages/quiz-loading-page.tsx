import { useCallback, useEffect, useRef, useState } from 'react'

import { QuizLoadingProgressBar } from '@/features/quiz/quiz-loading-progress-bar'

import { useGetSingleDocument } from '@/entities/document/api/hooks'
import { createMemberGeneratedQuizSet } from '@/entities/quiz/api'
import { useCreateErrorCheckQuizSet } from '@/entities/quiz/api/hooks'

import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'

const QuizLoadingPage = () => {
  const [params] = useQueryParam('/quiz-loading')
  const { documentId, documentName, star } = params
  const router = useRouter()

  // 퀴즈 생성 완료 상태
  const [quizGenerated, setQuizGenerated] = useState(false)
  // 퀴즈 ID 상태
  const [quizId, setQuizId] = useState<string | null>(null)
  // 오류 상태 - eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  // 폴링 카운터 (진행 상태 추적용)
  const [pollingCount, setPollingCount] = useState(0)
  // 폴링 간격 (ms)
  const POLLING_INTERVAL = 2000
  // 최대 폴링 횟수
  const MAX_POLLING_COUNT = 15
  // 폴링 타이머 참조
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 폴링 자동 완료 타이머 참조 (최대 시간 후 자동 완료)
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 문서 조회 훅 - 필요시 documentData 사용 가능
  const { refetch: refetchDocument } = useGetSingleDocument(documentId)
  // 퀴즈 오류 체크 훅
  const { mutateAsync: createCheckQuizSetMutate } = useCreateErrorCheckQuizSet(documentId)

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
  }, [])

  // 폴링 시작 함수
  const startPolling = useCallback(() => {
    // 이미 폴링 중이면 중단
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current)
    }

    // 폴링 타이머 설정
    pollingTimerRef.current = setInterval(() => {
      // 문서 정보 다시 가져오기
      refetchDocument()

      // 오류 체크 퀴즈 세트 생성 시도 (이 API는 문서가 준비되었을 때만 성공함)
      createCheckQuizSetMutate()
        .then((response) => {
          console.log('퀴즈 생성 상태 확인 성공:', response)
          // 퀴즈 ID가 없으면 저장
          if (!quizId) {
            setQuizId(response.quizSetId)
          }
          // 퀴즈 생성 완료 처리
          setQuizGenerated(true)
          // 폴링 중지
          stopPolling()
        })
        .catch(() => {
          // 아직 준비되지 않음, 폴링 카운트 증가
          setPollingCount((prev) => {
            const newCount = prev + 1
            // 최대 폴링 횟수 도달 시 자동 완료
            if (newCount >= MAX_POLLING_COUNT && quizId) {
              setQuizGenerated(true)
              stopPolling()
            }
            return newCount
          })
        })
    }, POLLING_INTERVAL)
  }, [refetchDocument, createCheckQuizSetMutate, quizId, stopPolling])

  // 퀴즈 생성 함수
  const generateQuiz = useCallback(async () => {
    try {
      // API 호출로 퀴즈 생성
      const response = await createMemberGeneratedQuizSet(Number(star), {
        quizType: 'MIX_UP',
        quizCount: 5, // 기본 퀴즈 수
      })

      // 퀴즈 ID 저장
      setQuizId(response.quizSetId)

      // 폴링 시작
      startPolling()

      // 안전장치: 최대 30초 후 자동 완료
      autoCompleteTimerRef.current = setTimeout(() => {
        if (!quizGenerated && quizId) {
          console.log('최대 대기 시간 초과, 자동 완료 처리')
          setQuizGenerated(true)
        }
      }, 30000)
    } catch (err) {
      console.error('퀴즈 생성 오류:', err)
      setError('퀴즈 생성 중 오류가 발생했습니다.')
    }
  }, [star, quizGenerated, quizId, startPolling])

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

  // 프로그레스 바의 진행 상태 계산 (폴링 기반)
  const progressPercentage = quizGenerated ? 100 : Math.min(90, (pollingCount / MAX_POLLING_COUNT) * 100)

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
          progressOverride={progressPercentage}
          text="내용을 읽고 있어요"
        />
      </div>
    </div>
  )
}

export default QuizLoadingPage
