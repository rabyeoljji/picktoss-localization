import { createKey } from '@/shared/api/lib/create-key'

const NOTIFICATION = 'notification'

export const NOTIFICATION_ENDPOINTS = {
  getAllNotifications: () => '/notifications',
  getNotificationByKey: (notificationKey: string) => `/api/v2/notifications/${notificationKey}/check`,
}

export const NOTIFICATION_KEYS = {
  getAllNotifications: createKey(NOTIFICATION, NOTIFICATION_ENDPOINTS.getAllNotifications()),
  getNotificationByKey: (notificationKey: string) =>
    createKey(NOTIFICATION, NOTIFICATION_ENDPOINTS.getNotificationByKey(notificationKey)),
}
