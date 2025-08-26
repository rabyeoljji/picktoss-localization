import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import InviteDrawer from '@/features/invite/ui/invite-drawer'

import { useUpdateQuizNotification, useUser } from '@/entities/member/api/hooks'

import { IcChevronRight, IcDisclaimer, IcMy, IcNotification, IcRecord } from '@/shared/assets/icon'
import { ImgAlarm, ImgGraph, ImgInviteStar, ImgPush, ImgStar } from '@/shared/assets/images'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Disclaimer, DisclaimerContent, DisclaimerTrigger } from '@/shared/components/ui/disclaimer'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/shared/components/ui/drawer'
import { Switch } from '@/shared/components/ui/switch'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useMessaging } from '@/shared/hooks/use-messaging'
import { checkNotificationPermission } from '@/shared/lib/notification'
import { Link, useRouter } from '@/shared/lib/router'

const AccountPage = () => {
  const { t } = useTranslation()
  const { trackEvent } = useAmplitude()
  const router = useRouter()

  const { data: user } = useUser()
  const { mutate: updateNotification } = useUpdateQuizNotification()

  const [notificationEnabled, setNotificationEnabled] = useState(user?.quizNotificationEnabled)
  const [openNotificationPermission, setOpenNotificationPermission] = useState(false)
  const [openNotificationSettingInfo, setOpenNotificationSettingInfo] = useState(false)

  const handleServiceNotification = (permission: boolean) => {
    setNotificationEnabled(permission)
  }

  const handleNotification = async (checked: boolean) => {
    trackEvent('my_setting_push_click', { value: checked })
    setNotificationEnabled(checked)

    if (checked) {
      // 권한 설정을 한 적 없을 경우 권한 요청 drawer open
      if (!checkNotificationPermission()) {
        setOpenNotificationPermission(true)
        return
      }

      // 이전에 거부한 적이 있다면 운영체제나 브라우저 설정에서 먼저 변경할 수 있도록 유도
      if (Notification.permission === 'denied') {
        setOpenNotificationSettingInfo(true)
        setNotificationEnabled(false)
        return
      }
    }

    // 서버 업데이트 호출
    updateNotification(
      { quizNotificationEnabled: checked },
      {
        onError: () => setNotificationEnabled(!checked),
      },
    )
  }

  useEffect(() => {
    console.log(user?.quizNotificationEnabled)

    // os 알림 권한 설정 자체가 거부되어있으면 서버와도 동기화
    if ((Notification.permission === 'denied' || !checkNotificationPermission()) && user?.quizNotificationEnabled) {
      setNotificationEnabled(false)
      updateNotification({ quizNotificationEnabled: false })
    }

    setNotificationEnabled(user?.quizNotificationEnabled)
  }, [updateNotification, user?.quizNotificationEnabled])

  return (
    <>
      <Header
        right={
          <div className="flex items-center">
            <Link
              to="/account/quiz-record"
              type="button"
              className="size-[40px] flex-center"
              onClick={() => {
                trackEvent('my_history_click')
              }}
            >
              <IcRecord className="size-[24px]" />
            </Link>
            <Link to="/account/notification-config" type="button" className="size-[40px] flex-center">
              <IcNotification className="size-[24px]" />
            </Link>
          </div>
        }
      />

      <HeaderOffsetLayout className="h-full overflow-y-auto scrollbar-hide">
        <div className="px-[16px] pb-[36px] flex flex-col">
          <Link to="/account/info" className="flex items-center gap-[16px] py-[20px]">
            <div className="size-[72px] bg-base-3 rounded-full overflow-hidden flex-center shrink-0">
              {user?.image ? (
                <img src={user?.image} alt="" className="object-cover" />
              ) : (
                <IcMy className="size-[42px] text-icon-sub" />
              )}
            </div>

            <div className="w-[calc(100%-72px-16px)] flex flex-col gap-[4px]">
              <div className="w-full flex items-center gap-[8px]">
                <Text typo="subtitle-1-bold" className="min-w-[47px] max-w-[70%] truncate">
                  {user?.name}
                </Text>
                <Tag className="shrink-0" size={'md'}>
                  {user?.category.emoji} {user?.category.name}
                </Tag>
              </div>

              <Text typo="body-1-medium" color="sub">
                {user?.email}
              </Text>
            </div>
          </Link>

          <div className="flex flex-col gap-[24px]">
            <div className="bg-surface-2 rounded-[12px] flex items-center h-[56px]">
              <Link
                to="/library"
                search={{ tab: 'MY' }}
                className="flex-1/2 h-full px-[16px] py-[12px] flex-center gap-[8px] border-r border-divider"
              >
                <Text typo="subtitle-2-bold" color="secondary">
                  {t('profile.생성한_퀴즈')}
                </Text>
                <Text typo="subtitle-2-bold" color="accent">
                  {user?.totalQuizCount}
                </Text>
              </Link>
              <Link
                to="/library"
                search={{ tab: 'BOOKMARK' }}
                className="flex-1/2 h-full px-[16px] py-[12px] flex-center gap-[8px]"
              >
                <Text typo="subtitle-2-bold" color="secondary">
                  {t('profile.저장한_퀴즈')}
                </Text>
                <Text typo="subtitle-2-bold" color="accent">
                  {user?.bookmarkCount}
                </Text>
              </Link>
            </div>

            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between border border-outline rounded-[12px] h-[80px] py-[16px] px-[20px]">
                <div className="flex items-center gap-[12px]">
                  <ImgGraph width={40} height={40} />

                  <div className="flex flex-col">
                    <Text typo="body-2-medium" color="sub">
                      {t('profile.이번_달_푼_퀴즈')}
                    </Text>
                    <Text typo="subtitle-1-bold">{t('profile.문제', { count: user?.monthlySolvedQuizCount })}</Text>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    trackEvent('my_analysis_click')
                    router.push('/account/quiz-analysis')
                  }}
                  size={'sm'}
                  variant={'tertiary'}
                >
                  {t('profile.분석_보기')}
                </Button>
              </div>

              <div className="flex flex-col gap-[21px] border border-outline rounded-[12px] p-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4px]">
                    <ImgStar width={24} height={24} />
                    <Text typo="subtitle-2-bold">{t('profile.나의_별')}</Text>
                    <Disclaimer>
                      <DisclaimerTrigger asChild className="cursor-pointer">
                        <IcDisclaimer className="size-[16px] text-icon-sub" />
                      </DisclaimerTrigger>
                      <DisclaimerContent side="bottom" sideOffset={7} align="start" alignOffset={-7}>
                        {t('profile.퀴즈를_생성하기_위해_필요한_재화로_매일')} <br />
                        {t('profile.데일리에서_10문제_이상_풀거나_이벤트에')} <br />
                        {t('profile.참여하면_받을_수_있어요')}
                      </DisclaimerContent>
                    </Disclaimer>
                  </div>

                  <Link
                    to="/account/my-star"
                    type="button"
                    className="flex items-center gap-[4px]"
                    onClick={() => {
                      trackEvent('my_star_click')
                    }}
                  >
                    <Text typo="subtitle-2-bold">{t('profile.개', { count: user?.star })}</Text>
                    <IcChevronRight className="size-[16px] text-icon-sub" />
                  </Link>
                </div>

                <InviteDrawer
                  triggerComponent={
                    <div
                      className="bg-accent rounded-[8px] py-[16px] px-[24px] flex items-center gap-[16px]"
                      onClick={() => {
                        trackEvent('invite_view', { location: '마이 페이지' })
                      }}
                    >
                      <div className="flex-1 flex flex-col gap-[4px]">
                        <Text typo="body-1-medium" color="secondary">
                          {t('profile.픽토스_초대장_보내기')}
                        </Text>
                        <Text typo="subtitle-1-bold">
                          {t('profile.초대할_때마다')}{' '}
                          <Text as={'span'} typo="subtitle-1-bold" color="accent">
                            {t('profile.별_50개')}
                          </Text>
                        </Text>
                      </div>

                      <ImgInviteStar width={56} height={56} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-[8px] w-full bg-base-2"></div>

        <div className="py-[24px] px-[16px] flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[16px]">
            <Text typo="body-1-medium" color="caption">
              {t('profile.설정')}
            </Text>
            <div className="flex flex-col gap-[20px]">
              <Link to="/account/info" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.계정_정보')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <div className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.푸시_알림')}</Text>
                <Switch size="md" checked={notificationEnabled} onCheckedChange={handleNotification} />
              </div>

              {/* 알림 권한 요청 drawer */}
              <NotificationDrawer
                open={openNotificationPermission}
                onOpenChange={setOpenNotificationPermission}
                onServiceNotificationChange={handleServiceNotification}
              />

              {/* 알림 재설정 안내 dialog */}
              <NotificationSettingInfoDialog
                open={openNotificationSettingInfo}
                onOpenChange={setOpenNotificationSettingInfo}
              />
            </div>
          </div>

          <div className="border-t border-divider pt-[16px] flex flex-col gap-[16px]">
            <Text typo="body-1-medium" color="caption">
              {t('profile.도움말_지원')}
            </Text>
            <div className="flex flex-col gap-[20px]">
              <Link to="/account/feedback" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.문의하기')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <a
                href="https://picktoss.notion.site/1209d818f5608088a977c9ee5f70061f"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <Text typo="subtitle-2-medium">{t('profile.이용_가이드')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </a>

              <Link to="/account/notice" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.공지사항')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <a
                href="https://picktoss.framer.website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <Text typo="subtitle-2-medium">{t('profile.서비스_소개')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </a>
            </div>
          </div>
        </div>

        <footer className="bg-surface-2 pt-[24px] px-[16px] pb-[40px] flex flex-col gap-[20px]">
          <div className="flex items-center gap-[32px]">
            <a
              href="https://picktoss.notion.site/1209d818f56080fbb469e82def758e9c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text typo="body-1-medium" color="sub">
                {t('profile.개인정보_처리방침')}
              </Text>
            </a>
            <a
              href="https://picktoss.notion.site/1209d818f560809aad11c5b64020d735"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text typo="body-1-medium" color="sub">
                {t('profile.서비스_이용약관')}
              </Text>
            </a>
          </div>

          <div className="flex flex-col gap-[16px]">
            <Text typo="body-2-medium" color="caption">
              {t(
                'profile.사업자등록번호_120_20_02237_070_7954_1774_대표자명_이유민_서울특별시_서대문구_연희로41가길_5_B1층_D72호_홍은동',
              )}
            </Text>
            <Text typo="body-2-medium" color="caption">
              {t('profile.2024_picktoss_all_rights_reserved')}
            </Text>
          </div>
        </footer>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(AccountPage, {
  backgroundClassName: 'bg-surface-1',
  activeTab: 'MY',
})

const NotificationDrawer = ({
  open,
  onOpenChange,
  onServiceNotificationChange,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  onServiceNotificationChange: (value: boolean) => void
}) => {
  const { t } = useTranslation()
  const { setupMessaging, isReadyNotification } = useMessaging()
  const { mutate: updateNotification } = useUpdateQuizNotification()

  const clickNotification = async () => {
    const callbackAfterPermission = (permission?: boolean) => {
      onServiceNotificationChange(permission ?? false)
      updateNotification({ quizNotificationEnabled: permission ?? false })
      onOpenChange(false)
    }
    await setupMessaging(callbackAfterPermission)
  }

  useEffect(() => {
    console.log('알림 준비: ' + isReadyNotification)
  }, [isReadyNotification])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent height="md" hasHandle={false} className="flex flex-col items-center">
        <DrawerHeader className="w-full flex-center flex-col gap-[8px] py-[10px]">
          <Text typo="h4" className="text-center">
            {t('profile.푸시_알림_허용_안내')}
          </Text>
          <Text typo="subtitle-2-medium" color="sub" className="text-center">
            {t('profile.다음_단계에서_알림을_허용하시면')} <br />
            {t('profile.매일_잊지_않고_퀴즈를_풀_수_있어요')}
          </Text>
        </DrawerHeader>

        <ImgPush height={200} width={301.25} />

        <DrawerFooter className="w-full pt-[14px] px-[20px] h-[90px] flex flex-col">
          <Button onClick={clickNotification}>{t('profile.설정하기')}</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const NotificationSettingInfoDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]">
        <div className="w-full flex flex-col gap-[16px]">
          <div className="w-full flex-center">
            <ImgAlarm className="size-[120px]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <DialogTitle className="typo-h4 text-center">{t('profile.푸시_알림_설정_안내')}</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              {t('profile.퀴즈_알림을_다시_받아보고_싶다면')} <br />
              {t('profile.디바이스의_설정앱picktoss를_선택_후')} <br />
              {t('profile.알림을_허용으로_변경해주세요')}
            </DialogDescription>
          </div>
        </div>

        <div className="w-full flex flex-col gap-[24px]">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            {t('profile.확인')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
