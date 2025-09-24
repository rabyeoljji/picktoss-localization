export type ServiceLanguage = 'ko-KR' | 'en-US'

export interface LanguageObject {
  key: ServiceLanguage
  label: string
}

export const LANGUAGE = {
  KOREAN: {
    key: 'ko-KR',
    label: '한국어',
  },
  ENGLISH: {
    key: 'en-US',
    label: 'English',
  },
} satisfies Record<string, LanguageObject>
