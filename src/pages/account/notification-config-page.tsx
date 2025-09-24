import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

// import { useGetNotifications } from '@/entities/notification/api/hooks'

import { ImgMegaphoneEmpty } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
// import NotificationItem from '@/shared/components/items/notification-item'
import { Text } from '@/shared/components/ui/text'
import { useTranslation } from '@/shared/locales/use-translation'

const NotificationConfigPage = () => {
  // const { data, isLoading } = useGetNotifications()
  const { t } = useTranslation()

  return (
    <>
      <Header left={<BackButton />} title={t('profile.notification_config_page.header')} className="px-[8px]" />

      <HeaderOffsetLayout className="px-[16px] h-full">
        <EmptyNotification />

        {/* {isLoading && <div className="size-full flex-center">is Loading...</div>}

        {!data?.notifications || data.notifications.length === 0 ? (
          <EmptyNotification />
        ) : (
          <>
            {data.notifications.map((notification, index) => (
              <NotificationItem
                key={notification.notificationKey}
                type={notification.notificationType}
                title={notification.title}
                receivedTime={notification.receivedTime}
                lastItem={index === data.notifications.length - 1}
              />
            ))}
            <Text typo="body-2-medium" color="caption" className="py-[20px] text-center">
              최근 14일 동안 받은 알림을 모두 확인했어요
            </Text>
          </>
        )} */}
      </HeaderOffsetLayout>
    </>
  )
}

const EmptyNotification = () => {
  const { t } = useTranslation()
  return (
    <div className="flex-center size-full flex-col gap-[16px] pb-[107px]">
      <ImgMegaphoneEmpty width={120} height={120} />
      <Text typo="body-1-medium" color="sub">
        {t('profile.notification_config_page.no_notifications')}
      </Text>
    </div>
  )
}

export default withHOC(NotificationConfigPage, {
  backgroundClassName: 'bg-surface-1',
})
