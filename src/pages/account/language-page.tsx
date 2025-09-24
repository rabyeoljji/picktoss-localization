import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { LANGUAGE, ServiceLanguage } from '@/shared/locales/language'
import { useTranslation } from '@/shared/locales/use-translation'

const LanguagePage = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation()

  const handleLanguageChange = (value: ServiceLanguage) => {
    changeLanguage(value)
  }

  return (
    <>
      <Header left={<BackButton />} title={t('profile.language.header')} />

      <HeaderOffsetLayout className="h-full flex flex-col overflow-x-hidden px-[16px] justify-between">
        <div className="px-[4px] py-[22px]">
          <RadioGroup name="quizType" defaultValue={currentLanguage} onValueChange={handleLanguageChange}>
            <Label className="flex items-center gap-3 w-full py-[10px] cursor-pointer">
              <RadioGroupItem value={LANGUAGE.KOREAN.key} />
              <Text typo="subtitle-2-medium" color="primary">
                {LANGUAGE.KOREAN.label}
              </Text>
            </Label>
            <Label className="flex items-center gap-3 w-full py-[10px] cursor-pointer">
              <RadioGroupItem value={LANGUAGE.ENGLISH.key} />
              <Text typo="subtitle-2-medium" color="primary">
                {LANGUAGE.ENGLISH.label}
              </Text>
            </Label>
          </RadioGroup>
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(LanguagePage, {})
