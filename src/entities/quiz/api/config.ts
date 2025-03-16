import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const QUIZ = 'quiz'

export const QUIZ_ENDPOINTS = {
  // POST
  postTestCreateTodayQuiz: () => '/test/create-today-quiz',
  postMemberGeneratedQuizSet: (documentId: number) => `/quizzes/documents/${documentId}/custom-quiz-set`,
  postErrorCheckQuizSet: (documentId: number) => `/quizzes/documents/${documentId}/check-quiz-set`,

  // PATCH
  patchRandomQuizResult: () => '/random-quiz/result',
  patchQuizResult: () => '/quiz/result',

  // GET
  getCurrentTodayQuizInfo: () => '/today-quiz-info',
  getTodaySolvedQuizCount: () => '/quizzes/solved/today',
  getSingleQuizRecordByDate: (solvedDate: string) => `/quizzes/${solvedDate}/quiz-record`,
  getSingleQuizSetRecord: (
    quizSetId: string,
    quizSetType: 'TODAY_QUIZ_SET' | 'DOCUMENT_QUIZ_SET' | 'COLLECTION_QUIZ_SET' | 'FIRST_QUIZ_SET',
  ) => `/quizzes/${quizSetId}/${quizSetType}/quiz-record`,
  getQuizSetToday: () => '/quiz-sets/today',
}

export const QUIZ_KEYS = {
  // POST
  postTestCreateTodayQuiz: originalCreateKey(QUIZ, QUIZ_ENDPOINTS.postTestCreateTodayQuiz()),
  postMemberGeneratedQuizSet: (documentId: number) =>
    originalCreateKey(QUIZ, QUIZ_ENDPOINTS.postMemberGeneratedQuizSet(documentId)),
  postErrorCheckQuizSet: (documentId: number) =>
    originalCreateKey(QUIZ, QUIZ_ENDPOINTS.postErrorCheckQuizSet(documentId)),

  // PATCH
  patchRandomQuizResult: originalCreateKey(QUIZ, QUIZ_ENDPOINTS.patchRandomQuizResult()),
  patchQuizResult: originalCreateKey(QUIZ, QUIZ_ENDPOINTS.patchQuizResult()),

  // GET
  getCurrentTodayQuizInfo: originalCreateKey(QUIZ, QUIZ_ENDPOINTS.getCurrentTodayQuizInfo()),
  getTodaySolvedQuizCount: originalCreateKey(QUIZ, QUIZ_ENDPOINTS.getTodaySolvedQuizCount()),
  getSingleQuizRecordByDate: (solvedDate: string) =>
    originalCreateKey(QUIZ, QUIZ_ENDPOINTS.getSingleQuizRecordByDate(solvedDate)),
  getSingleQuizSetRecord: (
    quizSetId: string,
    quizSetType: 'TODAY_QUIZ_SET' | 'DOCUMENT_QUIZ_SET' | 'COLLECTION_QUIZ_SET' | 'FIRST_QUIZ_SET',
  ) => originalCreateKey(QUIZ, QUIZ_ENDPOINTS.getSingleQuizSetRecord(quizSetId, quizSetType)),
  getQuizSetToday: originalCreateKey(QUIZ, QUIZ_ENDPOINTS.getQuizSetToday()),
}
