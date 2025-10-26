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
      try {
        // 권한 설정을 한 적 없을 경우 권한 요청 drawer open
        if (!checkNotificationPermission()) {
          setOpenNotificationPermission(true)
          return
        }

        // 이전에 거부한 적이 있다면 운영체제나 브라우저 설정에서 먼저 변경할 수 있도록 유도
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied') {
          setOpenNotificationSettingInfo(true)
          setNotificationEnabled(false)
          return
        }
      } catch (error) {
        console.error('Notification permission check failed:', error)
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

    try {
      // os 알림 권한 설정 자체가 거부되어있으면 서버와도 동기화
      const isNotificationDenied =
        typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied'
      if ((isNotificationDenied || !checkNotificationPermission()) && user?.quizNotificationEnabled) {
        setNotificationEnabled(false)
        updateNotification({ quizNotificationEnabled: false })
      }
    } catch (error) {
      console.error('Notification permission sync failed:', error)
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
                  {t('profile.main_page.created_quiz')}
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
                  {t('profile.main_page.saved_quiz')}
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
                      {t('profile.main_page.this_month_solved_quiz')}
                    </Text>
                    <Text typo="subtitle-1-bold">
                      {t('profile.main_page.problem_count', { count: user?.monthlySolvedQuizCount })}
                    </Text>
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
                  {t('profile.main_page.view_analysis')}
                </Button>
              </div>

              <div className="flex flex-col gap-[21px] border border-outline rounded-[12px] p-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4px]">
                    <ImgStar width={24} height={24} />
                    <Text typo="subtitle-2-bold">{t('profile.main_page.my_star')}</Text>
                    <Disclaimer>
                      <DisclaimerTrigger asChild className="cursor-pointer">
                        <IcDisclaimer className="size-[16px] text-icon-sub" />
                      </DisclaimerTrigger>
                      <DisclaimerContent side="bottom" sideOffset={7} align="start" alignOffset={-7}>
                        {t('profile.main_page.star_description1')} <br />
                        {t('profile.main_page.star_description2')} <br />
                        {t('profile.main_page.star_description3')}
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
                    <Text typo="subtitle-2-bold">{t('profile.main_page.star_count', { count: user?.star })}</Text>
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
                          {t('profile.main_page.send_invitation')}
                        </Text>
                        <Text typo="subtitle-1-bold">
                          {t('profile.main_page.every_invitation')}{' '}
                          <Text as={'span'} typo="subtitle-1-bold" color="accent">
                            {t('profile.main_page.star_50')}
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
              {t('profile.main_page.settings')}
            </Text>
            <div className="flex flex-col gap-[20px]">
              <Link to="/account/info" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.main_page.account_info')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              {/* 언어 변경 옵션, 추후 필요시 고려 */}
              {/* <Link to="/account/language" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.main_page.language')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link> */}

              <div className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.main_page.push_notification')}</Text>
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
              {t('profile.main_page.help_support')}
            </Text>
            <div className="flex flex-col gap-[20px]">
              <Link to="/account/feedback" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.feedback_form.inquiry_title')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <a
                href="https://picktoss.notion.site/1209d818f5608088a977c9ee5f70061f"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <Text typo="subtitle-2-medium">{t('profile.main_page.usage_guide')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </a>

              <Link to="/account/notice" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">{t('profile.main_page.notice')}</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <a
                href="https://picktoss.framer.website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <Text typo="subtitle-2-medium">{t('profile.main_page.service_introduction')}</Text>
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
                {t('profile.main_page.privacy_policy')}
              </Text>
            </a>
            <a
              href="https://picktoss.notion.site/1209d818f560809aad11c5b64020d735"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text typo="body-1-medium" color="sub">
                {t('profile.main_page.terms_of_service')}
              </Text>
            </a>
          </div>

          <div className="flex flex-col gap-[16px]">
            <Text typo="body-2-medium" color="caption">
              {t('profile.main_page.company_info')}
            </Text>
            <Text typo="body-2-medium" color="caption">
              {t('profile.main_page.copyright')}
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
            {t('profile.main_page.push_notification_guide')}
          </Text>
          <Text typo="subtitle-2-medium" color="sub" className="text-center">
            {t('profile.main_page.notification_permission_message1')} <br />
            {t('profile.main_page.notification_permission_message2')}
          </Text>
        </DrawerHeader>

        <ImgPush height={200} width={301.25} />

        <DrawerFooter className="w-full pt-[14px] px-[20px] h-[90px] flex flex-col">
          <Button onClick={clickNotification}>{t('profile.main_page.setup_button')}</Button>
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
            <DialogTitle className="typo-h4 text-center">
              {t('profile.main_page.push_notification_setting_guide')}
            </DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              {t('profile.main_page.notification_restart_message1')} <br />
              {t('profile.main_page.notification_restart_message2')} <br />
              {t('profile.main_page.notification_restart_message3')}
            </DialogDescription>
          </div>
        </div>

        <div className="w-full flex flex-col gap-[24px]">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            {t('common.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
