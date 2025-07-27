import { QuizSetType } from '@/pages/progress-quiz-page'
import { format } from 'date-fns'

import { BookmarkedSortOption, SortOption } from '@/entities/document/api'

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
    search: {
      displayQuizType: 'ALL' as 'ALL' | 'MULTIPLE_CHOICE' | 'MIX_UP',
      displayQuizScope: 'ALL' as 'ALL' | 'MY' | 'BOOKMARK',
    },
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

  /** 노트 생성 페이지 */
  noteCreate: {
    pathname: '/note/create',
    search: {
      documentType: 'TEXT' as 'TEXT' | 'FILE',
      isLoading: false as boolean,
      documentId: 0 as number,
    },
  },

  /** 도서관 페이지 */
  library: {
    pathname: '/library',
    search: {
      tab: 'MY' as 'MY' | 'BOOKMARK',
      sortOption: null as SortOption | null,
      bookmarkedSortOption: null as BookmarkedSortOption | null,
    },
  },
  librarySearch: {
    pathname: '/library/search',
    search: {
      tab: 'MY' as 'MY' | 'BOOKMARK',
    },
  },
  libraryNoteDetailList: {
    pathname: '/library/list/:noteId',
    search: {
      quizType: 'ALL' as 'MIX_UP' | 'MULTIPLE_CHOICE' | 'ALL',
      showAnswer: false as boolean,
      tab: ['QUIZ'] as string[],
    },
  },
  libraryNoteQuiz: {
    pathname: '/library/quiz/:noteId',
  },
  libraryNoteEdit: {
    pathname: '/library/edit/:noteId',
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
    search: {
      month: format(new Date(), 'yyyy-MM') as string,
    },
  },
  accountQuizRecord: {
    pathname: '/account/quiz-record',
  },
  accountQuizRecordSetDetail: {
    pathname: '/account/quiz-record/set/:quizSetId',
  },
  accountQuizRecordDailyDetail: {
    pathname: '/account/quiz-record/daily/:dailyQuizRecordId',
    search: {
      solvedDate: '' as string, // 'yyyy.M.d' 형식의 날짜 문자열
    },
  },
  accountNotificationConfig: {
    pathname: '/account/notification-config',
  },
  accountMyStar: {
    pathname: '/account/my-star',
  },
  accountStarHistory: {
    pathname: '/account/star-history',
    search: {
      sort: 'ALL' as 'ALL' | 'DEPOSIT' | 'WITHDRAWAL',
    },
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
      documentId: 0 as number,
      quizIndex: 0 as number,
      selectedOption: null as string | null,
      quizSetType: 'DOCUMENT_QUIZ_SET' as QuizSetType,
      prevUrl: '' as string,
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
    search: {
      // category id
      category: 0 as number,
    },
  },
  exploreRelease: {
    pathname: '/explore/release',
  },
  exploreComplain: {
    pathname: '/explore/complain/:noteId',
    search: {
      name: '' as string,
    },
  },
  exploreSearch: {
    pathname: '/explore/search',
    search: {
      query: '' as string,
    },
  },

  /** 초대 관련 페이지 */
  invite: {
    pathname: '/invite/:inviteCode',
  },
  inviteLogin: {
    pathname: '/invite/login',
    search: {
      inviteCode: '' as string,
    },
  },
  testOgTags: {
    pathname: '/test-og-tags',
  },

  quizDetail: {
    pathname: '/quiz-detail/:noteId',
  },
} as const
