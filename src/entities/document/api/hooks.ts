import { UseQueryOptions, keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DOCUMENT_KEYS } from './config'
import {
  CreateDocumentPayload,
  CreateQuizzesRequest,
  DeleteDocumentRequest,
  GetAllDocumentsDocumentDto,
  GetBookmarkedDocumentsDto,
  GetBookmarkedDocumentsResponse,
  GetPublicDocumentsResponse,
  GetPublicSingleDocumentResponse,
  GetSingleDocumentResponse,
  SearchDocumentsResponse,
  SearchPublicDocumentsResponse,
  UpdateDocumentContentRequest,
  UpdateDocumentEmojiRequest,
  UpdateDocumentIsPublicRequest,
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
    mutationFn: (data: CreateDocumentPayload) => createDocument(data),
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
    select: (data) => ({
      ...data,
      quizzes: data.quizzes.sort((a, b) => b.id - a.id),
    }),
  })
}

export const useAddQuizzes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.addQuizzes,
    mutationFn: ({ documentId, data }: { documentId: number; data: CreateQuizzesRequest }) =>
      addQuizzes(documentId, data),
    onSuccess: (_, { documentId }) =>
      queryClient.invalidateQueries({
        queryKey: DOCUMENT_KEYS.getSingleDocument(documentId),
      }),
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
    select: (data) => data.quizzes.sort((a, b) => b.id - a.id),
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

export const useGetIsNotPublicDocuments = (queryOptions?: { enabled: boolean }) => {
  return useQuery({
    queryKey: DOCUMENT_KEYS.getIsNotPublicDocuments,
    queryFn: () => getIsNotPublicDocuments(),
    enabled: queryOptions?.enabled ?? true,
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
    select: (data) => ({
      ...data,
      documents: data.documents.map((doc) => ({
        ...doc,
        quizzes: doc.quizzes.sort((a, b) => b.id - a.id),
      })),
    }),
  })
}

export const useGetPublicSingleDocument = (documentId: number, sortOption?: 'CREATED_AT' | 'LOWEST_ACCURACY') => {
  return useQuery({
    queryKey: [DOCUMENT_KEYS.getPublicSingleDocument(documentId), sortOption],
    queryFn: () => getPublicSingleDocument(documentId, sortOption),
    enabled: !!documentId,
    select: (data) => ({
      ...data,
      quizzes: data.quizzes.sort((a, b) => b.id - a.id),
    }),
    placeholderData: keepPreviousData,
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

export const useDocumentBookmarkMutation = (documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ documentId, isBookmarked }: { documentId: number; isBookmarked: boolean }) => {
      if (isBookmarked) {
        return deleteDocumentBookmark(documentId)
      }
      return createDocumentBookmark(documentId)
    },
    onMutate: async ({ documentId, isBookmarked }) => {
      // 진행 중인 쿼리들 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [DOCUMENT_KEYS.getBookmarkedDocuments] }),
        queryClient.cancelQueries({ queryKey: [DOCUMENT_KEYS.getPublicDocuments] }),
        queryClient.cancelQueries({ queryKey: [DOCUMENT_KEYS.getPublicSingleDocument(documentId)] }),
        queryClient.cancelQueries({ queryKey: [DOCUMENT_KEYS.searchPublicDocuments] }),
      ])

      // 북마크된 문서 목록 낙관적 업데이트
      const previousBookmarkedDocuments = queryClient.getQueryData([DOCUMENT_KEYS.getBookmarkedDocuments])

      if (previousBookmarkedDocuments) {
        if (isBookmarked) {
          // 북마크 제거 시 - 목록에서 해당 문서 제거
          queryClient.setQueryData<GetBookmarkedDocumentsResponse>(
            [DOCUMENT_KEYS.getBookmarkedDocuments],
            (oldData) => {
              if (!oldData) return oldData
              return {
                ...oldData,
                documents: oldData.documents?.filter((doc) => doc.id !== documentId) || [],
              }
            },
          )
        } else {
          // 북마크 추가 시 - 공개 문서 목록에서 해당 문서를 찾아서 추가
          const publicDocuments = queryClient.getQueryData<GetPublicDocumentsResponse>([
            DOCUMENT_KEYS.getPublicDocuments,
          ])
          let documentToAdd: GetBookmarkedDocumentsDto | null = null

          // 공개 문서 목록에서 해당 문서 찾기
          if (publicDocuments?.documents) {
            const found = publicDocuments.documents.find((doc) => doc.id === documentId)
            if (found) {
              documentToAdd = {
                id: found.id,
                name: found.name,
                emoji: found.emoji,
                previewContent: found.previewContent,
                tryCount: found.tryCount,
                bookmarkCount: found.bookmarkCount + 1, // 북마크 추가이므로 +1
                totalQuizCount: found.totalQuizCount,
              }
            }
          }

          // 검색 결과에서도 찾아보기
          if (!documentToAdd) {
            const searchQueries = queryClient.getQueriesData<SearchPublicDocumentsResponse>({
              queryKey: [DOCUMENT_KEYS.searchPublicDocuments],
            })
            for (const [, data] of searchQueries) {
              const found = data?.publicDocuments?.find((doc) => doc.id === documentId)
              if (found) {
                documentToAdd = {
                  id: found.id,
                  name: found.name,
                  emoji: found.emoji,
                  previewContent: '', // SearchPublicDocumentsDto에는 previewContent가 없으므로 빈 문자열
                  tryCount: found.tryCount,
                  bookmarkCount: found.bookmarkCount + 1, // 북마크 추가이므로 +1
                  totalQuizCount: found.totalQuizCount,
                }
                break
              }
            }
          }

          if (documentToAdd) {
            queryClient.setQueryData<GetBookmarkedDocumentsResponse>(
              [DOCUMENT_KEYS.getBookmarkedDocuments],
              (oldData) => {
                if (!oldData) return { documents: [documentToAdd!] }
                return {
                  ...oldData,
                  documents: [documentToAdd!, ...(oldData.documents || [])],
                }
              },
            )
          }
        }
      }

      // 공개 문서 목록 낙관적 업데이트
      const previousPublicDocuments = queryClient.getQueryData([DOCUMENT_KEYS.getPublicDocuments])

      if (previousPublicDocuments) {
        queryClient.setQueryData<GetPublicDocumentsResponse>([DOCUMENT_KEYS.getPublicDocuments], (oldData) => {
          if (!oldData?.documents) return oldData
          return {
            ...oldData,
            documents: oldData.documents.map((doc) => {
              if (doc.id === documentId) {
                return {
                  ...doc,
                  isBookmarked: !isBookmarked,
                  bookmarkCount: isBookmarked ? (doc.bookmarkCount || 1) - 1 : (doc.bookmarkCount || 0) + 1,
                }
              }
              return doc
            }),
          }
        })
      }

      // 단일 문서 상세 정보 낙관적 업데이트
      const previousSingleDocument = queryClient.getQueryData<GetPublicSingleDocumentResponse>([
        DOCUMENT_KEYS.getPublicSingleDocument(documentId),
      ])

      if (previousSingleDocument) {
        queryClient.setQueryData<GetPublicSingleDocumentResponse>(
          [DOCUMENT_KEYS.getPublicSingleDocument(documentId)],
          (oldData) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              isBookmarked: !isBookmarked,
              bookmarkCount: isBookmarked ? (oldData.bookmarkCount || 1) - 1 : (oldData.bookmarkCount || 0) + 1,
            }
          },
        )
      }

      // 검색 결과 낙관적 업데이트
      const searchQueries = queryClient.getQueriesData<SearchPublicDocumentsResponse>({
        queryKey: [DOCUMENT_KEYS.searchPublicDocuments],
      })
      const previousSearchDataMap = new Map()

      searchQueries.forEach(([queryKey, data]) => {
        if (data?.publicDocuments) {
          previousSearchDataMap.set(queryKey, data)
          queryClient.setQueryData(queryKey, {
            ...data,
            publicDocuments: data.publicDocuments.map((doc) => {
              if (doc.id === documentId) {
                return {
                  ...doc,
                  isBookmarked: !isBookmarked,
                  bookmarkCount: isBookmarked ? (doc.bookmarkCount || 1) - 1 : (doc.bookmarkCount || 0) + 1,
                }
              }
              return doc
            }),
          })
        }
      })

      return {
        previousBookmarkedDocuments,
        previousPublicDocuments,
        previousSingleDocument,
        previousSearchDataMap,
      }
    },
    onError: (_, __, context) => {
      // 에러 발생 시 이전 데이터로 복구
      if (context?.previousBookmarkedDocuments) {
        queryClient.setQueryData([DOCUMENT_KEYS.getBookmarkedDocuments], context.previousBookmarkedDocuments)
      }
      if (context?.previousPublicDocuments) {
        queryClient.setQueryData([DOCUMENT_KEYS.getPublicDocuments], context.previousPublicDocuments)
      }
      if (context?.previousSingleDocument) {
        queryClient.setQueryData(
          [DOCUMENT_KEYS.getPublicSingleDocument(context.previousSingleDocument.id)],
          context.previousSingleDocument,
        )
      }
      if (context?.previousSearchDataMap) {
        context.previousSearchDataMap.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: async () => {
      // 모든 관련 쿼리 무효화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getBookmarkedDocuments }),
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicDocuments }),
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicSingleDocument(documentId) }),
        queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.searchPublicDocuments }),
      ])
    },
  })
}

export const useCreateDocumentBookmark = (documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.createDocumentBookmark(documentId),
    mutationFn: () => createDocumentBookmark(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getBookmarkedDocuments })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicDocuments })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicSingleDocument(documentId) })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.searchPublicDocuments })
    },
  })
}

export const useDeleteDocumentBookmark = (documentId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.deleteDocumentBookmark(documentId),
    mutationFn: () => deleteDocumentBookmark(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getBookmarkedDocuments })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicDocuments })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicSingleDocument(documentId) })
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.searchPublicDocuments })
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: DOCUMENT_KEYS.updateDocumentIsPublic(documentId),
    mutationFn: (data: UpdateDocumentIsPublicRequest) => updateDocumentIsPublic(documentId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getSingleDocument(documentId) })
      await queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicDocuments })
      await queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.getPublicSingleDocument(documentId) })
    },
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
  const queryKey = [DOCUMENT_KEYS.getAllDocuments, options?.directoryId, options?.sortOption]

  return useMutation({
    mutationKey: DOCUMENT_KEYS.deleteDocument,
    mutationFn: (data: DeleteDocumentRequest) => deleteDocument(data),
    onMutate: async ({ documentIds }) => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey })

      // 2. 이전 데이터 스냅샷 저장
      const previousData = queryClient.getQueryData(queryKey)

      // 3. 낙관적 업데이트 수행
      queryClient.setQueryData(queryKey, (oldData: { documents?: GetAllDocumentsDocumentDto[] } | undefined) => {
        if (!oldData) return { documents: [] }

        return {
          ...oldData,
          documents: oldData.documents?.filter((doc) => !documentIds.includes(doc.id)) || [],
        }
      })

      // 4. 롤백을 위한 컨텍스트 반환
      return { previousData }
    },
    onError: (_err, _variables, context) => {
      // 5. 오류 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      // 6. 확정된 후 쿼리 무효화
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
