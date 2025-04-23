import { useState } from 'react'

import { initializeFirebaseMessaging } from '@/../firebase'

import { useAuthStore } from '@/features/auth'

import { useSaveFcmToken } from '@/entities/fcm/api/hooks'

import { getFCMToken } from '@/shared/firebase/messaging/get-token'
import { useServiceWorker } from '@/shared/firebase/messaging/use-service-worker'
import { usePWA } from '@/shared/hooks/use-pwa'
import { requestNotificationPermission } from '@/shared/lib/notification'

export const useMessaging = () => {
  const { token } = useAuthStore()
  const { mutate: saveFcmToken } = useSaveFcmToken()
  const { isPWA } = usePWA()
  const [isReadyNotification, setIsReadyNotification] = useState(false)

  useServiceWorker()

  const setupMessaging = async () => {
    try {
      const isBrowser = typeof window !== 'undefined'
      const isGranted = Notification.permission === 'granted'

      if (!isBrowser) return

      // 알림 권한 요청
      if (isPWA) {
        try {
          await requestNotificationPermission()
        } catch (error) {
          console.error('Notification permission request failed:', error)
          return
        } finally {
          window.location.reload()
        }
      }

      // 로그인 상태(토큰 여부)고, 알림 허용 상태일 때만 진행
      if (!token || !isGranted) {
        return
      }

      const messaging = await initializeFirebaseMessaging()

      if (!messaging) {
        console.error('Failed to initialize Firebase messaging')
        return
      }

      // Get and process FCM token
      if (isPWA) {
        const token = await getFCMToken()
        if (token) {
          saveFcmToken({ data: { fcmToken: token } })
        }
      }

      setIsReadyNotification(true)
    } catch (error) {
      console.error('Messaging setup failed:', error)
    }
  }

  return { isReadyNotification, setupMessaging }
}
