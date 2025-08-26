import { useTranslation } from 'react-i18next'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { FeedbackForm } from '@/features/feedback/ui/feedback-form'

import { IcBack } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { useRouter } from '@/shared/lib/router'

const FeedbackPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <Header
        left={
          <SystemDialog
            trigger={
              <button className="p-2">
                <IcBack />
              </button>
            }
            title={t('profile.문의에서_나가시겠어요')}
            content={t('profile.지금까지_작성한_내용은_저장되지_않습니다')}
            cancelLabel={t('profile.취소')}
            confirmLabel={t('profile.확인')}
            onConfirm={() => router.back()}
          />
        }
        title={t('profile.문의하기')}
      />

      <HeaderOffsetLayout>
        <FeedbackForm onSuccess={() => router.replace('/account/feedback/complete')} />
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(FeedbackPage, {})
