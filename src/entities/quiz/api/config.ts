import { createKey } from '@/shared/api/lib/create-key'

const QUIZ = 'quiz'

export const QUIZ_ENDPOINTS = {
  // GET
  // 데일리 퀴즈 가져오기
  getQuizzes: '/quizzes',
  // 전체 퀴즈 기록
  getQuizzesRecords: '/quizzes/records',
  // 퀴즈 주단위 분석
  getQuizWeeklyAnalysis: '/quizzes/analysis/weekly',
  // 퀴즈 월단위 분석
  getQuizMonthlyAnalysis: '/quizzes/analysis/monthly',
  // 퀴즈 세트 가져오기
  getQuizSet: (quizSetId: number) => `/quiz-sets/${quizSetId}`,
  // 퀴즈 세트에 대한 상세 기록
  getSingleQuizSetRecord: (quizSetId: number) => `/quiz-sets/${quizSetId}/record`,
  // 데일리 퀴즈 연속일 현황
  getConsecutiveSolvedDailyQuiz: '/daily-quiz-records/consecutive-days',
  // 월별 데일리 퀴즈 연속일 기록
  getConsecutiveSolvedQuizSetDates: (solvedDate: string) => `/daily-quiz-records/${solvedDate}/consecutive-days`,
  // 데일리 퀴즈에 대한 상세 기록
  getSingleDailyQuizRecord: (dailyQuizRecordId: number) => `/daily-quiz-records/${dailyQuizRecordId}/record`,

  // POST
  // 데일리 퀴즈 풀기
  createDailyQuizRecord: '/quizzes/solve',
  // 퀴즈 시작하기 (퀴즈 세트 생성)
  createQuizSet: (documentId: number) => `/documents/${documentId}/quiz-sets`,

  // PATCH
  // 퀴즈 오답 확인(이해했습니다)
  updateWrongAnswerConfirm: (quizId: number) => `/quizzes/${quizId}/wrong-answer-confirm`,
  // 퀴즈 정보 변경
  updateQuizInfo: (quizId: number) => `/quizzes/${quizId}/update-info`,
  // 퀴즈 세트 결과 업데이트
  updateQuizResult: (documentId: number, quizSetId: number) =>
    `/documents/${documentId}/quiz-sets/${quizSetId}/update-result`,

  // DELETE
  // 퀴즈 삭제
  deleteQuiz: '/quizzes/delete',
}

export const QUIZ_KEYS = {
  // GET
  getQuizzes: createKey(QUIZ, QUIZ_ENDPOINTS.getQuizzes),
  getQuizzesRecords: createKey(QUIZ, QUIZ_ENDPOINTS.getQuizzesRecords),
  getQuizWeeklyAnalysis: createKey(QUIZ, QUIZ_ENDPOINTS.getQuizWeeklyAnalysis),
  getQuizMonthlyAnalysis: (month?: string) => createKey(QUIZ, QUIZ_ENDPOINTS.getQuizMonthlyAnalysis, month),
  getQuizSet: (quizSetId: number) => createKey(QUIZ, QUIZ_ENDPOINTS.getQuizSet(quizSetId)),
  getSingleQuizSetRecord: (quizSetId: number) => createKey(QUIZ, QUIZ_ENDPOINTS.getSingleQuizSetRecord(quizSetId)),
  getConsecutiveSolvedDailyQuiz: createKey(QUIZ, QUIZ_ENDPOINTS.getConsecutiveSolvedDailyQuiz),
  getConsecutiveSolvedQuizSetDates: (solvedDate: string) =>
    createKey(QUIZ, QUIZ_ENDPOINTS.getConsecutiveSolvedQuizSetDates(solvedDate)),
  getSingleDailyQuizRecord: (dailyQuizRecordId: number) =>
    createKey(QUIZ, QUIZ_ENDPOINTS.getSingleDailyQuizRecord(dailyQuizRecordId)),

  // POST
  createDailyQuizRecord: createKey(QUIZ, QUIZ_ENDPOINTS.createDailyQuizRecord),
  createQuizSet: (documentId: number) => createKey(QUIZ, QUIZ_ENDPOINTS.createQuizSet(documentId)),

  // PATCH
  updateWrongAnswerConfirm: createKey(QUIZ, QUIZ_ENDPOINTS.updateWrongAnswerConfirm),
  updateQuizInfo: (quizId: number) => createKey(QUIZ, QUIZ_ENDPOINTS.updateQuizInfo(quizId)),
  updateQuizResult: (documentId: number, quizSetId: number) =>
    createKey(QUIZ, QUIZ_ENDPOINTS.updateQuizResult(documentId, quizSetId)),

  // DELETE
  deleteQuiz: createKey(QUIZ, QUIZ_ENDPOINTS.deleteQuiz),
}
