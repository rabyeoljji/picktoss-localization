import InviteDrawer from '@/features/invite/ui/invite-drawer'

import { useUser } from '@/entities/member/api/hooks'

import { ImgInviteStar, ImgStarEmpty } from '@/shared/assets/images'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useTranslation } from '@/shared/locales/use-translation'

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
  const { t } = useTranslation()
  const { data: user } = useUser()

  const myStars = Number(user?.star)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent height="lg">
        <div className="flex flex-col gap-4 text-center">
          <ImgStarEmpty className="size-[100px] mx-auto" />
          <Text typo="h4">{t('createQuiz.lacking_star_drawer.title')}</Text>
          <Text typo="body-1-medium" color="sub">
            {t('createQuiz.lacking_star_drawer.description')}
            <br />
            {t('createQuiz.lacking_star_drawer.earn_method1')},
            <br />
            {t('createQuiz.lacking_star_drawer.earn_method2')}
          </Text>
        </div>
        <div className="mt-[24px] flex items-center justify-around">
          <div className="flex flex-col items-center gap-[2px]">
            <Text typo="body-2-medium" color="sub">
              {t('createQuiz.lacking_star_drawer.required_stars')}
            </Text>
            <Text typo="subtitle-1-bold">{needStars}</Text>
          </div>
          <div className="w-[1px] h-[48px] bg-gray-100" />
          <div className="flex flex-col items-center gap-[2px]">
            <Text typo="body-2-medium" color="sub">
              {t('createQuiz.lacking_star_drawer.owned_stars')}
            </Text>
            <Text typo="subtitle-1-bold">{myStars}</Text>
          </div>
          <div className="w-[1px] h-[48px] bg-gray-100" />
          <div className="flex flex-col items-center gap-[2px]">
            <Text typo="body-2-medium" color="sub">
              {t('createQuiz.lacking_star_drawer.missing_stars')}
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
                    {t('createQuiz.lacking_star_drawer.invite_title')}
                  </Text>
                  <Text typo="subtitle-1-bold">
                    {t('createQuiz.lacking_star_drawer.invite_description')}{' '}
                    <Text as={'span'} typo="subtitle-1-bold" color="accent">
                      {t('createQuiz.lacking_star_drawer.invite_reward')}
                    </Text>{' '}
                    {t('createQuiz.lacking_star_drawer.invite_receive')}!
                  </Text>
                </div>
                <ImgInviteStar width={56} height={56} />
              </div>
            }
          />
        </div>
        <DialogFooter className="h-[114px] absolute bottom-0 w-[calc(100%-32px)]">
          <DialogClose asChild>
            <Button className="mt-[14px]">{t('common.confirm')}</Button>
          </DialogClose>
        </DialogFooter>
      </DrawerContent>
    </Drawer>
  )
}
