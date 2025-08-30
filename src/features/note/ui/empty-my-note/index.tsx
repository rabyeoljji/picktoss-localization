import { ImgNoteEmpty } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const EmptyMyNote = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="size-full flex-center flex-col gap-[32px]">
      <div className="flex-center flex-col gap-[16px]">
        <ImgNoteEmpty className="size-[120px]" />

        <div className="flex-center flex-col gap-[8px]">
          <Text typo="subtitle-1-bold">{t('library.empty_my_note.title')}</Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('library.empty_my_note.description')} <br />
            {t('library.empty_my_note.action')}
          </Text>
        </div>
      </div>

      <Button
        size={'md'}
        className="size-fit"
        onClick={() =>
          router.push('/note/create', {
            search: {
              documentType: 'TEXT',
            },
          })
        }
      >
        {t('library.empty_my_note.create_button')}
      </Button>
    </div>
  )
}

export default EmptyMyNote
