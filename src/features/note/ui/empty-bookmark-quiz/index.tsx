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
          <Text typo="subtitle-1-bold">{t('library.저장한_퀴즈가_없어요')}</Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('library.픽토스에서_사람들이_만든')} <br />
            {t('library.관심분야의_퀴즈를_저장해_보세요')}
          </Text>
        </div>
      </div>

      <Button size={'md'} className="size-fit" onClick={() => router.replace('/explore')}>
        {t('library.퀴즈_보러가기')}
      </Button>
    </div>
  )
}

export default EmptyBookmarkQuiz
