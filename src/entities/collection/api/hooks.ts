import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getAllCollections,
  getCollectionCategories,
  getBookmarkedCollections,
  getInterestCategoryCollections,
  searchCollections,
  getCollectionInfoByCollectionId,
  getQuizzesInCollectionByCollectionCategory,
  getCollectionContainingQuiz,
  getMyCollections,
  createCollection,
  createCollectionBookmark,
  createCollectionComplaint,
  createCollectionQuizSet,
  updateCollectionQuizzes,
  updateCollectionInfo,
  updateCollectionRandomQuizResult,
  addQuizToCollection,
  deleteCollection,
  deleteCollectionBookmark,
} from "./index"
import { COLLECTION_KEYS } from "./config"

interface GetAllCollectionsParams {
  "collection-sort-option"?: "POPULARITY" | "UPDATED"
  "collection-category"?: string[]
  "quiz-type"?: "MIX_UP" | "MULTIPLE_CHOICE"
  "quiz-count"?: number
}

export const useGetAllCollections = (params?: GetAllCollectionsParams) => {
  return useQuery({
    queryKey: [COLLECTION_KEYS.getAllCollections, params],
    queryFn: () => getAllCollections(params),
  })
}

export const useGetCollectionCategories = () => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getCollectionCategories,
    queryFn: () => getCollectionCategories(),
  })
}

export const useGetBookmarkedCollections = () => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getBookmarkedCollections,
    queryFn: () => getBookmarkedCollections(),
  })
}

export const useGetInterestCategoryCollections = () => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getInterestCategoryCollections,
    queryFn: () => getInterestCategoryCollections(),
  })
}

export const useSearchCollections = (keyword: string) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.searchCollections(keyword),
    queryFn: () => searchCollections(keyword),
  })
}

export const useGetCollectionInfoByCollectionId = (collectionId: number) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getCollectionInfoByCollectionId(collectionId),
    queryFn: () => getCollectionInfoByCollectionId(collectionId),
  })
}

export const useGetQuizzesInCollectionByCollectionCategory = (collectionCategory: string) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getQuizzesInCollectionByCollectionCategory(collectionCategory),
    queryFn: () => getQuizzesInCollectionByCollectionCategory(collectionCategory),
  })
}

export const useGetCollectionContainingQuiz = (quizId: number) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getCollectionContainingQuiz(quizId),
    queryFn: () => getCollectionContainingQuiz(quizId),
  })
}

export const useGetMyCollections = () => {
  return useQuery({
    queryKey: COLLECTION_KEYS.getMyCollections,
    queryFn: () => getMyCollections(),
  })
}

export const useCreateCollection = () => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.createCollection,
    mutationFn: (data: Parameters<typeof createCollection>[0]) => createCollection(data),
  })
}

export const useCreateCollectionBookmark = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.createCollectionBookmark(collectionId),
    mutationFn: () => createCollectionBookmark(collectionId),
  })
}

export const useCreateCollectionComplaint = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.createCollectionComplaint(collectionId),
    mutationFn: (data: Parameters<typeof createCollectionComplaint>[1]) =>
      createCollectionComplaint(collectionId, data),
  })
}

export const useCreateCollectionQuizSet = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.createCollectionQuizSet(collectionId),
    mutationFn: () => createCollectionQuizSet(collectionId),
  })
}

export const useUpdateCollectionQuizzes = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.updateCollectionQuizzes(collectionId),
    mutationFn: (data: Parameters<typeof updateCollectionQuizzes>[1]) => updateCollectionQuizzes(collectionId, data),
  })
}

export const useUpdateCollectionInfo = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.updateCollectionInfo(collectionId),
    mutationFn: (data: Parameters<typeof updateCollectionInfo>[1]) => updateCollectionInfo(collectionId, data),
  })
}

export const useUpdateCollectionRandomQuizResult = () => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.updateCollectionRandomQuizResult,
    mutationFn: ({ data }: { data: Parameters<typeof updateCollectionRandomQuizResult>[0]["data"] }) =>
      updateCollectionRandomQuizResult({ data }),
  })
}

export const useAddQuizToCollection = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.addQuizToCollection(collectionId),
    mutationFn: (data: Parameters<typeof addQuizToCollection>[1]) => addQuizToCollection(collectionId, data),
  })
}

export const useDeleteCollection = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.deleteCollection(collectionId),
    mutationFn: () => deleteCollection(collectionId),
  })
}

export const useDeleteCollectionBookmark = (collectionId: number) => {
  return useMutation({
    mutationKey: COLLECTION_KEYS.deleteCollectionBookmark(collectionId),
    mutationFn: () => deleteCollectionBookmark(collectionId),
  })
}
