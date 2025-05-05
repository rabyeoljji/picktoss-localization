import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DOCUMENT_KEYS } from './config'
import {
  addQuizzes,
  createDocument,
  createDocumentBookmark,
  createDocumentComplaint,
  createQuizSet,
  deleteDocument,
  deleteDocumentBookmark,
  downloadQuiz,
  getAllDocuments,
  getBookmarkedDocuments,
  getDocumentQuizzes,
  getDocumentsNeedingReview,
  getIsNotPublicDocuments,
  getPublicDocuments,
  getPublicSingleDocument,
  getSingleDocument,
  moveDocument,
  searchDocument,
  searchPublicDocuments,
  updateDocumentCategory,
  updateDocumentContent,
  updateDocumentEmoji,
  updateDocumentIsPublic,
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
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!documentId,
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
    select: (data) => data.quizzes,
  })
}

export const useGetAllDocuments = (options?: {
  directoryId?: number
  sortOption?: 'CREATED_AT' | 'NAME' | 'QUIZ_COUNT' | 'WRONG_ANSWER_COUNT'
}) => {
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

export const useGetIsNotPublicDocuments = () => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getIsNotPublicDocuments,
    queryFn: () => getIsNotPublicDocuments(),
  })
}

export const useGetBookmarkedDocuments = (options?: { sortOption?: 'CREATED_AT' | 'QUIZ_COUNT' }) => {
  return useQuery({
    queryKey: [DOCUMENT_KEYS.getBookmarkedDocuments, options?.sortOption],
    queryFn: () => getBookmarkedDocuments(options),
  })
}

export const useGetPublicDocuments = ({
  categoryId,
  page,
  pageSize,
  enabled,
}: {
  categoryId?: number
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: [DOCUMENT_KEYS.getPublicDocuments, categoryId, page],
    queryFn: () => getPublicDocuments({ categoryId, page, pageSize }),
    enabled: enabled ?? true,
  })
}
// export const useGetPublicDocuments = (options?: { categoryId?: number; page?: number; pageSize?: number }) => {
//   return useQuery({
//     queryKey: [DOCUMENT_KEYS.getPublicDocuments, options?.categoryId, options?.page],
//     queryFn: () => getPublicDocuments(options),
//   })
// }

export const useGetPublicSingleDocument = (documentId: number) => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getPublicSingleDocument(documentId),
    queryFn: () => getPublicSingleDocument(documentId),
    enabled: !!documentId,
  })
}

export const useSearchPublicDocuments = (params: { keyword: string }) => {
  return useMutation({
    mutationKey: [DOCUMENT_KEYS.searchPublicDocuments, params],
    mutationFn: () => searchPublicDocuments(params),
  })
}

export const useCreateDocumentComplaint = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.createDocumentComplaint(documentId),
    mutationFn: (data: Parameters<typeof createDocumentComplaint>[1]) => createDocumentComplaint(documentId, data),
  })
}

export const useCreateDocumentBookmark = (documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.createDocumentBookmark(documentId),
    mutationFn: () => createDocumentBookmark(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.getBookmarkedDocuments] })
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.getPublicDocuments] })
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.getPublicSingleDocument(documentId)] })
    },
  })
}

export const useDeleteDocumentBookmark = (documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.deleteDocumentBookmark(documentId),
    mutationFn: () => deleteDocumentBookmark(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.getBookmarkedDocuments] })
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.getPublicDocuments] })
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.getPublicSingleDocument(documentId)] })
    },
  })
}

export const useCreateQuizSet = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.createQuizSet(documentId),
    mutationFn: (data: Parameters<typeof createQuizSet>[1]) => createQuizSet(documentId, data),
  })
}

export const useUpdateDocumentIsPublic = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.updateDocumentIsPublic(documentId),
    mutationFn: (data: Parameters<typeof updateDocumentIsPublic>[1]) => updateDocumentIsPublic(documentId, data),
  })
}

export const useUpdateDocumentEmoji = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.updateDocumentEmoji(documentId),
    mutationFn: (data: Parameters<typeof updateDocumentEmoji>[1]) => updateDocumentEmoji(documentId, data),
  })
}

export const useUpdateDocumentCategory = (documentId: number) => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.updateDocumentCategory(documentId),
    mutationFn: (data: Parameters<typeof updateDocumentCategory>[1]) => updateDocumentCategory(documentId, data),
  })
}

export const useDeleteDocument = (options?: {
  directoryId?: number
  sortOption?: 'CREATED_AT' | 'NAME' | 'QUIZ_COUNT' | 'WRONG_ANSWER_COUNT'
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.deleteDocument,
    mutationFn: (data: Parameters<typeof deleteDocument>[0]) => deleteDocument(data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [DOCUMENT_KEYS.getAllDocuments, options?.directoryId, options?.sortOption],
      })
    },
  })
}
