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

export const currentMonth = () => {
  return parseInt(format(new Date(), 'M'))
}

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

export function getCurrentTime() {
  return format(new Date(), 'HH:mm')
}

export const getTimeStamp = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

// YYYY-MM 형식으로 반환햣
export const formatToYYYYMM = (date: Date): string => {
  if (!isValid(date)) {
    throw new Error('Invalid date')
  }
  return format(date, 'yyyy-MM')
}

// M.D 형식으로 변환
export const formatToMD = (dateString: string): string => {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  return format(date, 'M.d')
}

/** 퀴즈 분석 월 단위 - 이전 달 계산 */
export const getPreviousMonth = (yyyymm: string): string => {
  const [year, month] = yyyymm.split('-').map(Number)
  const date = new Date(year ?? 1, (month ?? 1) - 1)

  if (!isValid(date)) {
    throw new Error('Invalid date')
  }

  return format(subMonths(date, 1), 'yyyy-MM')
}

/** 퀴즈 분석 월 단위 - 다음 달 계산 */
export const getNextMonth = (yyyymm: string): string => {
  const [year, month] = yyyymm.split('-').map(Number)
  const date = new Date(year ?? 1, (month ?? 1) - 1)

  if (!isValid(date)) {
    throw new Error('Invalid date')
  }

  return format(addMonths(date, 1), 'yyyy-MM')
}

/** 퀴즈 분석 주 단위 - 시작 날짜 계산 */
export const getSixDaysAgo = (): Date => {
  return subDays(new Date(), 6)
}

/** 퀴즈 분석 주 단위 - 특정 날짜를 넣으면 [7일 전 날짜, 1일 전 날짜] 반환 */
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
export const isAdjacentDate = (dateString: string): boolean => {
  const today = new Date()
  const input = parseISO(dateString)

  if (!isValid(input)) {
    throw new Error('Invalid date string')
  }

  const diffDays = Math.abs(differenceInDays(today, input))
  return diffDays >= 0.5 && diffDays <= 2.5
}
