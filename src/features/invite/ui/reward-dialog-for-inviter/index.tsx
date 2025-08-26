import { useQueryClient } from '@tanstack/react-query'

import { useConfirmInviteCodeBySignUp } from '@/entities/auth/api/hooks'
import { MEMBER_KEYS } from '@/entities/member/api/config'
import { useUser } from '@/entities/member/api/hooks'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'
import { useTranslation } from '@/shared/locales/use-translation'

const RewardDialogForInviter = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const { mutate: confirmInvite } = useConfirmInviteCodeBySignUp()
  const { t } = useTranslation()

  const handleReward = () => {
    confirmInvite()
    queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]"
      >
        <div className="w-full flex flex-col gap-[16px]">
          <div className="w-full flex-center">
            <div className="relative size-[120px]">
              <ImgStar className="size-[120px]" />

              <div className="absolute bottom-[11px] right-[4px] bg-inverse text-inverse px-[8px] py-[2px] rounded-full">
                x50
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <DialogTitle className="typo-h4 text-center">{t('profile.친구_초대_보상_도착')}</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              {t('profile.초대해주신_님께', { name: user?.name })} <br />
              {t('profile.보상으로_별')}{' '}
              <Text as={'span'} typo="subtitle-2-medium" color="accent">
                {t('profile.개', { count: 50 })}
              </Text>
              {t('profile.를_드려요')}
            </DialogDescription>
          </div>
        </div>

        <Button onClick={handleReward} className="w-full">
          {t('profile.받기')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default RewardDialogForInviter
