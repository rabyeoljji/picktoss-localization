import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { addDays, format, isSameDay, parseISO, startOfDay } from 'date-fns'

import { Calendar as ReactCalendar } from '@/shared/components/ui/calendar'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

interface Props {
  selectedDate: Date
  dates?: {
    date: string
    isSolved: boolean
  }[]
  isLoading?: boolean
  className?: HTMLElement['className']
}

export const Calendar = ({ selectedDate, dates, isLoading, className }: Props) => {
  const today = useMemo(() => new Date(), [])
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')

  const router = useRouter()
  const [searchParams] = useSearchParams()
  const [showLoading, setShowLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  useEffect(() => {
    setShowLoading(false)
  }, [selectedDate])

  const handleSelect = (selected?: Date) => {
    setShowLoading(true)

    if (selected) {
      const formattedDate = format(selected, 'yyyy-MM-dd')

      if (selectedDateString === formattedDate) {
        setShowLoading(false)
        return
      }

      const currentSearchParams = new URLSearchParams(searchParams)
      currentSearchParams.set('selectedDate', formattedDate)
      router.replace('/account/quiz-record', { search: `?${currentSearchParams.toString()}` })
    }
  }

  const modifiers = useMemo(() => {
    const defaultDate = today

    if (dates) {
      const solvedDates = dates.filter((record) => record.isSolved).map((record) => startOfDay(parseISO(record.date)))

      const ranges: { start: Date; end: Date }[] = []
      let start: Date | null = null

      for (let i = 0; i < solvedDates.length; i++) {
        if (!start) start = solvedDates[i] ?? defaultDate // 시작점 저장

        // 다음 날짜가 현재 날짜 +1 이 아니라면, 범위 종료
        if (
          i === solvedDates.length - 1 ||
          addDays(solvedDates[i] ?? defaultDate, 1).getTime() !== solvedDates[i + 1]?.getTime()
        ) {
          ranges.push({ start: start, end: solvedDates[i] ?? defaultDate })
          start = null
        }
      }

      const singleSolvedDates = solvedDates.filter((date, index, arr) => {
        const prevDate = index > 0 ? arr[index - 1] : null
        const nextDate = index < arr.length - 1 ? arr[index + 1] : null

        const hasPrev = prevDate && isSameDay(addDays(prevDate, 1), date)
        const hasNext = nextDate && isSameDay(addDays(date, 1), nextDate)

        return !hasPrev && !hasNext
      })

      const filteredRanges = ranges.filter(
        ({ start, end }) => !singleSolvedDates.some((date) => isSameDay(date, start) || isSameDay(date, end)),
      )

      return {
        day_range_start: filteredRanges.map((range) => startOfDay(range.start)),
        day_range_end: filteredRanges.map((range) => startOfDay(range.end)),
        day_range_middle: solvedDates.filter(
          (date) =>
            !filteredRanges.some(
              ({ start, end }) =>
                isSameDay(startOfDay(date), startOfDay(start)) || isSameDay(startOfDay(date), startOfDay(end)),
            ) && !singleSolvedDates.includes(date),
        ),
        single_solved_day: singleSolvedDates,
      }
    }
  }, [today, dates])

  return (
    <div className="relative w-full">
      {(showLoading || isLoading) && (
        <div className="absolute right-1/2 top-0 z-50 h-[316px] w-[398px] translate-x-1/2">
          <div className="size-full bg-white opacity-50" />
          {/* TODO: loading lottie 컴포넌트 넣기 */}
          {/* <Loading center /> */}
        </div>
      )}

      <ReactCalendar
        required
        today={today}
        mode="single"
        formatters={{
          formatCaption: (Date: Date) => `${format(Date, 'M')}월`,
          formatWeekdayName: (Date: Date) => {
            const weekdays = ['일', '월', '화', '수', '목', '금', '토']
            return weekdays[Date.getDay()]
          },
        }}
        className={cn('w-full', className)}
        selected={selectedDate}
        onSelect={(date?: Date) => handleSelect(date)}
        selectedMonth={currentMonth}
        onMonthChange={(month) => setCurrentMonth(month)}
        modifiers={modifiers}
      />
    </div>
  )
}
