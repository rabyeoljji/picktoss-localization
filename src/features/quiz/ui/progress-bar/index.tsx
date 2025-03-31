import { Text } from '@/shared/components/ui/text'

export interface ProgressBarProps {
  current: number
  totalQuizCount: number
}

export const ProgressBar = ({ current, totalQuizCount }: ProgressBarProps) => {
  // 현재 진행률 계산 (0-100%)
  const progressPercentage = Math.max(0, Math.min(100, (current / totalQuizCount) * 100))

  // 위치 및 변환 계산
  const getTextPosition = () => {
    // 0%일 때는 왼쪽 정렬
    if (progressPercentage === 0) {
      return {
        left: '0%',
        transform: 'translateX(0)',
      }
    }
    // 100%일 때는 오른쪽 정렬
    else if (progressPercentage === 100) {
      return {
        left: '100%',
        transform: 'translateX(-100%)',
      }
    }
    // 나머지는 중앙 정렬
    else {
      return {
        left: `${progressPercentage}%`,
        transform: 'translateX(-50%)',
      }
    }
  }

  const textPosition = getTextPosition()

  return (
    <div className="relative pt-2">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-base-3">
        <div
          className="absolute h-full bg-orange rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div
        className="absolute mt-2 transition-all duration-300"
        style={{
          left: textPosition.left,
          transform: textPosition.transform,
        }}
      >
        <Text typo="body-2-bold" color="caption" className="text-center whitespace-nowrap">
          {current}/{totalQuizCount}
        </Text>
      </div>
    </div>
  )
}
