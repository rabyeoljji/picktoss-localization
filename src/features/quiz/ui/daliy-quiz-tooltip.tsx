import { ImgStar } from '@/shared/assets/images'
import { Text } from '@/shared/components/ui/text'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'

interface DailyQuizTooltipProps {
  todaySolvedDailyQuizCount: number
  consecutiveSolvedDailyQuizDays: number
}

export const DailyQuizTooltip = ({
  todaySolvedDailyQuizCount,
  consecutiveSolvedDailyQuizDays,
}: DailyQuizTooltipProps) => {
  return (
    <Tooltip
      open={
        // 연속일이 0이상일 때 혹은 보상 횟수를 표시할 때
        (consecutiveSolvedDailyQuizDays && consecutiveSolvedDailyQuizDays > 0) ||
        !!(todaySolvedDailyQuizCount && 10 - todaySolvedDailyQuizCount < 10 && 10 - todaySolvedDailyQuizCount > 0)
      }
    >
      <TooltipTrigger>
        <div className="p-1.5 flex-center">
          <ImgStar className="size-[28px]" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" color="inverse">
        {todaySolvedDailyQuizCount && 10 - todaySolvedDailyQuizCount > 0 ? (
          <Text typo="body-2-medium">
            <span className="text-accent">{10 - todaySolvedDailyQuizCount}문제</span> <span>더 풀면 획득!</span>
          </Text>
        ) : (
          <>
            {consecutiveSolvedDailyQuizDays && (
              <Text typo="body-2-medium">연속 {consecutiveSolvedDailyQuizDays}일 완료!</Text>
            )}
          </>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
