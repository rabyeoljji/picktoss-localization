/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

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
}
export default meta

export const DefaultCalendar: StoryObj<typeof Calendar> = {
  render: () => {
    const today = useMemo(() => new Date(), [])
    const [searchParams] = useSearchParams()
    const selectedDateString = searchParams.get('selectedDate') ?? format(today, 'yyyy-MM-dd')
    const selectedDate = new Date(selectedDateString)

    return <Calendar selectedDate={selectedDate} isLoading={false} />
  },
}

export const RangeCalendar: StoryObj<typeof Calendar> = {
  render: () => {
    const today = useMemo(() => new Date(), [])
    const [searchParams] = useSearchParams()
    const selectedDateString = searchParams.get('selectedDate') ?? format(today, 'yyyy-MM-dd')
    const selectedDate = new Date(selectedDateString)

    // 스토리북 화면에서 항상 ranged가 보이도록 하기 위해 이렇게 작성했습니다.
    // date는 YYYY-MM-DD 형식의 string타입입니다.
    const dates = [
      {
        date: format(subDays(today, 6), 'yyyy-MM-dd'),
        isSolved: true,
      },
      {
        date: format(subDays(today, 4), 'yyyy-MM-dd'),
        isSolved: true,
      },
      {
        date: format(subDays(today, 3), 'yyyy-MM-dd'),
        isSolved: true,
      },
      {
        date: format(subDays(today, 2), 'yyyy-MM-dd'),
        isSolved: true,
      },
    ]

    return <Calendar selectedDate={selectedDate} isLoading={false} dates={dates} />
  },
}
