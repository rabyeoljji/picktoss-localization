import React from 'react'
import { useTranslation as useI18nTranslation } from 'react-i18next'

import { SUPPORTED_LOCALE_VALUE } from '@/shared/locales/i18n'
import { LANGUAGE } from '@/shared/locales/language'

// 시스템 언어 감지 함수
const detectSystemLanguage = (): SUPPORTED_LOCALE_VALUE => {
  // 브라우저 언어 설정 확인
  const browserLanguage = navigator.language || navigator.languages?.[0] || LANGUAGE.ENGLISH.key

  // 한국어 관련 언어 코드인지 확인
  if (browserLanguage.startsWith('ko') || browserLanguage.startsWith(LANGUAGE.KOREAN.key)) {
    return LANGUAGE.KOREAN.key
  }

  // 기본값은 영어
  return LANGUAGE.ENGLISH.key
}

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation()

  const changeLanguage = (lng: SUPPORTED_LOCALE_VALUE) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng)
      // 로컬 스토리지에 언어 설정 저장
      localStorage.setItem('i18nextLng', lng)
    } else {
      console.warn('i18n is not properly initialized')
    }
  }

  const currentLanguage = (i18n?.language as SUPPORTED_LOCALE_VALUE) || LANGUAGE.KOREAN.key

  // 초기 언어 설정
  React.useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      // 저장된 언어 설정이 있으면 사용, 없으면 시스템 언어 감지
      const savedLanguage = localStorage.getItem('i18nextLng') as SUPPORTED_LOCALE_VALUE
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
