import { client } from '@/shared/lib/axios/client'

import { FCM_ENDPOINTS } from './config'

// Fcm token 저장 요청
interface SaveFcmTokenRequest {
  fcmToken: string
}

export const saveFcmToken = async ({ data }: { data: SaveFcmTokenRequest }): Promise<void> => {
  const response = await client.post<void>(FCM_ENDPOINTS.postToken(), data)
  return response.data
}

// 테스트 알림 푸시 요청
interface FcmSendDto {
  token: string
  title: string
  body: string
}

export const sendFcmMessage = async ({ data }: { data: FcmSendDto }): Promise<number> => {
  const response = await client.post<number>(FCM_ENDPOINTS.postSendMessage(), data)
  return response.data
}
