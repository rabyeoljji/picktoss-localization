import { createKey } from '@/shared/api/lib/create-key'

const FCM = 'fcm'

export const FCM_ENDPOINTS = {
  postToken: () => '/tokens',
}

export const FCM_KEYS = {
  postToken: createKey(FCM, FCM_ENDPOINTS.postToken()),
}
