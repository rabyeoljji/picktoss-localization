import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const FCM = 'fcm'

export const FCM_ENDPOINTS = {
  postToken: () => '/tokens',
  postSendMessage: () => '/send',
}

export const FCM_KEYS = {
  postToken: originalCreateKey(FCM, FCM_ENDPOINTS.postToken()),
  postSendMessage: originalCreateKey(FCM, FCM_ENDPOINTS.postSendMessage()),
}
