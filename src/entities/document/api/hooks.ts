import { useMutation, useQuery } from '@tanstack/react-query'

import { DOCUMENT_KEYS } from './config'
import {
  addQuizzes,
  createDocument,
  downloadQuiz,
  getAllDocuments,
  getDocumentQuizzes,
  getDocumentsNeedingReview,
  getSingleDocument,
  moveDocument,
  searchDocument,
  updateDocumentContent,
  updateDocumentName,
} from './index'

export const useCreateDocument = () => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.createDocument,
    mutationFn: (data: Parameters<typeof createDocument>[0]) => createDocument(data),
  })
}

export const useSearchDocument = (params: { keyword: string }) => {
  return useMutation({
    mutationKey: [DOCUMENT_KEYS.searchDocument, params],
    mutationFn: () => searchDocument(params),
  })
}

export const useGetSingleDocument = (documentId: number) => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getSingleDocument(documentId),
    queryFn: () => getSingleDocument(documentId),
  })
}

export const useAddQuizzes = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.addQuizzes(documentId),
    mutationFn: (data: Parameters<typeof addQuizzes>[1]) => addQuizzes(documentId, data),
  })
}

export const useGetDocumentQuizzes = ({
  documentId,
  quizType,
}: {
  documentId: number
  quizType?: 'MIX_UP' | 'MULTIPLE_CHOICE'
}) => {
  return useQuery({
    queryKey: [...DOCUMENT_KEYS.getDocumentQuizzes(documentId), quizType],
    queryFn: () => getDocumentQuizzes(documentId, quizType),
  })
}

export const useGetAllDocuments = (options?: { directoryId?: number; sortOption?: 'CREATED_AT' | 'UPDATED_AT' }) => {
  return useQuery({
    queryKey: [DOCUMENT_KEYS.getAllDocuments, options?.directoryId, options?.sortOption],
    queryFn: () => getAllDocuments(options),
  })
}

export const useDownloadQuiz = (documentId: number) => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.downloadQuiz(documentId),
    queryFn: () => downloadQuiz(documentId),
  })
}

export const useUpdateDocumentName = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.updateDocumentName(documentId),
    mutationFn: (data: Parameters<typeof updateDocumentName>[1]) => updateDocumentName(documentId, data),
  })
}

export const useUpdateDocumentContent = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.updateDocumentContent(documentId),
    mutationFn: (data: Parameters<typeof updateDocumentContent>[1]) => updateDocumentContent(documentId, data),
  })
}

export const useMoveDocument = () => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.moveDocument,
    mutationFn: (data: Parameters<typeof moveDocument>[0]) => moveDocument(data),
  })
}

export const useGetDocumentsNeedingReview = () => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getDocumentsNeedingReview,
    queryFn: () => getDocumentsNeedingReview(),
  })
}
