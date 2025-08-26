import { useMemo } from 'react'

import { format } from 'date-fns'

import { QuizAnswerRateAnalysisDto } from '@/entities/quiz/api'

import { Text } from '@/shared/components/ui/text'
import { isAdjacentDate } from '@/shared/lib/date'
import { useTranslation } from '@/shared/locales/use-translation'

import MonthGraphItem from '../month-graph-item'

interface Props {
  quizDataList?: QuizAnswerRateAnalysisDto[]
  today: Date
}

const MonthGraphContainer = ({ quizDataList, today }: Props) => {
  const { t } = useTranslation()
  const todayDateString = format(today, 'yyyy-MM-dd')

  const maxTotalCount = useMemo(() => {
    try {
      if (!quizDataList?.length) return 1 // 0으로 나누기 방지를 위해 1로 설정
      return Math.max(...quizDataList.map((data) => data.totalQuizCount))
    } catch (error) {
      console.error('Error calculating maxTotalCount:', error)
      return 1
    }
  }, [quizDataList])

  return (
    <div className="flex flex-col w-[311px]">
      <div className="w-full flex justify-end">
        <div className="size-fit flex items-center gap-[12px]">
          <div className="flex items-center gap-[4px]">
            <div className="size-[12px] bg-base-3 rounded-[4px]" />
            <Text as={'span'} typo="caption-medium" color="sub">
              {t('profile.문제')}
            </Text>
          </div>
          <div className="flex items-center gap-[4px]">
            <div className="size-[12px] bg-orange rounded-[4px]" />
            <Text as={'span'} typo="caption-medium" color="sub">
              {t('profile.정답')}
            </Text>
          </div>
        </div>
      </div>

      <div className="relative flex h-[206px] mt-[25px] w-fit gap-[6px]">
        {Array.isArray(quizDataList) &&
          quizDataList.map((data, index) => {
            const notSolved = data.totalQuizCount === 0
            const scaleFactor = data.totalQuizCount / maxTotalCount

            const barHeight = notSolved ? 3 : scaleFactor * 100
            const rightHeight = notSolved ? 0 : (data.correctAnswerCount / data.totalQuizCount) * 100

            const renderDateText =
              data.date === todayDateString
                ? t('profile.오늘')
                : isAdjacentDate(data.date)
                  ? ''
                  : format(data.date, 'M.d')

            if (new Date(data.date).getTime() > new Date(todayDateString).getTime()) {
              return null
            }

            return <MonthGraphItem key={index} date={renderDateText} barHeight={barHeight} rightHeight={rightHeight} />
          })}
      </div>
    </div>
  )
}

export default MonthGraphContainer
