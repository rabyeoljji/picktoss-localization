import { useRewardForInviteCode } from '@/entities/auth/api/hooks'
import { useUser } from '@/entities/member/api/hooks'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'
import { removeLocalStorageItem } from '@/shared/lib/storage/lib'
import { useTranslation } from '@/shared/locales/use-translation'

const RewardDialogForInvitee = ({
  open,
  onOpenChange,
  inviteCode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
}) => {
  const { data: user } = useUser()
  const { mutate: rewardForInviteCode } = useRewardForInviteCode()
  const { t } = useTranslation()

  const handleReward = () => {
    rewardForInviteCode(
      { data: { inviteCode } },
      {
        onSuccess: () => {
          removeLocalStorageItem('inviteCode')
          onOpenChange(false)
        },
        onError: (error) => {
          console.error('보상 지급 실패:', error)
        },
      },
    )
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
            <DialogTitle className="typo-h4 text-center">{t('profile.추가_별_지급')}</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              {t('profile.초대장을_받으신_님께', { name: user?.name })} <br />
              {t('profile.별')}{' '}
              <Text as={'span'} typo="subtitle-2-medium" color="accent">
                {t('profile.개', { count: 50 })}
              </Text>
              {t('profile.를_추가로_드려요')}
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

export default RewardDialogForInvitee
