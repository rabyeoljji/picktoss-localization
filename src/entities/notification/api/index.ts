import { client } from '@/shared/lib/axios/client'

import { NOTIFICATION_ENDPOINTS } from './config'

// GET: 모든 알림 조회
interface NotificationDto {
  notificationKey: string
  title: string
  content: string
  notificationType: 'GENERAL' | 'TODAY_QUIZ' | 'COLLECTION' | 'STAR_REWARD' | 'UPDATE_NEWS'
  receivedTime: string // ISO 문자열
}

interface GetAllNotificationsResponse {
  notifications: NotificationDto[]
}

export const getAllNotifications = async (): Promise<GetAllNotificationsResponse> => {
  const response = await client.get<GetAllNotificationsResponse>(NOTIFICATION_ENDPOINTS.getAllNotifications())
  return response.data
}

// GET: 특정 알림 확인 (notification_key 기반)
export const getNotificationByNotificationKey = async (notificationKey: string): Promise<void> => {
  const response = await client.get<void>(NOTIFICATION_ENDPOINTS.getNotificationByKey(notificationKey))
  return response.data
}
