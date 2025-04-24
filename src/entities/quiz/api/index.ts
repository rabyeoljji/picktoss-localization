import { client } from '@/shared/lib/axios/client'

import { QUIZ_ENDPOINTS } from './config'

// GET: 데일리 퀴즈 가져오기
export interface GetAllQuizzesDto {
  id: number
  name: string
  question: string
  answer: string
  explanation: string
  options: string[]
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
}

export interface GetAllQuizzesResponse {
  quizzes: GetAllQuizzesDto[]
}

export const getQuizzes = async (
  quizType?: 'ALL' | 'MIX_UP' | 'MULTIPLE_CHOICE',
  quizSource?: 'ALL' | 'BOOKMARK_QUIZ' | 'MY_QUIZ',
): Promise<GetAllQuizzesResponse> => {
  const params: Record<string, string> = {}
  if (quizType) params['quiz-type'] = quizType
  if (quizSource) params['quiz-source'] = quizSource

  const response = await client.get<GetAllQuizzesResponse>(QUIZ_ENDPOINTS.getQuizzes, { params })
  return response.data
}

// GET: 전체 퀴즈 기록
export interface GetAllQuizRecordDailyQuizDto {
  dailyQuizRecordId: number
  totalQuizCount: number
  solvedDate: string
}

export interface GetAllQuizRecordQuizSetDto {
  quizSetId: number
  quizSetName: string
  totalQuizCount: number
  createdAt: string
}

export interface GetAllQuizRecordsResponse {
  quizSets: GetAllQuizRecordQuizSetDto[]
  dailyQuizRecords: GetAllQuizRecordDailyQuizDto[]
}

export const getQuizzesRecords = async (): Promise<GetAllQuizRecordsResponse> => {
  const response = await client.get<GetAllQuizRecordsResponse>(QUIZ_ENDPOINTS.getQuizzesRecords)
  return response.data
}

// GET: 퀴즈 주단위 분석
export interface QuizAnswerRateAnalysisDto {
  date: string
  totalQuizCount: number
  correctAnswerCount: number
}

export interface GetQuizWeeklyAnalysisResponse {
  quizzes: QuizAnswerRateAnalysisDto[]
  averageDailyQuizCount: number
  averageCorrectRate: number
  weeklyTotalQuizCount: number
}

export const getQuizWeeklyAnalysis = async (
  startDate?: string,
  endDate?: string,
): Promise<GetQuizWeeklyAnalysisResponse> => {
  const params: Record<string, string> = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  const response = await client.get<GetQuizWeeklyAnalysisResponse>(QUIZ_ENDPOINTS.getQuizWeeklyAnalysis, { params })
  return response.data
}

// GET: 퀴즈 월단위 분석
export interface GetQuizMonthlyAnalysisResponse {
  quizzes: QuizAnswerRateAnalysisDto[]
  monthlyTotalQuizCount: number
  monthlyTotalCorrectQuizCount: number
  averageCorrectAnswerRate: number
  quizCountDifferenceFromLastMonth: number
}

export const getQuizMonthlyAnalysis = async (month?: string): Promise<GetQuizMonthlyAnalysisResponse> => {
  const params: Record<string, string> = {}
  if (month) params.month = month

  const response = await client.get<GetQuizMonthlyAnalysisResponse>(QUIZ_ENDPOINTS.getQuizMonthlyAnalysis, { params })
  return response.data
}

// GET: 퀴즈 세트 가져오기
export interface GetQuizSetQuizDto {
  id: number
  question: string
  answer: string
  explanation: string
  options: string[]
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
}

export interface GetQuizSetResponse {
  quizzes: GetQuizSetQuizDto[]
}

export const getQuizSet = async (quizSetId: number): Promise<GetQuizSetResponse> => {
  const response = await client.get<GetQuizSetResponse>(QUIZ_ENDPOINTS.getQuizSet(quizSetId))
  return response.data
}

// GET: 퀴즈 세트에 대한 상세 기록
export interface GetSingleQuizSetRecordDto {
  id: number
  question: string
  answer: string
  explanation: string
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
  options: string[]
  isAnswer: boolean
  choseAnswer: string
}

export interface GetSingleQuizSetRecordResponse {
  totalQuizCount: number
  totalElapsedTimeMs: number
  averageCorrectAnswerRate: number
  createdAt: string
  quizzes: GetSingleQuizSetRecordDto[]
}

export const getSingleQuizSetRecord = async (quizSetId: number): Promise<GetSingleQuizSetRecordResponse> => {
  const response = await client.get<GetSingleQuizSetRecordResponse>(QUIZ_ENDPOINTS.getSingleQuizSetRecord(quizSetId))
  return response.data
}

// GET: 데일리 퀴즈 연속일 현황
export interface GetConsecutiveSolvedDailyQuizResponse {
  currentConsecutiveDays: number
}

export const getConsecutiveSolvedDailyQuiz = async (): Promise<GetConsecutiveSolvedDailyQuizResponse> => {
  const response = await client.get<GetConsecutiveSolvedDailyQuizResponse>(QUIZ_ENDPOINTS.getConsecutiveSolvedDailyQuiz)
  return response.data
}

// GET: 월별 데일리 퀴즈 연속일 기록
export interface GetDailyQuizRecordByDateDto {
  date: string
  isDailyQuizComplete: boolean
}

export interface GetConsecutiveSolvedDailyQuizDatesResponse {
  solvedDailyQuizDateRecords: GetDailyQuizRecordByDateDto[]
}

export const getConsecutiveSolvedQuizSetDates = async (
  solvedDate: string,
): Promise<GetConsecutiveSolvedDailyQuizDatesResponse> => {
  const response = await client.get<GetConsecutiveSolvedDailyQuizDatesResponse>(
    QUIZ_ENDPOINTS.getConsecutiveSolvedQuizSetDates(solvedDate),
  )
  return response.data
}

// GET: 데일리 퀴즈에 대한 상세 기록
export interface GetSingleDailyQuizRecordDto {
  id: number
  question: string
  answer: string
  explanation: string
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
  options: string[]
  isAnswer: boolean
  choseAnswer: string
}

export interface GetSingleDailyQuizRecordResponse {
  quizzes: GetSingleDailyQuizRecordDto[]
}

export const getSingleDailyQuizRecord = async (
  dailyQuizRecordId: number,
): Promise<GetSingleDailyQuizRecordResponse> => {
  const response = await client.get<GetSingleDailyQuizRecordResponse>(
    QUIZ_ENDPOINTS.getSingleDailyQuizRecord(dailyQuizRecordId),
  )
  return response.data
}

// POST: 데일리 퀴즈 풀기
export interface CreateQuizSolveRecordRequest {
  quizId: number
  isAnswer: boolean
  choseAnswer: string
}

export interface CreateDailyQuizRecordResponse {
  reward: number
  todaySolvedDailyQuizCount: number
  consecutiveSolvedDailyQuizDays: number
}

export const createDailyQuizRecord = async (
  data: CreateQuizSolveRecordRequest,
): Promise<CreateDailyQuizRecordResponse> => {
  const response = await client.post<CreateDailyQuizRecordResponse>(QUIZ_ENDPOINTS.createDailyQuizRecord, data)
  return response.data
}

// POST: 퀴즈 시작하기 (퀴즈 세트 생성)
export interface CreateQuizSetRequest {
  quizCount: number
}

export interface CreateQuizSetResponse {
  quizSetId: number
}

export const createQuizSet = async (documentId: number, data: CreateQuizSetRequest): Promise<CreateQuizSetResponse> => {
  const response = await client.post<CreateQuizSetResponse>(QUIZ_ENDPOINTS.createQuizSet(documentId), data)
  return response.data
}

// PATCH: 퀴즈 오답 확인(이해했습니다)
export const updateWrongAnswerConfirm = async (quizId: number): Promise<void> => {
  const response = await client.patch<void>(QUIZ_ENDPOINTS.updateWrongAnswerConfirm(quizId))
  return response.data
}

// PATCH: 퀴즈 정보 변경
export interface UpdateQuizInfoRequest {
  question: string
  answer: string
  explanation: string
  options: string[]
}

export const updateQuizInfo = async (quizId: number, data: UpdateQuizInfoRequest): Promise<void> => {
  const response = await client.patch<void>(QUIZ_ENDPOINTS.updateQuizInfo(quizId), data)
  return response.data
}

// PATCH: 퀴즈 세트 결과 업데이트
export interface UpdateQuizResultQuizDto {
  id: number
  answer: boolean
  choseAnswer: string
  elapsedTime: number
}

export interface UpdateQuizResultRequest {
  quizzes: UpdateQuizResultQuizDto[]
}

export interface UpdateQuizResultResponse {
  totalQuizCount: number
  totalElapsedTime: number
  correctAnswerRate: number
}

export const updateQuizResult = async (
  documentId: number,
  quizSetId: number,
  data: UpdateQuizResultRequest,
): Promise<UpdateQuizResultResponse> => {
  const response = await client.patch<UpdateQuizResultResponse>(
    QUIZ_ENDPOINTS.updateQuizResult(documentId, quizSetId),
    data,
  )
  return response.data
}

// DELETE: 퀴즈 삭제
export const deleteQuiz = async (quizId: number): Promise<void> => {
  const response = await client.delete<void>(QUIZ_ENDPOINTS.deleteQuiz(quizId), { data: [quizId] })
  return response.data
}
