export const RoutePath = {
  // Root
  root: { pathname: '/' },
  // Auth
  login: { pathname: '/login' },
  installInduce: { pathname: '/install-induce' },
  // 노트 관련
  notes: { pathname: '/note' },
  noteDetail: { pathname: '/note/:noteId' },
  noteQuiz: { pathname: '/note/quiz/:noteId' },
  noteArrange: { pathname: '/note/arrange/:directoryId' },
  noteSearch: { pathname: '/note/search' },
  noteEdit: { pathname: '/note/edit/:noteId' },
  noteWrite: { pathname: '/note/write' },
  noteUpload: { pathname: '/note/upload' },
  // 마이 페이지 관련
  account: { pathname: '/account' },
  accountInfo: { pathname: '/account/info' },
  dailyQuizAttendance: { pathname: '/account/daily-quiz-attendance' },
  quizAnalysis: { pathname: '/account/quiz-analysis' },
  quizRecord: { pathname: '/account/quiz-record' },
  notificationConfig: { pathname: '/account/notification-config' },
  paymentHistory: { pathname: '/account/payment-history' },
  notice: { pathname: '/account/notice' },
  contact: { pathname: '/account/contact' },
  faq: { pathname: '/account/faq' },
  policy: { pathname: '/account/policy' },
  withdraw: { pathname: '/account/withdraw' },
  // 테마 퀴즈
  randomQuiz: { pathname: '/random-quiz' },
  bombQuiz: { pathname: '/bomb-quiz' },
  // 컬렉션 관련
  collections: { pathname: '/collection' },
  collectionDetail: { pathname: '/collection/:collectionId' },
  collectionQuiz: { pathname: '/collection/quiz/:collectionId' },
  collectionComplain: { pathname: '/collection/complain/:collectionId' },
  collectionCreate: { pathname: '/collection/create' },
  collectionEditInfo: { pathname: '/collection/edit/info/:collectionId' },
  collectionEditQuiz: { pathname: '/collection/edit/quiz/:collectionId' },
  collectionSearch: { pathname: '/collection/search' },
} as const
