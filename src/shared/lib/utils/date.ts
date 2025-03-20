import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isValid,
  parseISO,
  setHours,
  subDays,
  subMonths,
} from 'date-fns'

const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

// TODO: date-fns의 format 함수로 대체 가능 (예: format(parseISO(dateString), 'yyyy년 M월 d일 EEEE', { locale: koLocale }))
export const formatDateKorean = (
  dateString: string,
  option?: {
    year?: boolean
    month?: boolean
    day?: boolean
    dayOfWeek?: boolean
  },
): string => {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  if (option) {
    return [
      option?.year && `${format(date, 'yyyy')}년`,
      option?.month && `${parseInt(format(date, 'M'))}월`,
      option?.day && `${parseInt(format(date, 'd'))}일`,
      option?.dayOfWeek && days[date.getDay()],
    ]
      .filter(Boolean)
      .join(' ')
  } else {
    return `${format(date, 'yyyy')}년 ${parseInt(format(date, 'M'))}월 ${parseInt(format(date, 'd'))}일 ${days[date.getDay()]}`
  }
}

// TODO: date-fns의 format 함수로 대체 가능 (예: format(new Date(), 'yyyy년 M월 d일 EEEE', { locale: koLocale }))
export const getCurrentDate = (option?: {
  year?: boolean
  month?: boolean
  day?: boolean
  dayOfWeek?: boolean
}): string => {
  const date = new Date()

  if (option) {
    return [
      option?.year && `${format(date, 'yyyy')}년`,
      option?.month && `${parseInt(format(date, 'M'))}월`,
      option?.day && `${parseInt(format(date, 'd'))}일`,
      option?.dayOfWeek && days[date.getDay()],
    ]
      .filter(Boolean)
      .join(' ')
  }

  return `${format(date, 'yyyy')}년 ${parseInt(format(date, 'M'))}월 ${parseInt(format(date, 'd'))}일 ${days[date.getDay()]}`
}

// TODO: date-fns의 formatDistanceToNow 함수로 대체 가능 (예: formatDistanceToNow(parseISO(time), { addSuffix: true, locale: koLocale }))
export const getRelativeTime = (time: string) => {
  const inputTime = parseISO(time)
  const currentTime = new Date()

  if (!isValid(inputTime)) {
    throw new Error('Invalid date string')
  }

  const relativeMinutes = differenceInMinutes(currentTime, inputTime)
  const relativeHours = differenceInHours(currentTime, inputTime)
  const relativeDays = differenceInDays(currentTime, inputTime)

  if (relativeMinutes < 10) {
    return '방금 전'
  }
  if (relativeMinutes < 60) {
    return `${relativeMinutes}분 전`
  }
  if (relativeHours < 24) {
    return `${relativeHours}시간 전`
  }
  if (relativeDays === 1) {
    return `하루 전`
  }
  if (relativeDays === 2) {
    return `이틀 전`
  }
  if (relativeDays < 4) {
    return `${relativeDays}일 전`
  }

  return `${parseInt(format(inputTime, 'M'))}월 ${parseInt(format(inputTime, 'd'))}일`
}

// TODO: date-fns의 format 함수로 대체 가능 (예: parseInt(format(new Date(), 'M')))
export const currentMonth = () => parseInt(format(new Date(), 'M'))

// TODO: date-fns의 differenceInHours, differenceInMinutes 함수로 더 간단하게 구현 가능
export function calculateTimeUntilTomorrowMidnight() {
  const now = new Date()
  const tomorrowMidnight = setHours(addDays(now, 1), 0)
  tomorrowMidnight.setMinutes(0, 0, 0)

  const timeDifference = tomorrowMidnight.getTime() - now.getTime()

  if (timeDifference <= 0) {
    return { hours: 0, minutes: 0 }
  }

  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

// TODO: date-fns의 format 함수로 대체 가능 (예: format(new Date(), 'HH:mm'))
export const getCurrentTime = () => format(new Date(), 'HH:mm')

export const getTimeStamp = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

// TODO: date-fns의 format 함수로 직접 대체 가능 (예: format(date, 'yyyy-MM'))
export const formatToYYYYMM = (date: Date): string => {
  if (!isValid(date)) {
    throw new Error('Invalid date')
  }
  return format(date, 'yyyy-MM')
}

// TODO: date-fns의 format 함수로 직접 대체 가능 (예: format(parseISO(dateString), 'M.d'))
export const formatToMD = (dateString: string): string => {
  const date = parseISO(dateString)
  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }
  return format(date, 'M.d')
}

/** 퀴즈 분석 월 단위 - 이전 달 계산 */
// TODO: date-fns의 subMonths와 format 함수로 대체 가능 (예: format(subMonths(parseISO(`${yyyymm}-01`), 1), 'yyyy-MM'))
export const getPreviousMonth = (yyyymm: string): string => {
  const [year, month] = yyyymm.split('-').map(Number)
  const date = new Date(year ?? 1, (month ?? 1) - 1)

  if (!isValid(date)) {
    throw new Error('Invalid date')
  }

  return format(subMonths(date, 1), 'yyyy-MM')
}

/** 퀴즈 분석 월 단위 - 다음 달 계산 */
// TODO: date-fns의 addMonths와 format 함수로 대체 가능 (예: format(addMonths(parseISO(`${yyyymm}-01`), 1), 'yyyy-MM'))
export const getNextMonth = (yyyymm: string): string => {
  const [year, month] = yyyymm.split('-').map(Number)
  const date = new Date(year ?? 1, (month ?? 1) - 1)

  if (!isValid(date)) {
    throw new Error('Invalid date')
  }

  return format(addMonths(date, 1), 'yyyy-MM')
}

/** 퀴즈 분석 주 단위 - 시작 날짜 계산 */
// TODO: date-fns의 subDays 함수로 직접 대체 가능 (예: subDays(new Date(), 6))
export const getSixDaysAgo = (): Date => subDays(new Date(), 6)

/** 퀴즈 분석 주 단위 - 특정 날짜를 넣으면 [7일 전 날짜, 1일 전 날짜] 반환 */
// TODO: date-fns의 subDays와 format 함수만으로 간결하게 구현 가능
export const getPastDatesFromGivenDate = (dateString: string): string[] => {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  const sevenDaysAgo = subDays(date, 7)
  const oneDayAgo = subDays(date, 1)

  return [format(sevenDaysAgo, 'yyyy-MM-dd'), format(oneDayAgo, 'yyyy-MM-dd')]
}

/** 퀴즈 분석 주 단위 - 특정 날짜를 넣으면 [1일 후 날짜, 7일 후 날짜] 반환 */
// TODO: date-fns의 addDays와 format 함수만으로 간결하게 구현 가능
export const getFutureDatesFromGivenDate = (dateString: string): string[] => {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  const oneDayLater = addDays(date, 1)
  const sevenDaysLater = addDays(date, 7)

  return [format(oneDayLater, 'yyyy-MM-dd'), format(sevenDaysLater, 'yyyy-MM-dd')]
}

/** 오늘을 기준으로 +-2일에 해당할 경우 true 반환 */
// TODO: date-fns의 differenceInDays 함수만으로도 간결하게 구현 가능 (예: Math.abs(differenceInDays(new Date(), parseISO(dateString))) <= 2)
export const isAdjacentDate = (dateString: string): boolean => {
  const input = parseISO(dateString)

  if (!isValid(input)) {
    throw new Error('Invalid date string')
  }

  return Math.abs(differenceInDays(new Date(), input)) <= 2
}
