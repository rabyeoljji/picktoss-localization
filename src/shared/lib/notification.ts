/** 알림 권한 허용 체크 */
// export const checkNotificationPermission = () => {
//   // 이미 권한 선택을 한 경우
//   if (Notification.permission === 'granted' || Notification.permission === 'denied') {
//     return true
//   }
import { StorageKey } from '@/shared/lib/storage'

//   return false
// }
/** 알림 권한이 설정되었는지 확인 (iOS 대응) */
export const checkNotificationPermission = (): boolean => {
  return (
    Notification.permission !== 'default' || localStorage.getItem(StorageKey.notificationPermissionComplete) === 'true'
  )
}

/** 범용 알림 권한 요청 함수 (iOS 대응 포함) */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const isBrowser = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
    if (!isBrowser) {
      console.warn('브라우저 환경이 아님')
      return false
    }

    // 1. 현재 알림 권한 상태 확인
    if (Notification.permission === 'default') {
      console.log('알림 권한 요청 시도')
      const permission = await Notification.requestPermission()
      console.log(`Notification.permission 요청 결과: ${permission}`)

      if (permission !== 'granted') {
        console.warn('사용자가 알림 권한을 거부했습니다.')
        return false
      }

      localStorage.setItem(StorageKey.notificationPermissionComplete, 'true')
    } else if (Notification.permission === 'denied') {
      console.warn('이미 알림 권한이 차단된 상태입니다.')
      return false
    }

    // 2. 서비스 워커 등록 상태 확인
    const registration = await navigator.serviceWorker.ready
    if (!registration) {
      console.error('Service Worker 등록 실패')
      return false
    }

    // 3. PushManager 권한 상태 추가 확인 (특히 iOS 대응)
    let pushPermissionState: PermissionState | undefined = undefined

    if ('pushManager' in registration) {
      // 만약 지원된다면 permission 요청
      if (pushPermissionState === 'denied') {
        console.warn('PushManager 권한 거부 상태입니다.')
        return false
      }

      try {
        const permissionResult = await registration.pushManager.permissionState({ userVisibleOnly: true })
        pushPermissionState = permissionResult
        localStorage.setItem(StorageKey.notificationPermissionComplete, 'true')
        console.log(`PushManager.permissionState 결과: ${pushPermissionState}`)
      } catch (error) {
        console.warn('PushManager.permissionState 조회 실패', error)
      }
    }

    // 4. 모든 권한이 OK라면 true 반환
    console.log('알림 권한이 허용되었습니다.')
    return true
  } catch (error) {
    console.error('알림 권한 요청 중 에러 발생', error)
    return false
  }
}

/** 안드로이드용 알림 권한 요청 함수 */
// export const requestNotificationPermission = async () => {
//   try {
//     // 다른 환경에서의 처리
//     if (Notification.permission === 'default') {
//       console.log('권한 요청 시도')

//       const permission = await Notification.requestPermission()

//       console.log(`권한 요청 결과: ${permission}`)
//       return permission === 'granted'
//     } else {
//       console.log(`이미 권한 설정됨: ${Notification.permission}`)
//       return Notification.permission === 'granted'
//     }
//   } catch (error) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     console.error(`권한 요청 실패: ${error as any}`)
//     return false
//   }
// }
