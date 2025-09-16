import { ImgSymbol } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const LoginDialog = ({
  open,
  onOpenChange,
  onClickLogin,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClickLogin?: () => void
}) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]">
        <div className="w-full flex flex-col gap-[16px]">
          <div className="w-full flex-center">
            <ImgSymbol className="size-[120px]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <DialogTitle className="typo-h4 text-center">{t('explore.login_dialog.title')}</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              {t('explore.login_dialog.message1')} <br />
              {t('explore.login_dialog.message2')}
            </DialogDescription>
          </div>
        </div>

        <div className="w-full flex flex-col gap-[24px]">
          <Button
            onClick={() => {
              onClickLogin?.()
              router.push('/login')
            }}
            className="w-full"
          >
            {t('explore.login_dialog.login_button')}
          </Button>
          <DialogClose asChild>
            <button className=" text-sub">{t('explore.login_dialog.close_button')}</button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
