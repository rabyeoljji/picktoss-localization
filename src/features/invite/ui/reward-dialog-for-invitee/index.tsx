import { useRewardForInviteCode } from '@/entities/auth/api/hooks'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'
import { removeLocalStorageItem } from '@/shared/lib/storage/lib'

const RewardDialogForInvitee = ({
  open,
  onOpenChange,
  inviteCode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  inviteCode: string
}) => {
  const { mutate: rewardForInviteCode } = useRewardForInviteCode()

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
            <DialogTitle className="typo-h4 text-center">추가 별 지급</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              초대장을 받으신 픽토스님께 <br />별{' '}
              <Text as={'span'} typo="subtitle-2-medium" color="accent">
                50개
              </Text>
              를 추가로 드려요
            </DialogDescription>
          </div>
        </div>

        <Button onClick={handleReward} className="w-full">
          받기
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default RewardDialogForInvitee
