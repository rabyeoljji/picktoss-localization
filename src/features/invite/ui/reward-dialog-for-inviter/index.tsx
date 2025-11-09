import { useQueryClient } from '@tanstack/react-query'

import { useConfirmInviteCodeBySignUp } from '@/entities/auth/api/hooks'
import { MEMBER_KEYS } from '@/entities/member/api/config'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'
import { useTranslation } from '@/shared/locales/use-translation'

const RewardDialogForInviter = ({
  open,
  onOpenChange,
  userName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
}) => {
  const queryClient = useQueryClient()
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
            <DialogTitle className="typo-h4 text-center">{t('profile.inviter_reward_dialog.title')}</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              {t('profile.inviter_reward_dialog.invite_reward_message1')}{' '}
              {t('profile.invite_reward_dialog.dear_name', { name: userName })} <br />
              {t('profile.inviter_reward_dialog.invite_reward_message2')} {t('profile.invite_reward_dialog.star_unit')}{' '}
              <Text as={'span'} typo="subtitle-2-medium" color="accent">
                {t('profile.invite_reward_dialog.star_count', { count: 50 })}
              </Text>
              {t('profile.inviter_reward_dialog.invite_reward_message3')}
            </DialogDescription>
          </div>
        </div>

        <Button onClick={handleReward} className="w-full">
          {t('profile.inviter_reward_dialog.receive_button')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default RewardDialogForInviter
