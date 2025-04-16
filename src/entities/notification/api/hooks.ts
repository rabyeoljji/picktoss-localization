import { useQuery } from '@tanstack/react-query'

import { NOTIFICATION_KEYS } from './config'
import { getAllNotifications, getNotificationByNotificationKey } from './index'

export const useGetNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.getAllNotifications,
    queryFn: () => getAllNotifications(),
  })
}

export const useGetNotificationByKey = (notificationKey: string) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.getNotificationByKey(notificationKey),
    queryFn: () => getNotificationByNotificationKey(notificationKey),
  })
}
