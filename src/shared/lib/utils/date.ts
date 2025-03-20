import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMinutes,
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
  subDays,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'

export const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

// ✅ 기존 함수들 중 date-fns로 대체할 수 있는 것들이 제거되었습니다
// ---
// ⛔ 기존 formatDateKorean() 함수 제거
// 아래와 같이 필요한 데이터 변환해서 사용하면 됨
// (예: format(parseISO(dateString), 'yyyy년', { locale: ko }))
// (예: format(parseISO(dateString), 'yyyy년 M월 d일 EEEE', { locale: ko }))

// ⛔ 기존 getCurrentDate() 함수 제거
// 아래와 같이 필요한 데이터 변환해서 사용하면 됨
// (예: format(new Date(), 'yyyy년', { locale: ko }))
// (예: format(new Date(), 'yyyy년 M월 d일 EEEE', { locale: ko }))

// ⛔ 기존 currentMonth() 함수 제거
// => parseInt(format(new Date(), 'M'))

// ⛔ 기존 getCurrentTime() 함수 제거
// => format(new Date(), 'HH:mm')

// ⛔ 기존 formatToYYYYMM() 함수 제거
// => format(date, 'yyyy-MM')

// ⛔ 기존 formatToMD() 함수 제거
// => format(date, 'M.d')

// ⛔ 기존 getSixDaysAgo() 함수 제거
// => subDays(new Date(), 6)
// ---

/** 방금 전 / 하루 전 / 이틀 전 등으로 반환 */
export const getRelativeTime = (time: string) => {
  const inputTime = parseISO(time)
  const currentTime = new Date()

  if (!isValid(inputTime)) {
    throw new Error('Invalid date string')
  }

  const minutesDiff = differenceInMinutes(currentTime, inputTime)
  const daysDiff = differenceInDays(currentTime, inputTime)

  // 10분 이내라면 "방금 전" 반환
  if (minutesDiff < 10) {
    return '방금 전'
  }
  if (daysDiff === 1) {
    return '하루 전'
  }
  if (daysDiff === 2) {
    return '이틀 전'
  }

  // 4일 이상이라면 날짜 형식으로 변환
  if (daysDiff >= 4) {
    return `${parseInt(format(inputTime, 'M'))}월 ${parseInt(format(inputTime, 'd'))}일`
  }

  // 기본적으로 한국어 상대 시간 반환
  return formatDistanceToNow(inputTime, { addSuffix: true, locale: ko })
}

/** timeStamp 반환 */
export const getTimeStamp = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}`
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

/** 퀴즈 분석 주 단위 - 특정 날짜를 넣으면 [7일 전 날짜, 1일 전 날짜] 반환 */
export const getPastDatesFromGivenDate = (dateString: string): string[] => {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  return [format(subDays(date, 7), 'yyyy-MM-dd'), format(subDays(date, 1), 'yyyy-MM-dd')]
}

/** 퀴즈 분석 주 단위 - 특정 날짜를 넣으면 [1일 후 날짜, 7일 후 날짜] 반환 */
export const getFutureDatesFromGivenDate = (dateString: string): string[] => {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  return [format(addDays(date, 1), 'yyyy-MM-dd'), format(addDays(date, 7), 'yyyy-MM-dd')]
}

/** 오늘을 기준으로 +-2일에 해당할 경우 true 반환 */
export const isAdjacentDate = (dateString: string): boolean => {
  const input = parseISO(dateString)

  if (!isValid(input)) {
    throw new Error('Invalid date string')
  }

  return Math.abs(differenceInDays(new Date(), input)) <= 2
}
