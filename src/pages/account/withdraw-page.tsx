import { useTranslation } from 'react-i18next'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import WithdrawForm from '@/features/withdraw/ui/withdraw-form'

import { useUser } from '@/entities/member/api/hooks'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Text } from '@/shared/components/ui/text'

const WithdrawPage = () => {
  const { data } = useUser()
  const { t } = useTranslation()
  return (
    <>
      <Header left={<BackButton />} title={t('profile.withdraw_form.title')} />

      <HeaderOffsetLayout className="overflow-x-hidden w-full flex flex-col">
        <div className="px-[16px]">
          <Text typo="h4" className="pb-[8px] pt-[20px]">
            {t('profile.withdraw_form.message1', { name: data?.name })}
          </Text>
          <Text typo="body-1-medium" color="sub">
            {t('profile.withdraw_form.message2')}
          </Text>
        </div>

        <WithdrawForm />
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(WithdrawPage, {})
