import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const NOTIFICATION = 'notification'

export const NOTIFICATION_ENDPOINTS = {
  getNotifications: () => '/notifications',
  getNotificationByKey: (notificationKey: string) => `/api/v2/notifications/${notificationKey}/check`,
}

export const NOTIFICATION_KEYS = {
  getNotifications: originalCreateKey(NOTIFICATION, NOTIFICATION_ENDPOINTS.getNotifications()),
  getNotificationByKey: (notificationKey: string) =>
    originalCreateKey(NOTIFICATION, NOTIFICATION_ENDPOINTS.getNotificationByKey(notificationKey)),
}
