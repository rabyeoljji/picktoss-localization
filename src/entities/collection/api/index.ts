import { client } from "@/shared/lib/axios/client"
import { COLLECTION_ENDPOINTS } from "./config"

// GET: 모든 컬렉션 조회 (탐색)
interface CollectionDto {
  id: number
  name: string
  emoji: string
  description: string
  bookmarkCount: number
  collectionCategory:
    | "IT"
    | "LAW"
    | "BUSINESS_ECONOMY"
    | "SOCIETY_POLITICS"
    | "LANGUAGE"
    | "MEDICINE_PHARMACY"
    | "ART"
    | "SCIENCE_ENGINEERING"
    | "HISTORY_PHILOSOPHY"
    | "OTHER"
  solvedMemberCount: number
  bookmarked: boolean
  totalQuizCount: number
  member: { creatorId: number; creatorName: string }
}

interface CollectionResponseDto {
  collections: CollectionDto[]
}

export const getAllCollections = async (params?: {
  "collection-sort-option"?: "POPULARITY" | "UPDATED"
  "collection-category"?: string[]
  "quiz-type"?: "MIX_UP" | "MULTIPLE_CHOICE"
  "quiz-count"?: number
}) => {
  const response = await client.get<CollectionResponseDto>(COLLECTION_ENDPOINTS.getAllCollections(), { params })
  return response.data
}

// GET: 컬렉션 카테고리 목록 조회
interface GetCollectionCategoriesResponse {
  collectionCategories: {
    collectionCategory:
      | "IT"
      | "LAW"
      | "BUSINESS_ECONOMY"
      | "SOCIETY_POLITICS"
      | "LANGUAGE"
      | "MEDICINE_PHARMACY"
      | "ART"
      | "SCIENCE_ENGINEERING"
      | "HISTORY_PHILOSOPHY"
      | "OTHER"
    categoryName: string
    emoji: string
    collections: { id: number; name: string }[]
  }[]
}

export const getCollectionCategories = async () => {
  const response = await client.get<GetCollectionCategoriesResponse>(COLLECTION_ENDPOINTS.getCollectionCategories())
  return response.data
}

// GET: 북마크한 컬렉션 조회
export const getBookmarkedCollections = async () => {
  const response = await client.get<CollectionResponseDto>(COLLECTION_ENDPOINTS.getBookmarkedCollections())
  return response.data
}

// GET: 사용자 관심 분야 컬렉션 조회
export const getInterestCategoryCollections = async () => {
  const response = await client.get<CollectionResponseDto>(COLLECTION_ENDPOINTS.getInterestCategoryCollections())
  return response.data
}

// GET: 컬렉션 검색하기 (경로 파라미터 사용)
export const searchCollections = async (keyword: string) => {
  const response = await client.get<CollectionResponseDto>(COLLECTION_ENDPOINTS.searchCollections(keyword))
  return response.data
}

// GET: 컬렉션 상세 정보 가져오기
interface GetSingleCollectionResponse extends CollectionDto {
  quizzes: {
    id: number
    question: string
    answer: string
    explanation: string
    options: string[]
    quizType: "MIX_UP" | "MULTIPLE_CHOICE"
  }[]
}

export const getCollectionInfoByCollectionId = async (collectionId: number) => {
  const response = await client.get<GetSingleCollectionResponse>(
    COLLECTION_ENDPOINTS.getCollectionInfoByCollectionId(collectionId),
  )
  return response.data
}

// GET: 북마크하거나 소유한 컬렉션 분야별 퀴즈 조회
interface GetQuizzesInCollectionByCollectionCategoryResponse {
  quizzes: {
    id: number
    question: string
    answer: string
    explanation: string
    options: string[]
    quizType: "MIX_UP" | "MULTIPLE_CHOICE"
    collection: { id: number; name: string }
  }[]
}

export const getQuizzesInCollectionByCollectionCategory = async (collectionCategory: string) => {
  const response = await client.get<GetQuizzesInCollectionByCollectionCategoryResponse>(
    COLLECTION_ENDPOINTS.getQuizzesInCollectionByCollectionCategory(collectionCategory),
  )
  return response.data
}

// GET: 해당 quizId가 컬렉션에 포함되어 있는지 확인하기
interface GetCollectionContainingQuizResponse {
  collections: {
    id: number
    name: string
    emoji: string
    collectionCategory: string
    isQuizIncluded: boolean
  }[]
}

export const getCollectionContainingQuiz = async (quizId: number) => {
  const response = await client.get<GetCollectionContainingQuizResponse>(
    COLLECTION_ENDPOINTS.getCollectionContainingQuiz(quizId),
  )
  return response.data
}

// GET: 직접 생성한 컬렉션 조회
export const getMyCollections = async () => {
  const response = await client.get<CollectionResponseDto>(COLLECTION_ENDPOINTS.getMyCollections())
  return response.data
}

// POST: 컬렉션 생성
interface CreateCollectionRequest {
  name: string
  emoji: string
  description: string
  collectionCategory:
    | "IT"
    | "LAW"
    | "BUSINESS_ECONOMY"
    | "SOCIETY_POLITICS"
    | "LANGUAGE"
    | "MEDICINE_PHARMACY"
    | "ART"
    | "SCIENCE_ENGINEERING"
    | "HISTORY_PHILOSOPHY"
    | "OTHER"
  quizzes: number[]
}

interface CreateCollectionResponse {
  collectionId: number
}

export const createCollection = async (data: CreateCollectionRequest) => {
  const response = await client.post<CreateCollectionResponse>(COLLECTION_ENDPOINTS.createCollection(), data)
  return response.data
}

// POST: 컬렉션 북마크 추가
export const createCollectionBookmark = async (collectionId: number) => {
  const response = await client.post<void>(COLLECTION_ENDPOINTS.createCollectionBookmark(collectionId))
  return response.data
}

// POST: 컬렉션 신고하기
interface CreateCollectionComplaintRequest {
  files?: File[]
  content: string
}

export const createCollectionComplaint = async (collectionId: number, data: CreateCollectionComplaintRequest) => {
  const formData = new FormData()
  formData.append("content", data.content)
  if (data.files) {
    data.files.forEach((file) => formData.append("files", file))
  }
  const response = await client.post<void>(COLLECTION_ENDPOINTS.createCollectionComplaint(collectionId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

// POST: 컬렉션 퀴즈 시작하기
export const createCollectionQuizSet = async (collectionId: number) => {
  const response = await client.post<void>(COLLECTION_ENDPOINTS.createCollectionQuizSet(collectionId))
  return response.data
}

// PATCH: 컬렉션 문제 편집
interface UpdateCollectionQuizzesRequest {
  quizzes: number[]
}

export const updateCollectionQuizzes = async (collectionId: number, data: UpdateCollectionQuizzesRequest) => {
  const response = await client.patch<void>(COLLECTION_ENDPOINTS.updateCollectionQuizzes(collectionId), data)
  return response.data
}

// PATCH: 컬렉션 정보 수정
interface UpdateCollectionInfoRequest {
  name: string
  emoji: string
  description: string
  collectionCategory:
    | "IT"
    | "LAW"
    | "BUSINESS_ECONOMY"
    | "SOCIETY_POLITICS"
    | "LANGUAGE"
    | "MEDICINE_PHARMACY"
    | "ART"
    | "SCIENCE_ENGINEERING"
    | "HISTORY_PHILOSOPHY"
    | "OTHER"
}

export const updateCollectionInfo = async (collectionId: number, data: UpdateCollectionInfoRequest) => {
  const response = await client.patch<void>(COLLECTION_ENDPOINTS.updateCollectionInfo(collectionId), data)
  return response.data
}

// PATCH: 컬렉션 랜덤 퀴즈 결과 업데이트
interface UpdateRandomQuizResultRequest {
  quizzes: { id: number; answer: boolean }[]
}

export const updateCollectionRandomQuizResult = async ({ data }: { data: UpdateRandomQuizResultRequest }) => {
  const response = await client.patch<void>(COLLECTION_ENDPOINTS.updateCollectionRandomQuizResult(), data)
  return response.data
}

// PATCH: 컬렉션에 퀴즈 추가
interface AddQuizToCollectionRequest {
  quizId: number
}

export const addQuizToCollection = async (collectionId: number, data: AddQuizToCollectionRequest) => {
  const response = await client.patch<void>(COLLECTION_ENDPOINTS.addQuizToCollection(collectionId), data)
  return response.data
}

// DELETE: 컬렉션 삭제
export const deleteCollection = async (collectionId: number) => {
  const response = await client.delete<void>(COLLECTION_ENDPOINTS.deleteCollection(collectionId))
  return response.data
}

// DELETE: 컬렉션 북마크 취소
export const deleteCollectionBookmark = async (collectionId: number) => {
  const response = await client.delete<void>(COLLECTION_ENDPOINTS.deleteCollectionBookmark(collectionId))
  return response.data
}
