import { differenceInMilliseconds, endOfDay, formatDuration, intervalToDuration } from 'date-fns'
import { ko } from 'date-fns/locale'

// ✅ 기존 함수들 중 date-fns로 대체할 수 있는 것들이 제거되었습니다
// ---
// ⛔ 기존 msToElapsedTime() 함수 제거
// => format(new Date(ms), 'HH:mm:ss')

// ⛔ 기존 millisecondsToMinutes() 함수 제거
// => millisecondsToMinutes(ms)
// ---

export const msToElapsedTimeKorean = (ms: number) => {
  const duration = intervalToDuration({ start: 0, end: ms })
  return formatDuration(duration, { locale: ko })
}

export const getTimeUntilMidnight = () => {
  return differenceInMilliseconds(endOfDay(new Date()), new Date())
}
