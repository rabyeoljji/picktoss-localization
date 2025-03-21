export const RoutePath = {
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
} as const

/** @important
 * pathname, search, hash 등의 타입 정의
 */
export type RouteConfig = {
  // Root
  [RoutePath.root]: { pathname: typeof RoutePath.root }
  // Auth
  [RoutePath.login]: { pathname: typeof RoutePath.login }
  [RoutePath.installGuide]: { pathname: typeof RoutePath.installGuide }
  // 노트 관련
  [RoutePath.notes]: { pathname: typeof RoutePath.notes }
  [RoutePath.noteDetail]: { pathname: typeof RoutePath.noteDetail }
  [RoutePath.noteQuiz]: { pathname: typeof RoutePath.noteQuiz }
  [RoutePath.noteArrange]: { pathname: typeof RoutePath.noteArrange }
  [RoutePath.noteSearch]: { pathname: typeof RoutePath.noteSearch }
  [RoutePath.noteEdit]: { pathname: typeof RoutePath.noteEdit }
  [RoutePath.noteWrite]: { pathname: typeof RoutePath.noteWrite }
  [RoutePath.noteUpload]: { pathname: typeof RoutePath.noteUpload }
  // 마이 페이지 관련
  [RoutePath.account]: { pathname: typeof RoutePath.account }
  [RoutePath.accountInfo]: { pathname: typeof RoutePath.accountInfo }
  [RoutePath.dailyQuizAttendance]: { pathname: typeof RoutePath.dailyQuizAttendance }
  [RoutePath.quizAnalysis]: { pathname: typeof RoutePath.quizAnalysis }
  [RoutePath.quizRecord]: { pathname: typeof RoutePath.quizRecord }
  [RoutePath.notificationConfig]: { pathname: typeof RoutePath.notificationConfig }
  [RoutePath.paymentHistory]: { pathname: typeof RoutePath.paymentHistory }
  [RoutePath.notice]: { pathname: typeof RoutePath.notice }
  [RoutePath.contact]: { pathname: typeof RoutePath.contact }
  [RoutePath.faq]: { pathname: typeof RoutePath.faq }
  [RoutePath.policy]: { pathname: typeof RoutePath.policy }
  [RoutePath.withdraw]: { pathname: typeof RoutePath.withdraw }
  // 테마 퀴즈
  [RoutePath.randomQuiz]: {
    pathname: typeof RoutePath.randomQuiz
    search: {
      date: string
    }
  }
  [RoutePath.bombQuiz]: {
    pathname: typeof RoutePath.bombQuiz
    search: { date: string }
  }
  // 컬렉션 관련
  [RoutePath.collections]: { pathname: typeof RoutePath.collections }
  [RoutePath.collectionDetail]: { pathname: typeof RoutePath.collectionDetail }
  [RoutePath.collectionQuiz]: { pathname: typeof RoutePath.collectionQuiz }
  [RoutePath.collectionComplain]: { pathname: typeof RoutePath.collectionComplain }
  [RoutePath.collectionCreate]: { pathname: typeof RoutePath.collectionCreate }
  [RoutePath.collectionEditInfo]: { pathname: typeof RoutePath.collectionEditInfo }
  [RoutePath.collectionEditQuiz]: { pathname: typeof RoutePath.collectionEditQuiz }
  [RoutePath.collectionSearch]: { pathname: typeof RoutePath.collectionSearch }
}
