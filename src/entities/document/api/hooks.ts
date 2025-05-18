import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DOCUMENT_KEYS } from './config'
import {
  CreateQuizzesRequest,
  DeleteDocumentRequest,
  GetSingleDocumentResponse,
  SearchDocumentsResponse,
  SearchPublicDocumentsResponse,
  UpdateDocumentContentRequest,
  UpdateDocumentEmojiRequest,
  UpdateDocumentNameRequest,
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

export const useSearchDocument = (
  params: { keyword: string },
  options?: Omit<UseQueryOptions<SearchDocumentsResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [DOCUMENT_KEYS.searchDocument, params],
    queryFn: () => searchDocument(params),
    ...options,
  })
}

export const useGetSingleDocument = (documentId: number) => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getSingleDocument(documentId),
    queryFn: () => getSingleDocument(documentId),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export const useAddQuizzes = () => {
  return useMutation({
    mutationKey: DOCUMENT_KEYS.addQuizzes,
    mutationFn: ({ documentId, data }: { documentId: number; data: CreateQuizzesRequest }) =>
      addQuizzes(documentId, data),
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

export const useUpdateDocumentName = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentId, data }: { documentId: number; data: UpdateDocumentNameRequest }) =>
      updateDocumentName(documentId, data),
    onMutate: ({ documentId, data }) => {
      queryClient.setQueryData(DOCUMENT_KEYS.getSingleDocument(documentId), (oldData: Document) => ({
        ...oldData,
        name: data.name,
      }))
    },
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getSingleDocument(documentId) })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getAllDocuments })
    },
  })
}

export const useUpdateDocumentContent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentId, data }: { documentId: number; data: UpdateDocumentContentRequest }) =>
      updateDocumentContent(documentId, data),
    onMutate: ({ documentId, data }) => {
      queryClient.setQueryData(DOCUMENT_KEYS.getSingleDocument(documentId), (oldData: Document) => ({
        ...oldData,
        content: data.file,
      }))
    },
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getSingleDocument(documentId) })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getAllDocuments })
    },
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

export const useGetPublicSingleDocument = (documentId: number) => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getPublicSingleDocument(documentId),
    queryFn: () => getPublicSingleDocument(documentId),
    enabled: !!documentId,
  })
}

export const useSearchPublicDocuments = (
  params: { keyword: string },
  options?: Omit<UseQueryOptions<SearchPublicDocumentsResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: [DOCUMENT_KEYS.searchPublicDocuments, params],
    queryFn: () => searchPublicDocuments(params),
    ...options,
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
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.searchPublicDocuments] })
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
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEYS.searchPublicDocuments] })
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

export const useUpdateDocumentEmoji = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentId, data }: { documentId: number; data: UpdateDocumentEmojiRequest }) =>
      updateDocumentEmoji(documentId, data),
    onMutate: async ({ documentId, data }) => {
      await queryClient.cancelQueries({ queryKey: DOCUMENT_KEYS.getSingleDocument(documentId) })

      const previousData = queryClient.getQueryData(
        DOCUMENT_KEYS.getSingleDocument(documentId),
      ) as GetSingleDocumentResponse

      queryClient.setQueryData(DOCUMENT_KEYS.getSingleDocument(documentId), {
        ...previousData,
        emoji: data.emoji,
      })

      return { previousData, documentId }
    },
    onError: (_, { documentId }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(DOCUMENT_KEYS.getSingleDocument(documentId), context.previousData)
      }
    },
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getSingleDocument(documentId) })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getAllDocuments })
    },
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
    mutationFn: (data: DeleteDocumentRequest) => deleteDocument(data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [DOCUMENT_KEYS.getAllDocuments, options?.directoryId, options?.sortOption],
      })
    },
  })
}
