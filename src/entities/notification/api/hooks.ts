import { useQuery } from "@tanstack/react-query"
import { getNotifications, getNotificationByNotificationKey } from "./index"
import { NOTIFICATION_KEYS } from "./config"

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
