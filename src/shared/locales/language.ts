import { SUPPORTED_LOCALE, SUPPORTED_LOCALE_VALUE } from '@/shared/locales/i18n'

export interface LanguageObject {
  key: SUPPORTED_LOCALE_VALUE
  label: string
}

export const LANGUAGE = {
  KOREAN: {
    key: SUPPORTED_LOCALE.KO,
    label: '한국어',
  },
  ENGLISH: {
    key: SUPPORTED_LOCALE.EN,
    label: 'English',
  },
} satisfies Record<string, LanguageObject>
