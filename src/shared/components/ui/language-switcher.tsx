import { useTranslation } from '@/shared/locales/use-translation'

import { Button } from './button'

// 임시 언어 변환 스위치 주석
export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useTranslation()

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === 'ko-KR' ? 'en-US' : 'ko-KR'
    changeLanguage(newLanguage)
  }

  return (
    <Button onClick={handleLanguageChange} variant="primary" size="sm" className="fixed top-4 right-4 z-50">
      {currentLanguage === 'ko-KR' ? 'EN' : 'KO'}
    </Button>
  )
}
