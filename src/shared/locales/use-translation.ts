import React from 'react'
import { useTranslation as useI18nTranslation } from 'react-i18next'

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

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation()

  const changeLanguage = (lng: 'ko-KR' | 'en-US') => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng)
      // 로컬 스토리지에 언어 설정 저장
      localStorage.setItem('i18nextLng', lng)
    } else {
      console.warn('i18n is not properly initialized')
    }
  }

  const currentLanguage = (i18n?.language as 'ko-KR' | 'en-US') || 'ko-KR'

  // 초기 언어 설정
  React.useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      // 저장된 언어 설정이 있으면 사용, 없으면 시스템 언어 감지
      const savedLanguage = localStorage.getItem('i18nextLng') as 'ko-KR' | 'en-US'
      const defaultLanguage = savedLanguage || detectSystemLanguage()

      if (defaultLanguage !== currentLanguage) {
        i18n.changeLanguage(defaultLanguage)
      }
    }
  }, [i18n, currentLanguage])

  return {
    t,
    changeLanguage,
    currentLanguage,
    i18n,
  }
}
