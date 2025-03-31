import { withHOC } from '@/app/hoc/with-page-config'

import { FeedbackForm } from '@/features/feedback/ui/feedback-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { useRouter } from '@/shared/lib/router'

const FeedbackPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-base-1 flex flex-col pb-[40px]">
      <Header
        left={
          <SystemDialog
            trigger={<BackButton onClick={() => {}} />}
            title="문의에서 나가시겠어요?"
            content="지금까지 작성한 내용은 저장되지 않습니다."
            cancelLabel="취소"
            confirmLabel="확인"
            onConfirm={() => router.back()}
          />
        }
        title="문의하기"
      />

      <FeedbackForm onSuccess={() => router.replace('/account/feedback/complete')} />
    </div>
  )
}

export default withHOC(FeedbackPage, {})
