import { ImgPageerror } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const NotFound = () => {
  const { t } = useTranslation()

  const router = useRouter()

  return (
    <div className="flex-center size-full flex-col gap-8 bg-surface-2">
      <div className="flex-center flex-col">
        <ImgPageerror className="size-24" />

        <div className="mt-4 flex flex-col items-center gap-2">
          <Text typo="subtitle-1-bold" className="text-center">
            {t('etc.not_found.title')}
          </Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('etc.not_found.message1')} <br /> {t('etc.not_found.message2')}
          </Text>
        </div>
      </div>

      <Button onClick={() => router.replace('/')} variant={'primary'} size={'md'} className="w-fit">
        {t('etc.not_found.button')}
      </Button>
    </div>
  )
}

export default NotFound
