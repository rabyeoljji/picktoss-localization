/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { Meta, StoryObj } from '@storybook/react'
import { subDays } from 'date-fns'

import { formatToYYYYMMDD } from '@/shared/lib/utils/date'

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
    const selectedDateString = searchParams.get('selectedDate') ?? formatToYYYYMMDD(today)
    const selectedDate = new Date(selectedDateString)

    return <Calendar selectedDate={selectedDate} isLoading={false} />
  },
}

export const RangeCalendar: StoryObj<typeof Calendar> = {
  render: () => {
    const today = useMemo(() => new Date(), [])
    const [searchParams] = useSearchParams()
    const selectedDateString = searchParams.get('selectedDate') ?? formatToYYYYMMDD(today)
    const selectedDate = new Date(selectedDateString)

    const dates = [
      {
        date: formatToYYYYMMDD(subDays(today, 4)),
        isSolved: true,
      },
      {
        date: formatToYYYYMMDD(subDays(today, 3)),
        isSolved: true,
      },
      {
        date: formatToYYYYMMDD(subDays(today, 2)),
        isSolved: true,
      },
    ]

    return <Calendar selectedDate={selectedDate} isLoading={false} dates={dates} />
  },
}
