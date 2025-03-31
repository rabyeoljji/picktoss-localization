import { useMutation, useQuery } from '@tanstack/react-query'

import { QUIZ_KEYS } from './config'
import {
  createErrorCheckQuizSet,
  createMemberGeneratedQuizSet,
  createTodayQuizForTest,
  getCurrentTodayQuizInfo,
  getQuizSetToday,
  getSingleQuizRecordByDate,
  getSingleQuizSetRecord,
  getTodaySolvedQuizCount,
  updateQuizResult,
  updateRandomQuizResult,
} from './index'

export const useCreateTodayQuizForTest = () => {
  return useMutation({
    mutationKey: QUIZ_KEYS.postTestCreateTodayQuiz,
    mutationFn: () => createTodayQuizForTest(),
  })
}

export const useCreateMemberGeneratedQuizSet = (documentId: number) => {
  return useMutation({
    mutationKey: QUIZ_KEYS.postMemberGeneratedQuizSet(documentId),
    mutationFn: (data: Parameters<typeof createMemberGeneratedQuizSet>[1]) =>
      createMemberGeneratedQuizSet(documentId, data),
  })
}

export const useCreateErrorCheckQuizSet = () => {
  return useMutation({
    mutationKey: QUIZ_KEYS.postErrorCheckQuizSet(),
    mutationFn: (documentId: number) => createErrorCheckQuizSet(documentId),
  })
}

export const useUpdateRandomQuizResult = () => {
  return useMutation({
    mutationKey: QUIZ_KEYS.patchRandomQuizResult,
    mutationFn: ({ data }: { data: Parameters<typeof updateRandomQuizResult>[0]['data'] }) =>
      updateRandomQuizResult({ data }),
  })
}

export const useUpdateQuizResult = () => {
  return useMutation({
    mutationKey: QUIZ_KEYS.patchQuizResult,
    mutationFn: ({ data }: { data: Parameters<typeof updateQuizResult>[0]['data'] }) => updateQuizResult({ data }),
  })
}

export const useGetCurrentTodayQuizInfo = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.getCurrentTodayQuizInfo,
    queryFn: () => getCurrentTodayQuizInfo(),
  })
}

export const useGetTodaySolvedQuizCount = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.getTodaySolvedQuizCount,
    queryFn: () => getTodaySolvedQuizCount(),
  })
}

export const useGetSingleQuizRecordByDate = (solvedDate: string) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getSingleQuizRecordByDate(solvedDate),
    queryFn: () => getSingleQuizRecordByDate(solvedDate),
  })
}

export const useGetSingleQuizSetRecord = (
  quizSetId: string,
  quizSetType: 'TODAY_QUIZ_SET' | 'DOCUMENT_QUIZ_SET' | 'COLLECTION_QUIZ_SET' | 'FIRST_QUIZ_SET',
) => {
  return useQuery({
    queryKey: QUIZ_KEYS.getSingleQuizSetRecord(quizSetId, quizSetType),
    queryFn: () => getSingleQuizSetRecord(quizSetId, quizSetType),
  })
}

export const useGetQuizSetToday = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.getQuizSetToday,
    queryFn: () => getQuizSetToday(),
  })
}
