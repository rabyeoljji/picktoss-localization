/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { Meta, StoryObj } from '@storybook/react'
import { format, subDays } from 'date-fns'

import { Calendar } from '.'

const meta: Meta<typeof Calendar> = {
  title: 'Component/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full flex-center">
        <Story />
      </div>
    ),
  ],
}
export default meta

export const DefaultCalendar: StoryObj<typeof Calendar> = {
  render: () => {
    const navigate = useNavigate()

    const today = useMemo(() => new Date(), [])
    const [searchParams] = useSearchParams()
    const querySelectedDate = searchParams.get('selectedDate') ?? format(today, 'yyyy-MM-dd')

    const selectedDate = new Date(querySelectedDate)

    const setSelectedDate = (selected?: Date) => {
      if (selected) {
        const formattedDate = format(selected, 'yyyy-MM-dd')

        navigate(`?selectedDate=${formattedDate}`)
      }
    }

    const [currentMonth, setCurrentMonth] = useState(selectedDate)

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
    return (
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        isLoading={false}
      />
    )
  },
}

export const RangeCalendar: StoryObj<typeof Calendar> = {
  render: () => {
    const navigate = useNavigate()

    const today = useMemo(() => new Date(), [])
    const [searchParams] = useSearchParams()
    const querySelectedDate = searchParams.get('selectedDate') ?? format(today, 'yyyy-MM-dd')

    const selectedDate = new Date(querySelectedDate)

    const setSelectedDate = (selected?: Date) => {
      if (selected) {
        const formattedDate = format(selected, 'yyyy-MM-dd')

        navigate(`?selectedDate=${formattedDate}`)
      }
    }

    const [currentMonth, setCurrentMonth] = useState(selectedDate)

    // 스토리북 화면에서 항상 ranged가 보이도록 하기 위해 이렇게 작성했습니다.
    // date는 YYYY-MM-DD 형식의 string타입입니다.
    const dates = [
      {
        date: format(subDays(today, 6), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
      {
        date: format(subDays(today, 4), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
      {
        date: format(subDays(today, 3), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
      {
        date: format(subDays(today, 2), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
    ]

    return (
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        isLoading={false}
        dates={dates}
      />
    )
  },
}

export const UnselectableCalendar: StoryObj<typeof Calendar> = {
  render: () => {
    const today = useMemo(() => new Date(), [])

    const [currentMonth, setCurrentMonth] = useState(today)

    const dates = [
      {
        date: format(subDays(today, 6), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
      {
        date: format(subDays(today, 4), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
      {
        date: format(subDays(today, 3), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
      {
        date: format(subDays(today, 2), 'yyyy-MM-dd'),
        isDailyQuizComplete: true,
      },
    ]

    return <Calendar currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} dates={dates} noSelectMode />
  },
}
