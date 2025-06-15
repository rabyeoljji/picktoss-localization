import { useQueryClient } from '@tanstack/react-query'

import { MEMBER_KEYS } from '@/entities/member/api/config'

import { ImgStar } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Text } from '@/shared/components/ui/text'

const RewardDialogForInviter = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const queryClient = useQueryClient()

  const handleReward = () => {
    // TODO: 서버에 상태 변경 요청
    queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    onOpenChange(false)
  }

  return (
    <Dialog open={false} onOpenChange={onOpenChange}>
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
            <DialogTitle className="typo-h4 text-center">친구 초대 보상 도착</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              초대해주신 픽토스님께 <br />
              보상으로 별{' '}
              <Text as={'span'} typo="subtitle-2-medium" color="accent">
                50개
              </Text>
              를 드려요
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

export default RewardDialogForInviter
