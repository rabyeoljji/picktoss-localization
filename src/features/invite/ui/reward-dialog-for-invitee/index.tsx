import { useRewardForInviteCode } from '@/entities/auth/api/hooks'

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
  userName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
  userName: string
}) => {
  const isSpecial = inviteCode === 'KONKUK' || inviteCode === 'SANGMYUNG'

  const { mutate: rewardForInviteCode } = useRewardForInviteCode()

  const handleReward = () => {
    rewardForInviteCode(
      { data: { inviteCode } },
      {
        onSuccess: () => {
          removeLocalStorageItem('inviteCode')
          removeLocalStorageItem('checkRewardDialog')
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
      {isSpecial ? (
        <RewardDialogContentForSpecial userName={userName} handleReward={handleReward} />
      ) : (
        <RewardDialogContentForInvitee userName={userName} handleReward={handleReward} />
      )}
    </Dialog>
  )
}

export default RewardDialogForInvitee

const RewardDialogContentForInvitee = ({ userName, handleReward }: { userName: string; handleReward: () => void }) => {
  const { t } = useTranslation()

  return (
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
          <DialogTitle className="typo-h4 text-center">{t('profile.invite_reward_dialog.title')}</DialogTitle>
          <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
            {t('profile.invite_reward_dialog.receive_message1')}{' '}
            {t('profile.invite_reward_dialog.dear_name', { name: userName })} <br />
            {t('profile.invite_reward_dialog.star_unit')}{' '}
            <Text as={'span'} typo="subtitle-2-medium" color="accent">
              {t('profile.invite_reward_dialog.star_count', { count: 50 })}
            </Text>
            {t('profile.invite_reward_dialog.receive_message2')}
          </DialogDescription>
        </div>
      </div>

      <Button onClick={handleReward} className="w-full">
        {t('profile.invite_reward_dialog.receive_button')}
      </Button>
    </DialogContent>
  )
}

const RewardDialogContentForSpecial = ({ userName, handleReward }: { userName: string; handleReward: () => void }) => {
  const { t } = useTranslation()

  return (
    <DialogContent
      onPointerDownOutside={(e) => e.preventDefault()}
      className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]"
    >
      <div className="w-full flex flex-col gap-[16px]">
        <div className="w-full flex-center">
          <div className="relative size-[120px]">
            <ImgStar className="size-[120px]" />

            <div className="absolute bottom-[11px] right-[4px] bg-inverse text-inverse px-[8px] py-[2px] rounded-full">
              x1000
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <DialogTitle className="typo-h4 text-center">
            {t('profile.invite_reward_dialog.welcome')} {t('profile.invite_reward_dialog.name', { name: userName })}
          </DialogTitle>
          <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
            {t('profile.invite_reward_dialog.special_reward_message1')} <br />
            {t('profile.invite_reward_dialog.star_unit')}{' '}
            <Text as={'span'} typo="subtitle-2-medium" color="accent">
              {t('profile.invite_reward_dialog.star_count', { count: 1000 })}
            </Text>
            {t('profile.invite_reward_dialog.special_reward_message2')}
          </DialogDescription>
        </div>
      </div>

      <Button onClick={handleReward} className="w-full">
        {t('profile.inviter_reward_dialog.receive_button')}
      </Button>
    </DialogContent>
  )
}
