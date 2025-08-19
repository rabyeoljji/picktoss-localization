import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

import { GetDocumentResponse } from '@/entities/document/api'
import { DOCUMENT_KEYS } from '@/entities/document/api/config'

import { QUIZ_KEYS } from './config'
import {
  CreateQuizSetRequest,
  UpdateQuizInfoRequest,
  UpdateQuizResultRequest,
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
export const useGetQuizzes = (params?: {
  quizType?: 'ALL' | 'MIX_UP' | 'MULTIPLE_CHOICE'
  quizSource?: 'ALL' | 'BOOKMARK_QUIZ' | 'MY_QUIZ'
}) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizzes,
    queryFn: () => getQuizzes(params?.quizType, params?.quizSource),
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
    queryKey: QUIZ_KEYS.getQuizMonthlyAnalysis(month),
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
  const today = new Date()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: QUIZ_KEYS.createDailyQuizRecord,
    mutationFn: (data: Parameters<typeof createDailyQuizRecord>[0]) => createDailyQuizRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUIZ_KEYS.getConsecutiveSolvedDailyQuiz] })
      queryClient.invalidateQueries({
        queryKey: [...QUIZ_KEYS.getConsecutiveSolvedQuizSetDates(format(today, 'yyyy-MM-dd'))],
      })
    },
  })
}

// 퀴즈 시작하기 (퀴즈 세트 생성)
export const useCreateQuizSet = (documentId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.createQuizSet(documentId),
    mutationFn: (data: CreateQuizSetRequest) => createQuizSet(documentId, data),
  })
}

// PATCH 훅

// 퀴즈 오답 확인(이해했습니다)
export const useUpdateWrongAnswerConfirm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: QUIZ_KEYS.updateWrongAnswerConfirm,
    mutationFn: ({ noteId: _, quizId }: { noteId: number; quizId: number }) => updateWrongAnswerConfirm(quizId),
    onMutate: async ({ noteId, quizId }) => {
      await queryClient.setQueryData(DOCUMENT_KEYS.getDocument(noteId), (oldData: GetDocumentResponse) => ({
        ...oldData,
        quizzes: oldData.quizzes.map((quiz) => (quiz.id === quizId ? { ...quiz, reviewNeeded: false } : quiz)),
      }))
    },
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: [...DOCUMENT_KEYS.getDocument(noteId)] })
    },
  })
}

// 퀴즈 정보 변경
export const useUpdateQuizInfo = (quizId: number, noteId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: QUIZ_KEYS.updateQuizInfo(quizId),
    mutationFn: (data: UpdateQuizInfoRequest) => updateQuizInfo(quizId, data),
    onMutate: async (data: UpdateQuizInfoRequest) => {
      // 이전 쿼리 데이터를 캐시에서 가져옴
      const previousData = queryClient.getQueryData<GetDocumentResponse>(DOCUMENT_KEYS.getDocument(noteId))

      // 낙관적 업데이트 실행
      await queryClient.setQueryData(DOCUMENT_KEYS.getDocument(noteId), (oldData: GetDocumentResponse) => ({
        ...oldData,
        quizzes: oldData.quizzes.map((quiz) => (quiz.id === quizId ? { ...quiz, ...data } : quiz)),
      }))

      // 이전 데이터 반환하여 오류 발생 시 복원할 수 있도록 함
      return { previousData }
    },
    onSuccess: () => {
      // 성공 시 서버에서 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: [...DOCUMENT_KEYS.getDocument(noteId)] })
    },
    onError: (_, __, context) => {
      // 실패 시 이전 상태로 복원
      if (context?.previousData) {
        queryClient.setQueryData(DOCUMENT_KEYS.getDocument(noteId), context.previousData)
      }
    },
  })
}

// 퀴즈 세트 결과 업데이트
export const useUpdateQuizResult = (documentId: number, quizSetId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: QUIZ_KEYS.updateQuizResult(documentId, quizSetId),
    mutationFn: (data: UpdateQuizResultRequest) => updateQuizResult(documentId, quizSetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...DOCUMENT_KEYS.getDocument(documentId)],
      })
      queryClient.invalidateQueries({
        queryKey: [...QUIZ_KEYS.getQuizzesRecords],
      })
    },
  })
}

// DELETE 훅

// 퀴즈 삭제
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: QUIZ_KEYS.deleteQuiz,
    mutationFn: ({ documentId: _, quizId }: { documentId: number; quizId: number }) => deleteQuiz(quizId),
    onMutate: async ({ documentId, quizId }) => {
      await queryClient.setQueryData(DOCUMENT_KEYS.getDocument(documentId), (oldData: GetDocumentResponse) => ({
        ...oldData,
        quizzes: oldData.quizzes.filter((quiz) => quiz.id !== quizId),
      }))
    },
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({
        queryKey: [...DOCUMENT_KEYS.getDocument(documentId)],
      })
      queryClient.invalidateQueries({
        queryKey: [...DOCUMENT_KEYS.getPublicDocuments],
      })
    },
  })
}
