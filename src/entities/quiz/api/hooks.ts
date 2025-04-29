import { useMutation, useQuery } from '@tanstack/react-query'

import { QUIZ_KEYS } from './config'
import {
  createDailyQuizRecord,
  createQuizSet,
  deleteQuiz,
  getConsecutiveSolvedDailyQuiz,
  getConsecutiveSolvedQuizSetDates,
  getQuizMonthlyAnalysis,
  getQuizSet,
  getQuizWeeklyAnalysis,
  getQuizzes,
  getQuizzesRecords,
  getSingleDailyQuizRecord,
  getSingleQuizSetRecord,
  updateQuizInfo,
  updateQuizResult,
  updateWrongAnswerConfirm,
} from './index'

// GET 훅

// 데일리 퀴즈 가져오기
export const useGetQuizzes = (
  quizType?: 'ALL' | 'MIX_UP' | 'MULTIPLE_CHOICE',
  quizSource?: 'ALL' | 'BOOKMARK_QUIZ' | 'MY_QUIZ',
) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizzes,
    queryFn: () => getQuizzes(quizType, quizSource),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// 전체 퀴즈 기록 조회
export const useGetQuizzesRecords = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizzesRecords,
    queryFn: () => getQuizzesRecords(),
  })
}

// 퀴즈 주단위 분석
export const useGetQuizWeeklyAnalysis = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizWeeklyAnalysis,
    queryFn: () => getQuizWeeklyAnalysis(startDate, endDate),
  })
}

// 퀴즈 월단위 분석
export const useGetQuizMonthlyAnalysis = (month?: string) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizMonthlyAnalysis,
    queryFn: () => getQuizMonthlyAnalysis(month),
  })
}

// 퀴즈 세트 가져오기
export const useGetQuizSet = (quizSetId: number) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizSet(quizSetId),
    queryFn: () => getQuizSet(quizSetId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// 퀴즈 세트에 대한 상세 기록
export const useGetSingleQuizSetRecord = (quizSetId: number) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getSingleQuizSetRecord(quizSetId),
    queryFn: () => getSingleQuizSetRecord(quizSetId),
  })
}

// 데일리 퀴즈 연속일 현황
export const useGetConsecutiveSolvedDailyQuiz = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.getConsecutiveSolvedDailyQuiz,
    queryFn: () => getConsecutiveSolvedDailyQuiz(),
    select: (data) => data.currentConsecutiveDays,
  })
}

// 월별 데일리 퀴즈 연속일 기록
export const useGetConsecutiveSolvedQuizSetDates = (solvedDate: string) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getConsecutiveSolvedQuizSetDates(solvedDate),
    queryFn: () => getConsecutiveSolvedQuizSetDates(solvedDate),
  })
}

// 데일리 퀴즈에 대한 상세 기록
export const useGetSingleDailyQuizRecord = (dailyQuizRecordId: number) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getSingleDailyQuizRecord(dailyQuizRecordId),
    queryFn: () => getSingleDailyQuizRecord(dailyQuizRecordId),
  })
}

// POST 훅

// 데일리 퀴즈 풀기
export const useCreateDailyQuizRecord = () => {
  return useMutation({
    mutationKey: QUIZ_KEYS.createDailyQuizRecord(),
    mutationFn: (data: Parameters<typeof createDailyQuizRecord>[0]) => createDailyQuizRecord(data),
  })
}

// 퀴즈 시작하기 (퀴즈 세트 생성)
export const useCreateQuizSet = (documentId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.createQuizSet(documentId),
    mutationFn: (data: Parameters<typeof createQuizSet>[1]) => createQuizSet(documentId, data),
  })
}

// PATCH 훅

// 퀴즈 오답 확인(이해했습니다)
export const useUpdateWrongAnswerConfirm = (quizId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.updateWrongAnswerConfirm(quizId),
    mutationFn: () => updateWrongAnswerConfirm(quizId),
  })
}

// 퀴즈 정보 변경
export const useUpdateQuizInfo = (quizId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.updateQuizInfo(quizId),
    mutationFn: (data: Parameters<typeof updateQuizInfo>[1]) => updateQuizInfo(quizId, data),
  })
}

// 퀴즈 세트 결과 업데이트
export const useUpdateQuizResult = (documentId: number, quizSetId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.updateQuizResult(documentId, quizSetId),
    mutationFn: (data: Parameters<typeof updateQuizResult>[2]) => updateQuizResult(documentId, quizSetId, data),
  })
}

// DELETE 훅

// 퀴즈 삭제
export const useDeleteQuiz = (quizId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.deleteQuiz(quizId),
    mutationFn: () => deleteQuiz(quizId),
  })
}
