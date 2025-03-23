import { FeedbackForm } from '@/features/feedback/ui/feedback-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { useRouter } from '@/shared/lib/router'

export const FeedbackPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-base-1 flex flex-col pb-[40px]">
      <Header left={<BackButton />} title="문의하기" />

      <FeedbackForm onSuccess={() => router.replace('/account/feedback/complete')} />
    </div>
  )
}
