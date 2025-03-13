import { client } from "@/shared/lib/axios/client"
import { QUIZ_ENDPOINTS } from "./config"

// POST: 오늘의 퀴즈 생성 (테스트 및 예외처리용)
export const createTodayQuizForTest = async (): Promise<string> => {
  const response = await client.post<string>(QUIZ_ENDPOINTS.postTestCreateTodayQuiz())
  return response.data
}

// POST: 문서 기반 사용자 생성 퀴즈 세트 생성
interface CreateQuizzesByDocumentRequest {
  quizType: string
  quizCount: number
}

interface CreateQuizzesResponse {
  quizSetId: string
  quizSetType: "TODAY_QUIZ_SET" | "DOCUMENT_QUIZ_SET" | "COLLECTION_QUIZ_SET" | "FIRST_QUIZ_SET"
  createdAt: string
}

export const createMemberGeneratedQuizSet = async (
  documentId: number,
  data: CreateQuizzesByDocumentRequest,
): Promise<CreateQuizzesResponse> => {
  const response = await client.post<CreateQuizzesResponse>(QUIZ_ENDPOINTS.postMemberGeneratedQuizSet(documentId), data)
  return response.data
}

// POST: 퀴즈 생성 후 오류 확인용 (에러체크 퀴즈 세트 생성)
export const createErrorCheckQuizSet = async (documentId: number): Promise<CreateQuizzesResponse> => {
  const response = await client.post<CreateQuizzesResponse>(QUIZ_ENDPOINTS.postErrorCheckQuizSet(documentId))
  return response.data
}

// PATCH: 랜덤 퀴즈 결과 업데이트
interface UpdateRandomQuizResultRequest {
  quizzes: { id: number; answer: boolean }[]
}

export const updateRandomQuizResult = async ({ data }: { data: UpdateRandomQuizResultRequest }): Promise<void> => {
  const response = await client.patch<void>(QUIZ_ENDPOINTS.patchRandomQuizResult(), data)
  return response.data
}

// PATCH: 일반 퀴즈 결과 업데이트
interface UpdateQuizResultQuizDto {
  id: number
  answer: boolean
  choseAnswer: string
  elapsedTime: number
}

interface UpdateQuizResultRequest {
  quizSetId: string
  quizSetType: "TODAY_QUIZ_SET" | "DOCUMENT_QUIZ_SET" | "COLLECTION_QUIZ_SET" | "FIRST_QUIZ_SET"
  quizzes: UpdateQuizResultQuizDto[]
}

interface UpdateQuizResultResponse {
  totalQuizCount: number
  totalElapsedTime: number
  correctAnswerRate: number
  reward: number
  currentConsecutiveTodayQuizDate: number
}

export const updateQuizResult = async ({
  data,
}: {
  data: UpdateQuizResultRequest
}): Promise<UpdateQuizResultResponse> => {
  const response = await client.patch<UpdateQuizResultResponse>(QUIZ_ENDPOINTS.patchQuizResult(), data)
  return response.data
}

// GET: 오늘의 퀴즈 현황 조회
interface GetCurrentTodayQuizInfo {
  currentConsecutiveDays: number
  maxConsecutiveDays: number
}

export const getCurrentTodayQuizInfo = async (): Promise<GetCurrentTodayQuizInfo> => {
  const response = await client.get<GetCurrentTodayQuizInfo>(QUIZ_ENDPOINTS.getCurrentTodayQuizInfo())
  return response.data
}

// GET: 오늘 푼 퀴즈 수 조회
interface GetTodaySolvedQuizCountResponse {
  todaySolvedQuizCount: number
}

export const getTodaySolvedQuizCount = async (): Promise<GetTodaySolvedQuizCountResponse> => {
  const response = await client.get<GetTodaySolvedQuizCountResponse>(QUIZ_ENDPOINTS.getTodaySolvedQuizCount())
  return response.data
}

// GET: 날짜별 퀴즈 기록 조회
interface GetSingleQuizRecordByDateResponse {
  quizRecords: {
    quizSetId: string
    name: string
    quizCount: number
    score: number
    quizSetType: "TODAY_QUIZ_SET" | "DOCUMENT_QUIZ_SET" | "COLLECTION_QUIZ_SET" | "FIRST_QUIZ_SET"
  }[]
}

export const getSingleQuizRecordByDate = async (solvedDate: string): Promise<GetSingleQuizRecordByDateResponse> => {
  const response = await client.get<GetSingleQuizRecordByDateResponse>(
    QUIZ_ENDPOINTS.getSingleQuizRecordByDate(solvedDate),
  )
  return response.data
}

// GET: 퀴즈 세트 상세 기록 조회
interface GetSingleQuizSetRecordDto {
  id: number
  question: string
  answer: string
  explanation: string
  quizType: "MIX_UP" | "MULTIPLE_CHOICE"
  options: string[]
  choseAnswer: string
  documentName: string
  directoryName: string
  collectionName?: string
  quizSetType: "TODAY_QUIZ_SET" | "DOCUMENT_QUIZ_SET" | "COLLECTION_QUIZ_SET" | "FIRST_QUIZ_SET"
}

interface GetSingleQuizSetRecordResponse {
  totalElapsedTimeMs: number
  quizzes: GetSingleQuizSetRecordDto[]
  createdAt: string
}

export const getSingleQuizSetRecord = async (
  quizSetId: string,
  quizSetType: "TODAY_QUIZ_SET" | "DOCUMENT_QUIZ_SET" | "COLLECTION_QUIZ_SET" | "FIRST_QUIZ_SET",
): Promise<GetSingleQuizSetRecordResponse> => {
  const response = await client.get<GetSingleQuizSetRecordResponse>(
    QUIZ_ENDPOINTS.getSingleQuizSetRecord(quizSetId, quizSetType),
  )
  return response.data
}

// GET: 오늘의 퀴즈 세트 정보 조회
interface GetQuizSetTodayResponse {
  quizSetId: string
  quizSetType: "TODAY_QUIZ_SET" | "DOCUMENT_QUIZ_SET" | "COLLECTION_QUIZ_SET" | "FIRST_QUIZ_SET"
  type: "READY" | "NOT_READY" | "DONE"
  createdAt: string
}

export const getQuizSetToday = async (): Promise<GetQuizSetTodayResponse> => {
  const response = await client.get<GetQuizSetTodayResponse>(QUIZ_ENDPOINTS.getQuizSetToday())
  return response.data
}
