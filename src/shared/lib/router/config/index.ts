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

  /** 로그인 페이지 */
  login: '/login',
  
  /** 설치 가이드 페이지 */
  installGuide: '/install-guide',
  
  /** 노트 관련 */
  notes: '/note',
  noteDetail: '/note/:noteId',
  noteQuiz: '/note/quiz/:noteId',
  noteArrange: '/note/arrange/:directoryId',
  noteSearch: '/note/search',
  noteEdit: '/note/edit/:noteId',
  noteWrite: '/note/write',
  noteUpload: '/note/upload',
  
  /** 계정 관련 */
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
  
  /** 테마 퀴즈 */
  randomQuiz: '/random-quiz',
  bombQuiz: '/bomb-quiz',
  
  /** 컬렉션 관련 */
  collections: '/collection',
  collectionDetail: '/collection/:collectionId',
  collectionQuiz: '/collection/quiz/:collectionId',
  collectionComplain: '/collection/complain/:collectionId',
  collectionCreate: '/collection/create',
  collectionEditInfo: '/collection/edit/info/:collectionId',
  collectionEditQuiz: '/collection/edit/quiz/:collectionId',
  collectionSearch: '/collection/search',
} as const

/**
 * 각 경로에 대한 구성 정보를 담은 타입
 *
 * 경로 문자열을 키로 사용하고, 해당 경로에 대한 세부 정보를 값으로 가짐
 * 경로가 파라미터를 포함하는 경우 pathname 속성에 그대로 반영됨
 * 검색 파라미터를 사용하는 경로는 search 속성에 해당 타입을 정의
 *
 * @example
 * type MyPathname = keyof RouteConfig // 모든 경로 문자열 타입
 */
export type RouteConfig = {
  /** 메인 홈 화면 */
  [RoutePath.root]: { pathname: typeof RoutePath.root }
  [RoutePath.search]: { pathname: typeof RoutePath.search }

  /** 로그인 페이지 */
  [RoutePath.login]: { pathname: typeof RoutePath.login }
  
  /** 설치 가이드 페이지 */
  [RoutePath.installGuide]: { pathname: typeof RoutePath.installGuide }
  
  /** 노트 관련 */
  [RoutePath.notes]: { pathname: typeof RoutePath.notes }
  [RoutePath.noteDetail]: { pathname: typeof RoutePath.noteDetail }
  [RoutePath.noteQuiz]: { pathname: typeof RoutePath.noteQuiz }
  [RoutePath.noteArrange]: { pathname: typeof RoutePath.noteArrange }
  [RoutePath.noteSearch]: { pathname: typeof RoutePath.noteSearch }
  [RoutePath.noteEdit]: { pathname: typeof RoutePath.noteEdit }
  [RoutePath.noteWrite]: { pathname: typeof RoutePath.noteWrite }
  [RoutePath.noteUpload]: { pathname: typeof RoutePath.noteUpload }
  
  /** 계정 관련 */
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
  
  /** 테마 퀴즈 */
  [RoutePath.randomQuiz]: {
    pathname: typeof RoutePath.randomQuiz
    search: {
      /** 날짜 */
      date: string
    }
  }
  [RoutePath.bombQuiz]: {
    pathname: typeof RoutePath.bombQuiz
    search: {
      /** 날짜 */
      date: string
    }
  }
  
  /** 컬렉션 관련 */
  [RoutePath.collections]: { pathname: typeof RoutePath.collections }
  [RoutePath.collectionDetail]: { pathname: typeof RoutePath.collectionDetail }
  [RoutePath.collectionQuiz]: { pathname: typeof RoutePath.collectionQuiz }
  [RoutePath.collectionComplain]: { pathname: typeof RoutePath.collectionComplain }
  [RoutePath.collectionCreate]: { pathname: typeof RoutePath.collectionCreate }
  [RoutePath.collectionEditInfo]: { pathname: typeof RoutePath.collectionEditInfo }
  [RoutePath.collectionEditQuiz]: { pathname: typeof RoutePath.collectionEditQuiz }
  [RoutePath.collectionSearch]: {
    pathname: typeof RoutePath.collectionSearch
    search: {
      /** 검색어 */
      query: string
    }
  }
}
