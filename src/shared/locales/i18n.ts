import { initReactI18next } from 'react-i18next'

import i18next from 'i18next'

import en_US from './en-US/translation.json'
import ko_KR from './ko-KR/translation.json'

export const SUPPORTED_LANGUAGE = {
  KO: 'ko',
  EN: 'en',
} as const
export type SUPPORTED_LANGUAGE_KEY = keyof typeof SUPPORTED_LANGUAGE
export type SUPPORTED_LANGUAGE_VALUE = (typeof SUPPORTED_LANGUAGE)[SUPPORTED_LANGUAGE_KEY]

export const SUPPORTED_LOCALE = {
  KO: 'ko-KR',
  EN: 'en-US',
} as const
export type SUPPORTED_LOCALE_KEY = keyof typeof SUPPORTED_LOCALE
export type SUPPORTED_LOCALE_VALUE = (typeof SUPPORTED_LOCALE)[SUPPORTED_LOCALE_KEY]

// 지원하는 언어와 해당 리소스 매핑
const resources = {
  'ko-KR': { translation: ko_KR },
  'en-US': { translation: en_US },
}

// const LANGUAGE_COOKIE_NAME = 'lang'
// const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

// const setLanguageCookie = (language: string) => {
//   if (typeof document === 'undefined') {
//     return
//   }
//   document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(language)}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`
// }

// 전달된 옵션이 없거나 빈 객체인 경우 남은 {{var}} 자리표시자를 제거하는 postProcessor
i18next.use({
  type: 'postProcessor',
  name: 'removeEmptyVars',
  process: (value: string, _key: string) => {
    // 남아있는 {{...}} 자리표시자는 모두 제거
    return value.replace(/\{\{\s*[^}]+\s*\}\}/g, '')
  },
})

// 시스템 언어 감지 함수
const detectSystemLanguage = (): SUPPORTED_LOCALE_VALUE => {
  // 브라우저 언어 설정 확인
  const browserLanguage = navigator.language || navigator.languages?.[0] || SUPPORTED_LOCALE.EN

  // 한국어 관련 언어 코드인지 확인
  if (browserLanguage.startsWith(SUPPORTED_LANGUAGE.KO) || browserLanguage.startsWith(SUPPORTED_LOCALE.KO)) {
    return SUPPORTED_LOCALE.KO
  }

  // 기본값은 영어
  return SUPPORTED_LOCALE.EN
}

export const initializeI18next = (lng?: string): void => {
  // 언어가 지정되지 않았으면 시스템 언어 감지
  const defaultLanguage = lng || detectSystemLanguage()
  i18next
    .use(initReactI18next) // React i18next 초기화
    .init({
      resources, // 리소스 객체를 직접 전달
      lng: defaultLanguage, // 기본 언어 설정
      fallbackLng: false, // 기본 언어로 대체되지 않게 설정
      debug: true, // 디버그 모드 활성화
      nsSeparator: false, // 네임스페이스 분리자 비활성화
      returnEmptyString: false, // 빈 문자열 반환하지 않음
      postProcess: ['removeEmptyVars'],
      interpolation: {
        prefix: '{{',
        suffix: '}}',
        escapeValue: false, // ← React가 이미 XSS 방지 이스케이프를 해줌
      },
      // 누락된 키 처리 핸들러
      parseMissingKeyHandler: (key) => {
        console.warn('Missing translation key:', key)
        // 개발 환경에서는 키를 그대로 반환하여 누락된 번역을 쉽게 확인할 수 있도록 함
        return `[${key}]`
      },
    })
  // setLanguageCookie(defaultLanguage)
}

export const i18n = i18next

// if (typeof window !== 'undefined') {
//   i18next.on('languageChanged', setLanguageCookie)
// }
