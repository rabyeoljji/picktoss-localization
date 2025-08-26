import { useTranslation } from 'react-i18next'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import WithdrawForm from '@/features/withdraw/ui/withdraw-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Text } from '@/shared/components/ui/text'

const WithdrawPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Header left={<BackButton />} title={t('profile.회원탈퇴')} />

      <HeaderOffsetLayout className="overflow-x-hidden w-full flex flex-col">
        <div className="px-[16px]">
          <Text typo="h4" className="pb-[8px] pt-[20px]">
            {t('profile.픽토스님이_떠나시는_이유를_알려주세요')}
          </Text>
          <Text typo="body-1-medium" color="sub">
            {t('profile.주신_의견을_통해_더_나은_서비스를_만들_수_있도록_노력할게요')}
          </Text>
        </div>

        <WithdrawForm />
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(WithdrawPage, {})
