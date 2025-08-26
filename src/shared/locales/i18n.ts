import { initReactI18next } from 'react-i18next'

import i18next from 'i18next'

import en_US from './en-US/translation.json'
import ko_KR from './ko-KR/translation.json'

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
const detectSystemLanguage = (): 'ko-KR' | 'en-US' => {
  // 브라우저 언어 설정 확인
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en-US'

  // 한국어 관련 언어 코드인지 확인
  if (browserLanguage.startsWith('ko') || browserLanguage.startsWith('ko-KR')) {
    return 'ko-KR'
  }

  // 기본값은 영어
  return 'en-US'
}

// 지원하는 언어와 해당 리소스 매핑
const resources = {
  'ko-KR': { translation: ko_KR },
  'en-US': { translation: en_US },
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
      keySeparator: false, // 키 분리자 비활성화
      nsSeparator: false, // 네임스페이스 분리자 비활성화
      returnEmptyString: false, // 빈 문자열 반환하지 않음
      postProcess: ['removeEmptyVars'],
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
      // 누락된 키 처리 핸들러
      parseMissingKeyHandler: (key) => {
        console.warn('Missing translation key:', key)
        // 개발 환경에서는 키를 그대로 반환하여 누락된 번역을 쉽게 확인할 수 있도록 함
        return `[${key}]`
      },
    })
}

export const i18n = i18next
