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
            title={t('profile.feedback_form.exit_confirm_title')}
            content={t('profile.feedback_form.exit_confirm_message')}
            cancelLabel={t('profile.feedback_form.cancel_button')}
            confirmLabel={t('profile.feedback_form.confirm_button')}
            onConfirm={() => router.back()}
          />
        }
        title={t('profile.feedback_form.inquiry_title')}
      />

      <HeaderOffsetLayout>
        <FeedbackForm onSuccess={() => router.replace('/account/feedback/complete')} />
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(FeedbackPage, {})
