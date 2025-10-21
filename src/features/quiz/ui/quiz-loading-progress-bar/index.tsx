import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Text } from '@/shared/components/ui/text'

export interface QuizLoadingProgressBarProps {
  initialSpeed?: number // 초기 진행 속도 (0-100 범위에서 ms당 증가하는 양)
  minSpeed?: number // 최소 진행 속도
  onComplete?: () => void // 100%에 도달했을 때 호출할 콜백
  text?: string // 표시할 텍스트 (번역 키 값)
  completed?: boolean // 외부에서 완료 상태를 제어하는 prop
  progressOverride?: number // 외부에서 진행 상태를 직접 제어하는 prop (0-100)
}

export const QuizLoadingProgressBar = ({
  initialSpeed = 0.15,
  minSpeed = 0.02,
  onComplete,
  text,
  completed = false,
  progressOverride,
}: QuizLoadingProgressBarProps) => {
  const { t } = useTranslation()

  // 진행률 상태 (0-100%)
  const [progress, setProgress] = useState(0)
  // 현재 속도 상태
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed)
  // 완료 상태
  const [isCompleted, setIsCompleted] = useState(false)

  // progressOverride가 제공되면 내부 진행 상태를 업데이트
  useEffect(() => {
    if (progressOverride !== undefined) {
      setProgress(progressOverride)
    }
  }, [progressOverride])

  useEffect(() => {
    // 외부에서 completed가 true로 설정되면 진행률을 100%로 설정
    if (completed && !isCompleted) {
      setProgress(100)
      setIsCompleted(true)
    }
  }, [completed, isCompleted])

  useEffect(() => {
    // 이미 100%에 도달했거나 외부에서 completed가 true로 설정된 경우
    // 또는 progressOverride가 제공된 경우 자동 진행 중지
    if (isCompleted || progressOverride !== undefined) {
      if (isCompleted && onComplete) onComplete()
      return
    }

    // 진행률이 100%에 가까워질수록 속도가 줄어들도록 설정
    if (progress < 95) {
      const speedFactor = 1 - progress / 100
      const newSpeed = Math.max(minSpeed, initialSpeed * speedFactor)
      setCurrentSpeed(newSpeed)
    } else {
      // 95% 이상에서는 매우 느리게 진행
      setCurrentSpeed(minSpeed / 2)
    }

    // 진행률 업데이트를 위한 타이머 설정
    const timer = setTimeout(() => {
      if (progress < 99) {
        // 진행률을 현재 속도에 따라 업데이트
        setProgress((prevProgress) => {
          const newProgress = Math.min(99, prevProgress + currentSpeed * 10)
          return newProgress
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [progress, currentSpeed, initialSpeed, minSpeed, isCompleted, onComplete, progressOverride])

  // 표시할 진행률 텍스트
  const progressText = `${Math.round(progress)}%`

  return (
    <div className="relative w-full py-[7px] px-[40px]">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-base-3">
        <div
          className="absolute h-full bg-orange rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <Text typo="body-2-medium" color="sub">
          {text ?? t('progressQuiz.quiz_loading_progress_bar.generating')}
        </Text>
        <Text typo="body-2-bold" color="sub">
          {progressText}
        </Text>
      </div>
    </div>
  )
}

export default QuizLoadingProgressBar
