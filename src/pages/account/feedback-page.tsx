import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { FeedbackForm } from '@/features/feedback/ui/feedback-form'

import { IcBack } from '@/shared/assets/icon'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { useRouter } from '@/shared/lib/router'

const FeedbackPage = () => {
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
            title="문의에서 나가시겠어요?"
            content="지금까지 작성한 내용은 저장되지 않습니다."
            cancelLabel="취소"
            confirmLabel="확인"
            onConfirm={() => router.back()}
          />
        }
        title="문의하기"
      />

      <HeaderOffsetLayout>
        <FeedbackForm onSuccess={() => router.replace('/account/feedback/complete')} />
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(FeedbackPage, {})
