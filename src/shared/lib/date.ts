import {
  differenceInCalendarDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isValid,
} from 'date-fns'

import { SUPPORTED_LOCALE, SUPPORTED_LOCALE_VALUE, i18n } from '@/shared/locales/i18n'

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

const rtfCache: Record<string, Intl.RelativeTimeFormat> = {}

const getFormatter = (lang: string) => {
  if (!rtfCache[lang]) {
    rtfCache[lang] = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  }
  return rtfCache[lang]
}

/** 방금 전 / 하루 전 / 이틀 전 등으로 반환 */
export const getRelativeTime = (time: string) => {
  const parsed = new Date(time)
  if (!isValid(parsed)) throw new Error('Invalid date string')

  const now = new Date()
  const lang = (i18n.language as SUPPORTED_LOCALE_VALUE) ?? SUPPORTED_LOCALE.EN
  const formatter = getFormatter(lang)
  const minutes = differenceInMinutes(now, parsed)

  if (minutes < 10) return i18n.t('common.relative_time.justNow')
  const days = differenceInDays(now, parsed)
  if (days === 1) return i18n.t('common.relative_time.oneDayAgo')
  if (days === 2) return i18n.t('common.relative_time.twoDaysAgo')
  if (days >= 4) {
    return format(parsed, lang === SUPPORTED_LOCALE.KO ? 'M월 d일' : 'MMM d')
  }

  if (minutes < 60) return formatter.format(-minutes, 'minute')
  const hours = differenceInHours(now, parsed)
  if (hours < 24) return formatter.format(-hours, 'hour')
  return formatter.format(-days, 'day')
}

/** 오늘을 기준으로 +-2일에 해당할 경우 true 반환 */
export const isAdjacentDate = (dateString: string): boolean => {
  const input = new Date(dateString)

  if (!isValid(input)) {
    throw new Error('Invalid date string')
  }

  return Math.abs(differenceInCalendarDays(new Date(), input)) <= 2
}
