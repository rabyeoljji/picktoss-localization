import { useTranslation } from 'react-i18next'

import { withHOC } from '@/app/hoc/with-page-config'

import { ImgConfirm } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { Link } from '@/shared/lib/router'

export const FeedbackCompletePage = () => {
  const { t } = useTranslation()
  return (
    <div className="center flex-center flex-col">
      <ImgConfirm className="w-[100px]" />
      <Text typo="subtitle-1-bold" color="primary" className="mt-4">
        {t('profile.feedback_complete.title')}
      </Text>
      <Text typo="body-1-medium" color="sub" className="text-center mt-2">
        {t('profile.feedback_complete.message1')}
        <br />
        {t('profile.feedback_complete.message2')}
      </Text>

      <Link to="/" replace className="mt-[32px]">
        <Button variant="tertiary" size="md">
          {t('profile.feedback_complete.button')}
        </Button>
      </Link>
    </div>
  )
}

export default withHOC(FeedbackCompletePage, {})
