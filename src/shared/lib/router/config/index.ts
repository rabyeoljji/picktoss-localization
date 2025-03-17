export const RoutePath = {
  // Root
  root: '/',
  // Auth
  login: '/login',
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
} as const

/** @deprecated */
export const AppRoutes = {
  // Root
  root: '/',
  // Auth
  login: '/login',
  // 노트 관련
  notes: () => '/note',
  noteDetail: (noteId: string = ':noteId') => `/note/${noteId}`,
  noteQuiz: (noteId: string = ':noteId') => `/note/quiz/${noteId}`,
  noteArrange: (directoryId: string = ':directoryId') => `/note/arrange/${directoryId}`,
  noteSearch: '/note/search',
  noteEdit: (noteId: string = ':noteId') => `/note/edit/${noteId}`,
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
  collectionDetail: (collectionId: string = ':collectionId') => `/collection/${collectionId}`,
  collectionQuiz: (collectionId: string = ':collectionId') => `/collection/quiz/${collectionId}`,
  collectionComplain: (collectionId: string = ':collectionId') => `/collection/complain/${collectionId}`,
  collectionCreate: '/collection/create',
  collectionEditInfo: (collectionId: string = ':collectionId') => `/collection/edit/info/${collectionId}`,
  collectionEditQuiz: (collectionId: string = ':collectionId') => `/collection/edit/quiz/${collectionId}`,
  collectionSearch: '/collection/search',
} as const
