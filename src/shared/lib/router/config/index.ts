/**
 * 애플리케이션의 모든 경로 문자열을 상수로 정의
 *
 * 라우팅 시스템에서 경로 문자열을 하드코딩하는 대신 이 객체를 참조
 * 코드 전체에서 경로 일관성을 유지하고 변경 시 단일 지점에서 관리
 *
 * @example
 * // 다음과 같이 사용
 * <Link to={RoutePath.account}>계정</Link>
 * router.push(RoutePath.login)
 */
export const RoutePath = {
  /** 메인 홈 화면 */
  root: '/',
  search: '/search',

  /** 로그인 페이지 */
  login: '/login',

  /** 설치 가이드 페이지 */
  installGuide: '/install-guide',

  /** 노트 관련 페이지 */
  note: '/note',
  noteDetail: '/note/:noteId',
  noteQuiz: '/note/quiz/:noteId',
  noteArrange: '/note/arrange/:directoryId',
  noteSearch: '/note/search',
  noteEdit: '/note/edit/:noteId',
  noteCreate: '/note/create',
  noteUpload: '/note/upload',

  /** 계정 관련 페이지 */
  account: '/account',
  accountInfo: '/account/info',
  accountDailyQuizAttendance: '/account/daily-quiz-attendance',
  accountQuizAnalysis: '/account/quiz-analysis',
  accountQuizRecord: '/account/quiz-record',
  accountNotificationConfig: '/account/notification-config',
  accountPaymentHistory: '/account/payment-history',
  accountNotice: '/account/notice',
  accountContact: '/account/contact',
  accountFaq: '/account/faq',
  accountPolicy: '/account/policy',
  accountWithdraw: '/account/withdraw',
  accountFeedback: '/account/feedback',
  accountFeedbackComplete: '/account/feedback/complete',

  /** 퀴즈 관련 페이지 */
  progressQuiz: '/progress-quiz/:quizId',
  randomQuiz: '/random-quiz',
  bombQuiz: '/bomb-quiz',

  /** 컬렉션 관련 페이지 */
  collection: '/collection',
  collectionDetail: '/collection/:collectionId',
  collectionQuiz: '/collection/quiz/:collectionId',
  collectionComplain: '/collection/complain/:collectionId',
  collectionCreate: '/collection/create',
  collectionEditInfo: '/collection/edit/info/:collectionId',
  collectionEditQuiz: '/collection/edit/quiz/:collectionId',
  collectionSearch: '/collection/search',
} as const

/**
 * 각 경로에 대한 검색 파라미터 타입을 정의
 * 경로를 키로 사용하여 일관된 구조 유지
 */
export const SearchConfig: Record<(typeof RoutePath)[keyof typeof RoutePath], unknown> = {
  '/': undefined,
  '/search': undefined,
  '/login': undefined,
  '/install-guide': undefined,
  '/note': undefined,
  '/note/:noteId': undefined,
  '/note/quiz/:noteId': undefined,
  '/note/arrange/:directoryId': undefined,
  '/note/search': undefined,
  '/note/edit/:noteId': undefined,
  '/note/create': undefined,
  '/note/upload': undefined,
  '/account': undefined,
  '/account/info': undefined,
  '/account/daily-quiz-attendance': undefined,
  '/account/quiz-analysis': undefined,
  '/account/quiz-record': undefined,
  '/account/notification-config': undefined,
  '/account/payment-history': undefined,
  '/account/notice': undefined,
  '/account/contact': undefined,
  '/account/faq': undefined,
  '/account/policy': undefined,
  '/account/withdraw': undefined,
  '/account/feedback': undefined,
  '/account/feedback/complete': undefined,
  '/progress-quiz/:quizId': {
    name: '유민' as '유민' | '정우',
    emoji: '',
    date: '',
  },
  '/random-quiz': {
    date: '',
  },
  '/bomb-quiz': {
    date: '',
  },
  '/collection': undefined,
  '/collection/:collectionId': undefined,
  '/collection/quiz/:collectionId': undefined,
  '/collection/complain/:collectionId': undefined,
  '/collection/create': undefined,
  '/collection/edit/info/:collectionId': undefined,
  '/collection/edit/quiz/:collectionId': undefined,
  '/collection/search': {
    query: '',
  },
}
