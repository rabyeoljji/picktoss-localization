import { FeedbackForm } from '@/features/feedback/ui/feedback-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'

export const FeedbackPage = () => {
  return (
    <div className="min-h-screen bg-base-1 flex flex-col pb-[40px]">
      <Header left={<BackButton />} title="문의하기" />

      <FeedbackForm />
    </div>
  )
}
