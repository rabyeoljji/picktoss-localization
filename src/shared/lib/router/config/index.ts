/** @important
 * pathname, search, hash 등의 타입 정의
 */
export type RouteConfig = {
  // Root
  root: { pathname: '/' }
  // Auth
  login: { pathname: '/login' }
  installGuide: { pathname: '/install-guide' }
  // 노트 관련
  notes: { pathname: '/note' }
  noteDetail: { pathname: '/note/:noteId' }
  noteQuiz: { pathname: '/note/quiz/:noteId' }
  noteArrange: { pathname: '/note/arrange/:directoryId' }
  noteSearch: { pathname: '/note/search' }
  noteEdit: { pathname: '/note/edit/:noteId' }
  noteWrite: { pathname: '/note/write' }
  noteUpload: { pathname: '/note/upload' }
  // 마이 페이지 관련
  account: { pathname: '/account' }
  accountInfo: { pathname: '/account/info' }
  dailyQuizAttendance: { pathname: '/account/daily-quiz-attendance' }
  quizAnalysis: { pathname: '/account/quiz-analysis' }
  quizRecord: { pathname: '/account/quiz-record' }
  notificationConfig: { pathname: '/account/notification-config' }
  paymentHistory: { pathname: '/account/payment-history' }
  notice: { pathname: '/account/notice' }
  contact: { pathname: '/account/contact' }
  faq: { pathname: '/account/faq' }
  policy: { pathname: '/account/policy' }
  withdraw: { pathname: '/account/withdraw' }
  // 테마 퀴즈
  randomQuiz: { pathname: '/random-quiz' }
  bombQuiz: { pathname: '/bomb-quiz' }
  // 컬렉션 관련
  collections: { pathname: '/collection' }
  collectionDetail: { pathname: '/collection/:collectionId' }
  collectionQuiz: { pathname: '/collection/quiz/:collectionId' }
  collectionComplain: { pathname: '/collection/complain/:collectionId' }
  collectionCreate: { pathname: '/collection/create' }
  collectionEditInfo: { pathname: '/collection/edit/info/:collectionId' }
  collectionEditQuiz: { pathname: '/collection/edit/quiz/:collectionId' }
  collectionSearch: { pathname: '/collection/search' }
}

export const RoutePath: Record<keyof RouteConfig, RouteConfig[keyof RouteConfig]['pathname']> = {
  // Root
  root: '/',
  // Auth
  login: '/login',
  installGuide: '/install-guide',
  // 노트 관련
  notes: '/note',
  noteDetail: '/note/:noteId',
  noteQuiz: '/note/quiz/:noteId',
  noteArrange: '/note/arrange/:directoryId',
  noteSearch: '/note/search',
  noteEdit: '/note/edit/:noteId',
  noteWrite: '/note/write',
  noteUpload: '/note/upload',
  // 마이 페이지 관련
  account: '/account',
  accountInfo: '/account/info',
  dailyQuizAttendance: '/account/daily-quiz-attendance',
  quizAnalysis: '/account/quiz-analysis',
  quizRecord: '/account/quiz-record',
  notificationConfig: '/account/notification-config',
  paymentHistory: '/account/payment-history',
  notice: '/account/notice',
  contact: '/account/contact',
  faq: '/account/faq',
  policy: '/account/policy',
  withdraw: '/account/withdraw',
  // 테마 퀴즈
  randomQuiz: '/random-quiz',
  bombQuiz: '/bomb-quiz',
  // 컬렉션 관련
  collections: '/collection',
  collectionDetail: '/collection/:collectionId',
  collectionQuiz: '/collection/quiz/:collectionId',
  collectionComplain: '/collection/complain/:collectionId',
  collectionCreate: '/collection/create',
  collectionEditInfo: '/collection/edit/info/:collectionId',
  collectionEditQuiz: '/collection/edit/quiz/:collectionId',
  collectionSearch: '/collection/search',
}
