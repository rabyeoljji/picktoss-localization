/**
 * 애플리케이션의 모든 경로와 검색 파라미터를 관리하는 통합 설정
 *
 * 라우팅 시스템에서 경로 문자열을 하드코딩하는 대신 이 객체를 참조
 * 코드 전체에서 경로 일관성을 유지하고 변경 시 단일 지점에서 관리
 *
 * @example
 * // 다음과 같이 사용
 * <Link to={RouteConfig.account.pathname}>계정</Link>
 * router.push(RouteConfig.login.pathname)
 */
export const RouteConfig = {
  /** 메인 홈 화면 */
  root: {
    pathname: '/',
  },

  /** 통합 검색 */
  search: {
    pathname: '/search',
  },

  /** 로그인 페이지 */
  login: {
    pathname: '/login',
  },

  /** 설치 가이드 페이지 */
  installGuide: {
    pathname: '/install-guide',
  },

  /** 노트 관련 페이지 */
  note: {
    pathname: '/note',
  },
  noteDetail: {
    pathname: '/note/:noteId',
  },
  noteQuiz: {
    pathname: '/note/quiz/:noteId',
  },
  noteArrange: {
    pathname: '/note/arrange/:directoryId',
  },
  noteSearch: {
    pathname: '/note/search',
  },
  noteEdit: {
    pathname: '/note/edit/:noteId',
  },
  noteCreate: {
    pathname: '/note/create',
  },
  noteUpload: {
    pathname: '/note/upload',
  },

  /** 계정 관련 페이지 */
  account: {
    pathname: '/account',
  },
  accountInfo: {
    pathname: '/account/info',
  },
  accountDailyQuizAttendance: {
    pathname: '/account/daily-quiz-attendance',
  },
  accountQuizAnalysis: {
    pathname: '/account/quiz-analysis',
  },
  accountQuizRecord: {
    pathname: '/account/quiz-record',
  },
  accountNotificationConfig: {
    pathname: '/account/notification-config',
  },
  accountPaymentHistory: {
    pathname: '/account/payment-history',
  },
  accountNotice: {
    pathname: '/account/notice',
  },
  accountContact: {
    pathname: '/account/contact',
  },
  accountFaq: {
    pathname: '/account/faq',
  },
  accountPolicy: {
    pathname: '/account/policy',
  },
  accountWithdraw: {
    pathname: '/account/withdraw',
  },
  accountFeedback: {
    pathname: '/account/feedback',
  },
  accountFeedbackComplete: {
    pathname: '/account/feedback/complete',
  },

  /** 퀴즈 관련 페이지 */
  progressQuiz: {
    pathname: '/progress-quiz/:quizId',
    search: {
      name: '유민' as '유민' | '정우',
      emoji: '' as string,
      date: '' as string,
    },
  },
  randomQuiz: {
    pathname: '/random-quiz',
    search: {
      date: '' as string,
    },
  },
  bombQuiz: {
    pathname: '/bomb-quiz',
    search: {
      date: '' as string,
    },
  },

  /** 컬렉션 관련 페이지 */
  collection: {
    pathname: '/collection',
  },
  collectionDetail: {
    pathname: '/collection/:collectionId',
  },
  collectionQuiz: {
    pathname: '/collection/quiz/:collectionId',
  },
  collectionComplain: {
    pathname: '/collection/complain/:collectionId',
  },
  collectionCreate: {
    pathname: '/collection/create',
  },
  collectionEditInfo: {
    pathname: '/collection/edit/info/:collectionId',
  },
  collectionEditQuiz: {
    pathname: '/collection/edit/quiz/:collectionId',
  },
  collectionSearch: {
    pathname: '/collection/search',
    search: {
      query: '' as string,
    },
  },
} as const

/**
 * 기존 RoutePath 호환성 유지를 위한 변환
 *
 * @example
 * // 다음과 같이 기존 방식으로 사용 가능
 * <Link to={RoutePath.account}>계정</Link>
 * router.push(RoutePath.login)
 */
export const RoutePath = Object.fromEntries(
  Object.entries(RouteConfig).map(([key, value]) => [key, value.pathname]),
) as {
  [K in keyof typeof RouteConfig]: (typeof RouteConfig)[K]['pathname']
}

/**
 * 경로 문자열을 키로 사용하여 검색 파라미터 매핑
 * pathname -> search 객체 매핑
 */
type PathWithSearch = {
  [K in keyof typeof RouteConfig]: (typeof RouteConfig)[K] extends { pathname: infer P; search: infer S }
    ? P extends string
      ? { path: P; search: S }
      : never
    : never
}[keyof typeof RouteConfig]

export const SearchConfig = Object.fromEntries(
  Object.entries(RouteConfig).flatMap(([_, value]) => {
    if ('search' in value) {
      return [[value.pathname, value.search]]
    }
    return []
  }),
) as {
  [P in PathWithSearch['path']]: Extract<PathWithSearch, { path: P }>['search']
}
