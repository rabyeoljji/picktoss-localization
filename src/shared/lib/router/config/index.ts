import { QuizSetType } from '@/pages/progress-quiz-page'

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
    search: {
      quizType: 'MULTIPLE_CHOICE' as 'MIX_UP' | 'MULTIPLE_CHOICE',
      showAnswer: false as boolean,
      tab: ['QUIZ'] as string[],
    },
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
    search: {
      documentType: 'TEXT' as 'TEXT' | 'FILE',
    },
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
    pathname: '/progress-quiz/:quizSetId',
    search: {
      quizIndex: 0 as number,
      selectedOption: null as string | null,
      hideTimeSpent: true as boolean,
      autoNext: true as boolean,
      quizSetType: 'TODAY_QUIZ_SET' as QuizSetType,
    },
  },
  quizLoading: {
    pathname: '/quiz-loading',
    search: {
      documentId: 0 as number,
      documentName: '' as string,
      star: 0 as number,
    },
  },
  quizResult: {
    pathname: '/quiz-result',
    search: {
      quizSetId: '' as string,
      quizSetType: '' as QuizSetType,
      correctAnswerRate: 0 as number,
      totalElapsedTime: 0 as number,
      totalQuizCount: 0 as number,
      reward: 0 as number,
      quizWithResultDataEncoded: '' as string,
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

  /** 탐험 관련 페이지 */
  explore: {
    pathname: '/explore',
  },
  exploreShare: {
    pathname: '/explore/share',
  },
  exploreQuiz: {
    pathname: '/explore/quiz/:sharedNoteId',
  },
  exploreQuizDetail: {
    pathname: '/explore/quiz/detail/:sharedNoteId',
  },
  exploreQuizComplain: {
    pathname: '/explore/quiz/complain/:sharedNoteId',
  },
  exploreSearch: {
    pathname: '/explore/search',
    search: {
      query: '' as string,
    },
  },
} as const
