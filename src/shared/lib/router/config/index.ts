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

  /** 계정 페이지 */
  account: '/account',

  /** 로그인 페이지 */
  login: '/login',

  /** 게스트 로그인 페이지 */
  guestLogin: '/guest-login',

  /** 이메일 로그인 페이지 */
  emailLogin: '/email-login',

  /** 회원가입 페이지 */
  signUp: '/sign-up',

  /** 랜덤 퀴즈 페이지 */
  randomQuiz: '/quiz/random',

  /** 밤 퀴즈 페이지 */
  bombQuiz: '/quiz/bomb',

  /** 메인 퀴즈 페이지 */
  quiz: '/quiz',

  /** 노트 리스트 페이지 */
  notes: '/notes',

  /** 노트 상세 페이지 (동적 파라미터: noteId) */
  note: '/note/:noteId',

  /** 컬렉션 리스트 페이지 */
  collections: '/collections',

  /** 컬렉션 상세 페이지 (동적 파라미터: collectionId) */
  collection: '/collection/:collectionId',

  /** 컬렉션 검색 페이지 */
  collectionSearch: '/collection/search',

  /** 설정 페이지 */
  setting: '/setting',
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

  /** 계정 페이지 */
  [RoutePath.account]: { pathname: typeof RoutePath.account }

  /** 로그인 페이지 */
  [RoutePath.login]: { pathname: typeof RoutePath.login }

  /** 게스트 로그인 페이지 */
  [RoutePath.guestLogin]: { pathname: typeof RoutePath.guestLogin }

  /** 이메일 로그인 페이지 */
  [RoutePath.emailLogin]: { pathname: typeof RoutePath.emailLogin }

  /** 회원가입 페이지 */
  [RoutePath.signUp]: { pathname: typeof RoutePath.signUp }

  /** 랜덤 퀴즈 페이지 - 검색 파라미터로 카테고리와 레벨 지정 가능 */
  [RoutePath.randomQuiz]: {
    pathname: typeof RoutePath.randomQuiz
    search: {
      /** 퀴즈 카테고리 */
      category: ReadonlyArray<string>
      /** 난이도 레벨 */
      level: ReadonlyArray<string>
    }
  }

  /** 밤 퀴즈 페이지 - 검색 파라미터로 카테고리와 레벨 지정 가능 */
  [RoutePath.bombQuiz]: {
    pathname: typeof RoutePath.bombQuiz
    search: {
      /** 퀴즈 카테고리 */
      category: ReadonlyArray<string>
      /** 난이도 레벨 */
      level: ReadonlyArray<string>
    }
  }

  /** 메인 퀴즈 페이지 */
  [RoutePath.quiz]: { pathname: typeof RoutePath.quiz }

  /** 노트 리스트 페이지 */
  [RoutePath.notes]: { pathname: typeof RoutePath.notes }

  /** 노트 상세 페이지 (동적 파라미터: noteId) */
  [RoutePath.note]: { pathname: typeof RoutePath.note }

  /** 컬렉션 리스트 페이지 */
  [RoutePath.collections]: { pathname: typeof RoutePath.collections }

  /** 컬렉션 상세 페이지 (동적 파라미터: collectionId) */
  [RoutePath.collection]: { pathname: typeof RoutePath.collection }

  /** 컬렉션 검색 페이지 - 검색 파라미터로 검색어 지정 가능 */
  [RoutePath.collectionSearch]: {
    pathname: typeof RoutePath.collectionSearch
    search: {
      /** 검색어 */
      query: string
    }
  }

  /** 설정 페이지 */
  [RoutePath.setting]: { pathname: typeof RoutePath.setting }
}
