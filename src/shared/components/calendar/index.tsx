import { useMemo } from 'react'

import { addDays, format, isSameDay, parseISO, startOfDay } from 'date-fns'

import { ShadcnCalendar } from '@/shared/components/ui/calendar'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface Props {
  selectedDate?: Date
  setSelectedDate?: (date?: Date) => void
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  dates?: {
    date: string
    isDailyQuizComplete: boolean
  }[]
  isLoading?: boolean
  className?: HTMLElement['className']
  noSelectMode?: boolean
}

/**
 * 날짜 선택 및 기록 표시가 가능한 캘린더 컴포넌트
 *
 * 선택된 날짜는 URL 쿼리 파라미터로 관리되며, 날짜 선택 시 라우터를 통해 URL이 업데이트됩니다.
 * 연속된 날짜 기록은 범위로 시각화되며, 단일 날짜 기록은 개별적으로 표시됩니다.
 *
 * @param selectedDate 현재 선택된 날짜
 * @param setSelectedDate 날짜 선택 함수
 * @param currentMonth 현재 월
 * @param setCurrentMonth 현재 월 선택 함수
 * @param dates 날짜 객체의 배열 (날짜와 해당 날짜의 완료 상태)
 * @param isLoading 로딩 상태 표시 여부
 * @param className 추가 CSS 클래스명
 * @param noSelectMode 보여주기 모드 (선택 불가)
 */
export const Calendar = ({
  selectedDate,
  setSelectedDate,
  dates,
  isLoading,
  className,
  currentMonth,
  setCurrentMonth,
  noSelectMode,
}: Props) => {
  const today = useMemo(() => new Date(), [])
  const { t } = useTranslation()
  // const selectedDateString = format(selectedDate, 'yyyy-MM-dd')

  // const router = useRouter()
  // const [showLoading, setShowLoading] = useState(false)
  // const [currentMonth, setCurrentMonth] = useState(selectedDate)

  // useEffect(() => {
  //   setShowLoading(false)
  // }, [selectedDate])

  /**
   * 날짜 선택 시 URL 쿼리 파라미터를 업데이트하는 핸들러
   *
   * 같은 날짜를 다시 선택하는 경우 작업을 취소하고 로딩 상태를 해제합니다.
   *
   * @param selected 사용자가 선택한 날짜 (undefined일 수 있음)
   */
  // const handleSelect = (selected?: Date) => {
  //   setShowLoading(true)

  //   if (selected) {
  //     const formattedDate = format(selected, 'yyyy-MM-dd')

  //     if (selectedDateString === formattedDate) {
  //       setShowLoading(false)
  //       return
  //     }

  //     router.replace(path, { search: { selectedDate: formattedDate } })
  //   }
  // }

  /**
   * 캘린더에 날짜 범위 및 단일 날짜 표시를 위한 수정자 생성
   *
   * 연속된 날짜는, 시작(day_range_start), 중간(day_range_middle), 끝(day_range_end) 날짜로 구분합니다.
   * 독립된 날짜는 단일 날짜(single_solved_day)로 표시됩니다.
   *
   * @returns 날짜 표시를 위한 수정자 객체 또는 undefined
   */
  const modifiers = useMemo(() => {
    const defaultDate = today

    if (dates) {
      const solvedDates = dates
        .filter((record) => record.isDailyQuizComplete)
        .map((record) => startOfDay(parseISO(record.date)))

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
    <div className="relative w-fit">
      {isLoading && (
        <div className="absolute right-1/2 top-0 z-50 h-[331px] w-[344px] rounded-[16px] translate-x-1/2">
          <div className="size-full bg-white opacity-50" />
          {/* TODO: loading lottie 컴포넌트 넣기 */}
          {/* <Loading center /> */}
        </div>
      )}

      <ShadcnCalendar
        required
        today={today}
        mode="single"
        formatters={{
          formatCaption: (Date: Date) => `${format(Date, 'M')}${t('profile.월')}`,
          formatWeekdayName: (Date: Date) => {
            const weekdays = [
              t('profile.요일_일'),
              t('profile.요일_월'),
              t('profile.요일_화'),
              t('profile.요일_수'),
              t('profile.요일_목'),
              t('profile.요일_금'),
              t('profile.요일_토'),
            ]
            return weekdays[Date.getDay()]
          },
        }}
        className={cn('w-fit', className)}
        selected={selectedDate}
        onSelect={(date?: Date) => setSelectedDate && setSelectedDate(date)}
        selectedMonth={currentMonth}
        onMonthChange={(month) => setCurrentMonth(month)}
        modifiers={modifiers}
        noSelectMode={noSelectMode}
      />
    </div>
  )
}
