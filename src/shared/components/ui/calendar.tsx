'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { isSameMonth } from 'date-fns'

import { IcDateNext, IcDatePrevious } from '@/shared/assets/icon'
import { cn } from '@/shared/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  today: Date
  selectedMonth: Date
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  selectedMonth,
  onMonthChange,
  today,
  ...props
}: CalendarProps) {
  const isCurrentMonth = (month: Date) => isSameMonth(month, today)

  return (
    <DayPicker
      month={selectedMonth}
      onMonthChange={onMonthChange}
      showOutsideDays={showOutsideDays}
      disabled={{
        after: today,
      }}
      className={cn('p-3', className)}
      classNames={{
        root: 'flex-center',
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'w-full flex-center pt-1 relative',
        caption_label: 'typo-h4',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          // buttonVariants({ variant: 'mediumIcon' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed',
        ),
        nav_button_previous: 'center !translate-x-[calc(50%-65px)] !translate-y-[-12px]',
        nav_button_next: cn(
          'center !translate-x-[calc(50%+22px)] !translate-y-[-12px]',
          selectedMonth &&
            isCurrentMonth(selectedMonth) &&
            'opacity-100 text-icon-disabled cursor-not-allowed pointer-events-none',
        ),
        table: 'flex-center flex-col border-collapse space-y-1',
        head_row: 'flex text-caption',
        head_cell: 'text-muted-foreground rounded-md w-11 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'cell h-9 w-11 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-md [&:has(.day-range-middle)]:bg-accent [&:has(.day-range-start)]:bg-accent [&:has(.day-range-start)]:rounded-l-full [&:has(.day-range-end)]:bg-accent [&:has(.day-range-end)]:rounded-r-full focus-within:relative focus-within:z-20',
        ),
        day: cn(
          // buttonVariants({ variant: 'mediumIcon' }),
          'h-9 w-9 p-0 font-normal aria-selected:bg-orange-strong rounded-full hover:bg-orange-strong hover:rounded-full hover:text-white focus:bg-orange-strong focus:text-white focus:rounded-full',
        ),
        day_range_start: 'day-range-start rounded-l-full bg-accent hover:bg-orange-strong',
        day_range_middle: 'bg-accent aria-selected:bg-accent aria-selected:text-inverse hover:bg-orange-strong',
        day_range_end: 'day-range-end rounded-r-full bg-accent hover:bg-orange-strong',
        day_selected:
          'rounded-full !bg-orange-strong text-white hover:bg-orange-strong hover:text-white focus:bg-orange-strong focus:bg-orange-strong focus:text-white',
        day_today: 'text-accent',
        day_outside: 'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-disabled bg-transparent cursor-not-allowed pointer-events-none',
        day_hidden: 'invisible',
        ...classNames,
      }}
      modifiersClassNames={{
        day_range_start:
          'day-range-start rounded-l-full bg-accent hover:bg-button-fill-primary after:h-full after:w-[8px] after:bg-accent after:absolute after:top-0 after:right-[-4px]',
        day_range_end:
          'day-range-end rounded-r-full bg-accent hover:bg-button-fill-primary before:h-full before:w-[8px] before:bg-accent before:absolute before:top-0 before:left-[-4px]',
        day_range_middle:
          'day-range-middle bg-accent hover:bg-button-fill-primary before:h-full before:w-[8px] before:bg-accent before:absolute before:top-0 before:left-[-4px] after:h-full after:w-[8px] after:bg-accent after:absolute after:top-0 after:right-[-4px]',
        single_solved_day: 'rounded-full bg-accent hover:bg-button-fill-primary',
      }}
      components={{
        IconLeft: ({ ...props }) => <IcDatePrevious width={16} height={16} {...props} />,
        IconRight: ({ ...props }) => (
          <IcDateNext
            width={16}
            height={16}
            className={cn(
              selectedMonth &&
                isCurrentMonth(selectedMonth) &&
                'text-icon-disabled cursor-not-allowed pointer-events-none',
            )}
            {...props}
          />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar as ShadcnCalendar }
