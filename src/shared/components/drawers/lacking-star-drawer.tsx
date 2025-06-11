import InviteDrawer from '@/features/invite/ui/invite-drawer'

import { useUser } from '@/entities/member/api/hooks'

import { ImgInviteStar, ImgStarEmpty } from '@/shared/assets/images'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'

import { Button } from '../ui/button'
import { DialogClose, DialogFooter } from '../ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer'
import { Text } from '../ui/text'

interface LackingStarDrawerProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  needStars: number
}

export const LackingStarDrawer = ({ trigger, open, onOpenChange, needStars }: LackingStarDrawerProps) => {
  const { trackEvent } = useAmplitude()
  const { data: user } = useUser()

  const myStars = Number(user?.star)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent height="lg">
        <div className="flex flex-col gap-4 text-center">
          <ImgStarEmpty className="size-[100px] mx-auto" />
          <Text typo="h4">별이 부족해요</Text>
          <Text typo="body-1-medium" color="sub">
            퀴즈를 생성할 때 사용되는 별이 더 필요해요
            <br />
            하루에 데일리 퀴즈를 10문제 이상 풀거나,
            <br />
            픽토스에 친구를 초대하면 별을 더 받을 수 있어요
          </Text>
        </div>
        <div className="mt-[24px] flex items-center justify-around">
          <div className="flex flex-col items-center gap-[2px]">
            <Text typo="body-2-medium" color="sub">
              필요한 별
            </Text>
            <Text typo="subtitle-1-bold">{needStars}</Text>
          </div>
          <div className="w-[1px] h-[48px] bg-gray-100" />
          <div className="flex flex-col items-center gap-[2px]">
            <Text typo="body-2-medium" color="sub">
              보유한 별
            </Text>
            <Text typo="subtitle-1-bold">{myStars}</Text>
          </div>
          <div className="w-[1px] h-[48px] bg-gray-100" />
          <div className="flex flex-col items-center gap-[2px]">
            <Text typo="body-2-medium" color="sub">
              부족한 별
            </Text>
            <Text typo="subtitle-1-bold" color="accent">
              {needStars - myStars}
            </Text>
          </div>
        </div>
        <div className="mt-[32px]">
          <InviteDrawer
            triggerComponent={
              <div
                className="bg-accent rounded-[12px] py-[16px] px-[24px] flex items-center justify-between"
                onClick={() => {
                  trackEvent('invite_view', { location: '별 부족 drawer' })
                }}
              >
                <div className="flex flex-col gap-[4px]">
                  <Text typo="body-1-medium" color="secondary">
                    픽토스 초대장 보내기
                  </Text>
                  <Text typo="subtitle-1-bold">
                    초대할 때마다{' '}
                    <Text as={'span'} typo="subtitle-1-bold" color="accent">
                      별 50개
                    </Text>{' '}
                    받아요!
                  </Text>
                </div>
                <ImgInviteStar width={56} height={56} />
              </div>
            }
          />
        </div>
        <DialogFooter className="h-[114px] absolute bottom-0 w-[calc(100%-32px)]">
          <DialogClose asChild>
            <Button className="mt-[14px]">확인</Button>
          </DialogClose>
        </DialogFooter>
      </DrawerContent>
    </Drawer>
  )
}
