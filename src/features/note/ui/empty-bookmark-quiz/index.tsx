import { ImgBookmarkEmpty } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const EmptyBookmarkQuiz = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="size-full flex-center flex-col gap-[32px]">
      <div className="flex-center flex-col gap-[16px]">
        <ImgBookmarkEmpty className="size-[120px]" />

        <div className="flex-center flex-col gap-[8px]">
          <Text typo="subtitle-1-bold">{t('library.empty_bookmark_quiz.title')}</Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('library.empty_bookmark_quiz.description')} <br />
            {t('library.empty_bookmark_quiz.action')}
          </Text>
        </div>
      </div>

      <Button size={'md'} className="size-fit" onClick={() => router.replace('/explore')}>
        {t('library.empty_bookmark_quiz.view_button')}
      </Button>
    </div>
  )
}

export default EmptyBookmarkQuiz
