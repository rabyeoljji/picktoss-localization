import { useQuery } from '@tanstack/react-query'

import { NOTIFICATION_KEYS } from './config'
import { getNotificationByNotificationKey, getNotifications } from './index'

export const useGetNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.getNotifications,
    queryFn: () => getNotifications(),
  })
}

export const useGetNotificationByKey = (notificationKey: string) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.getNotificationByKey(notificationKey),
    queryFn: () => getNotificationByNotificationKey(notificationKey),
  })
}
