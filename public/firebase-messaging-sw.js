importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBwmQsAZwnGr8Ah43wjG5EzPQnyAymYzj8',
  authDomain: 'picktoss-6b0e1.firebaseapp.com',
  projectId: 'picktoss-6b0e1',
  storageBucket: 'picktoss-6b0e1.firebasestorage.app',
  messagingSenderId: '456784018307',
  appId: '1:456784018307:web:5559778b3a422968ea54b6',
  measurementId: 'G-7TB5Q9HVQS',
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// messaging.onBackgroundMessage(() => {
//   console.log('백그라운드 메시지 수신')
// })

// ✅ from picktoss 제거를 위한 수동 알림 표시
self.addEventListener('push', function (event) {
  if (event?.data) {
    const payload = event.data.json()

    const title = payload.title || '픽토스 알림입니다'
    const options = {
      body: payload.content,
      icon: '/favicon/apple-touch-icon.png',
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
    )
  }
})