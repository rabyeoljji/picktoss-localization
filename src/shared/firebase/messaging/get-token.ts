import { initializeFirebaseMessaging } from '@/../firebase'
import { getToken as getMessagingToken } from 'firebase/messaging'

export const getFCMToken = async (): Promise<string | null> => {
  const messaging = await initializeFirebaseMessaging()

  if (messaging) {
    try {
      const token = await getMessagingToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      })

      if (token) {
        console.log(token)
        return token
      } else {
        console.warn('FCM 토큰 없음.')
        return null
      }
    } catch (error) {
      console.error('FCM 토큰 가져오기 오류:', error)
      return null
    }
  } else return null
}
