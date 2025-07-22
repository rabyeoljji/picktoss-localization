import { client } from '@/shared/lib/axios/client'

import { DOCUMENT_ENDPOINTS } from './config'

// 문서 생성
export interface CreateDocumentPayload {
  file: File | Blob
  isPublic: boolean
  star: string
  documentType: 'FILE' | 'TEXT'
}

export interface CreateDocumentResponse {
  id: number
}

export const createDocument = async (data: CreateDocumentPayload): Promise<CreateDocumentResponse> => {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('isPublic', String(data.isPublic))
  formData.append('star', data.star)
  formData.append('documentType', data.documentType)

  const response = await client.post<CreateDocumentResponse>(DOCUMENT_ENDPOINTS.createDocument, formData, {
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
  })
  return response.data
}

// 모든 문서 가져오기
export interface GetAllDocumentsDocumentDto {
  id: number
  name: string
  emoji: string
  previewContent: string
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
  isPublic: boolean
  reviewNeededQuizCount: number
}

export interface GetAllDocumentsResponse {
  documents: GetAllDocumentsDocumentDto[]
}

export type SortOption = 'CREATED_AT' | 'NAME' | 'QUIZ_COUNT' | 'WRONG_ANSWER_COUNT'

export const getAllDocuments = async (options?: {
  sortOption?: 'CREATED_AT' | 'NAME' | 'QUIZ_COUNT' | 'WRONG_ANSWER_COUNT'
}): Promise<GetAllDocumentsResponse> => {
  const params = options?.sortOption ? { 'sort-option': options.sortOption } : undefined
  const response = await client.get<GetAllDocumentsResponse>(DOCUMENT_ENDPOINTS.getAllDocuments, { params })
  return response.data
}

// 단일 문서 가져오기
export interface GetSingleDocumentQuizDto {
  id: number
  question: string
  answer: string
  explanation: string
  options: string[]
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
  reviewNeeded: boolean
}

export interface GetSingleDocumentResponse {
  id: number
  name: string
  emoji: string
  content: string
  category: string
  isPublic: boolean
  bookmarkCount: number
  characterCount: number
  totalQuizCount: number
  createdAt: string
  documentType: 'FILE' | 'TEXT' | 'NOTION'
  quizGenerationStatus:
    | 'UNPROCESSED'
    | 'PROCESSED'
    | 'PROCESSING'
    | 'COMPLETELY_FAILED'
    | 'PARTIAL_SUCCESS'
    | 'QUIZ_GENERATION_ERROR'
  quizzes: GetSingleDocumentQuizDto[]
  reviewNeeded: boolean
}

export const getSingleDocument = async (documentId: number): Promise<GetSingleDocumentResponse> => {
  const response = await client.get<GetSingleDocumentResponse>(DOCUMENT_ENDPOINTS.getSingleDocument(documentId))
  return response.data
}

// 사용자의 비공개된 모든 문서 가져오기
export interface GetIsNotPublicDocumentsResponse {
  documents: [
    {
      id: number
      name: string
      emoji: string
      previewContent: string
      isPublic: boolean
      totalQuizCount: number
    },
  ]
}

export const getIsNotPublicDocuments = async (): Promise<GetIsNotPublicDocumentsResponse> => {
  const response = await client.get<GetIsNotPublicDocumentsResponse>(DOCUMENT_ENDPOINTS.getIsNotPublicDocuments)
  return response.data
}

// 북마크된 모든 문서 가져오기
export interface GetBookmarkedDocumentsDto {
  id: number
  name: string
  emoji: string
  previewContent: string
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
}

export interface GetBookmarkedDocumentsResponse {
  documents: GetBookmarkedDocumentsDto[]
}

export type BookmarkedSortOption = 'CREATED_AT' | 'NAME' | 'QUIZ_COUNT'

export const getBookmarkedDocuments = async (options?: {
  sortOption?: 'CREATED_AT' | 'NAME' | 'QUIZ_COUNT'
}): Promise<GetBookmarkedDocumentsResponse> => {
  const params = options?.sortOption ? { 'sort-option': options.sortOption } : undefined
  const response = await client.get<GetBookmarkedDocumentsResponse>(DOCUMENT_ENDPOINTS.getBookmarkedDocuments, {
    params,
  })
  return response.data
}

// 공개된 문서 탐색
export interface GetPublicDocumentsDto {
  id: number
  name: string
  emoji: string
  creator: string
  category: string
  previewContent: string
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
  isBookmarked: boolean
  isOwner: boolean
  quizzes: { id: number; question: string }[]
}

export interface GetPublicDocumentsResponse {
  totalPages: number
  totalDocuments: number
  documents: GetPublicDocumentsDto[]
}

export const getPublicDocuments = async (options?: {
  categoryId?: number
  page?: number
  pageSize?: number
}): Promise<GetPublicDocumentsResponse> => {
  const params: Record<string, string | number> = {}
  if (options?.categoryId) params['category-id'] = options.categoryId
  if (options?.page !== undefined) params['page'] = options.page
  if (options?.pageSize !== undefined) params['page-size'] = options.pageSize

  const response = await client.get<GetPublicDocumentsResponse>(DOCUMENT_ENDPOINTS.getPublicDocuments, { params })
  return response.data
}

// 공개된 문서 정보 조회(+ 상세정보)
export interface GetPublicSingleDocumentQuizDto {
  id: number
  answer: string
  question: string
  explanation: string
  options: string[]
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
}

export interface GetPublicSingleDocumentResponse {
  id: number
  creator: string
  name: string
  emoji: string
  category: string
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
  isBookmarked: boolean
  createdAt: string
  quizzes: GetPublicSingleDocumentQuizDto[]
  isOwner: boolean
}

export const getPublicSingleDocument = async (
  documentId: number,
  sortOption?: 'CREATED_AT' | 'LOWEST_ACCURACY',
): Promise<GetPublicSingleDocumentResponse> => {
  const params = sortOption ? { 'sort-option': sortOption } : undefined

  const response = await client.get<GetPublicSingleDocumentResponse>(
    DOCUMENT_ENDPOINTS.getPublicSingleDocument(documentId),
    { params },
  )
  return response.data
}

// 문서 검색
export interface SearchRequest {
  keyword: string
}

export interface SearchDocumentsQuizDto {
  question: string
  answer: string
  explanation: string
}

export interface SearchDocumentsDto {
  id: number
  name: string
  emoji: string
  content: string
  isPublic: boolean
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
  quizzes: SearchDocumentsQuizDto[]
}

export interface SearchBookmarkDocumentsDto {
  id: number
  name: string
  emoji: string
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
  quizzes: SearchDocumentsQuizDto[]
}

export interface SearchDocumentsResponse {
  documents: SearchDocumentsDto[]
  bookmarkedDocuments: SearchBookmarkDocumentsDto[]
}

export const searchDocument = async (data: SearchRequest): Promise<SearchDocumentsResponse> => {
  const response = await client.post<SearchDocumentsResponse>(DOCUMENT_ENDPOINTS.searchDocument, data)
  return response.data
}

// 공개된 문서 검색
export interface SearchPublicDocumentsDto {
  id: number
  name: string
  emoji: string
  category: string
  creatorName: string
  isOwner: boolean
  isBookmarked: boolean
  tryCount: number
  bookmarkCount: number
  totalQuizCount: number
}

export interface SearchPublicDocumentsResponse {
  publicDocuments: SearchPublicDocumentsDto[]
}

export const searchPublicDocuments = async (data: SearchRequest): Promise<SearchPublicDocumentsResponse> => {
  const response = await client.post<SearchPublicDocumentsResponse>(DOCUMENT_ENDPOINTS.searchPublicDocuments, data)
  return response.data
}

// 문서 신고하기
export interface CreateDocumentComplaintRequest {
  files?: File[]
  content?: string
  complaintReason: 'OFF_TOPIC' | 'HARMFUL_CONTENT' | 'DEFAMATION_OR_COPYRIGHT' | 'PROFANITY_OR_HATE_SPEECH'
}

export const createDocumentComplaint = async (
  documentId: number,
  data: CreateDocumentComplaintRequest,
): Promise<void> => {
  const formData = new FormData()
  if (data.files) {
    data.files.forEach((file) => {
      formData.append('files', file)
    })
  }
  if (data.content) {
    formData.append('content', data.content)
  }
  formData.append('complaintReason', data.complaintReason)

  const response = await client.post<void>(DOCUMENT_ENDPOINTS.createDocumentComplaint(documentId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// 북마크 하기
export const createDocumentBookmark = async (documentId: number): Promise<void> => {
  const response = await client.post<void>(DOCUMENT_ENDPOINTS.createDocumentBookmark(documentId))
  return response.data
}

// 북마크 취소
export const deleteDocumentBookmark = async (documentId: number): Promise<void> => {
  const response = await client.delete<void>(DOCUMENT_ENDPOINTS.deleteDocumentBookmark(documentId))
  return response.data
}

// 문서에서 추가 퀴즈 생성
export interface CreateQuizzesRequest {
  star: number
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
}

export interface CreateQuizzesResponse {
  id: number
}

export const addQuizzes = async (documentId: number, data: CreateQuizzesRequest): Promise<CreateQuizzesResponse> => {
  const response = await client.post<CreateQuizzesResponse>(DOCUMENT_ENDPOINTS.addQuizzes(documentId), data)
  return response.data
}

// 퀴즈 시작하기 (퀴즈 세트 생성)
export interface CreateQuizSetRequest {
  quizCount: number
}

export interface CreateQuizSetResponse {
  quizSetId: number
}

export const createQuizSet = async (documentId: number, data: CreateQuizSetRequest): Promise<CreateQuizSetResponse> => {
  const response = await client.post<CreateQuizSetResponse>(DOCUMENT_ENDPOINTS.createQuizSet(documentId), data)
  return response.data
}

// 문서에 해당하는 모든 퀴즈 가져오기
export interface GetDocumentQuizzesResponse {
  quizzes: {
    id: number
    question: string
    answer: string
    explanation: string
    options: string[]
    quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
    document: {
      id: number
      name: string
    }
    directory: {
      id: number
      name: string
    }
  }[]
}

export const getDocumentQuizzes = async (documentId: number, quizType?: 'MIX_UP' | 'MULTIPLE_CHOICE') => {
  const url = DOCUMENT_ENDPOINTS.getDocumentQuizzes(documentId)
  const params = quizType ? { 'quiz-type': quizType } : undefined
  const response = await client.get<GetDocumentQuizzesResponse>(url, { params })
  return response.data
}

// 문서 공개여부 변경
export interface UpdateDocumentIsPublicRequest {
  isPublic: boolean
}

export const updateDocumentIsPublic = async (
  documentId: number,
  data: UpdateDocumentIsPublicRequest,
): Promise<void> => {
  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.updateDocumentIsPublic(documentId), data)
  return response.data
}

// 문서 이름 변경
export interface UpdateDocumentNameRequest {
  name: string
}

export const updateDocumentName = async (documentId: number, data: UpdateDocumentNameRequest): Promise<void> => {
  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.updateDocumentName(documentId), data)
  return response.data
}

// 문서 이모지 변경
export interface UpdateDocumentEmojiRequest {
  emoji: string
}

export const updateDocumentEmoji = async (documentId: number, data: UpdateDocumentEmojiRequest): Promise<void> => {
  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.updateDocumentEmoji(documentId), data)
  return response.data
}

// 문서 내용 업데이트
export interface UpdateDocumentContentRequest {
  name?: string
  file?: File | Blob
}

export const updateDocumentContent = async (documentId: number, data: UpdateDocumentContentRequest): Promise<void> => {
  const formData = new FormData()
  if (data.name) formData.append('name', data.name)
  if (data.file) formData.append('file', data.file)

  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.updateDocumentContent(documentId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// 문서 카테고리 변경
export interface UpdateDocumentCategoryRequest {
  categoryId: number
}

export const updateDocumentCategory = async (
  documentId: number,
  data: UpdateDocumentCategoryRequest,
): Promise<void> => {
  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.updateDocumentCategory(documentId), data)
  return response.data
}

// 복습 필수 문서 조회
export interface GetDocumentsNeedingReviewResponse {
  documents: {
    id: number
    documentName: string
    reviewNeededQuizCount: number
  }[]
}

export const getDocumentsNeedingReview = async (): Promise<GetDocumentsNeedingReviewResponse> => {
  const response = await client.get<GetDocumentsNeedingReviewResponse>(DOCUMENT_ENDPOINTS.getDocumentsNeedingReview)
  return response.data
}

// 문서 삭제
export interface DeleteDocumentRequest {
  documentIds: number[]
}

export const deleteDocument = async (data: DeleteDocumentRequest): Promise<void> => {
  const response = await client.delete<void>(DOCUMENT_ENDPOINTS.deleteDocument, { data })
  return response.data
}

// 퀴즈 다운로드
export interface DownloadQuizResponse {
  url: string
}

export const downloadQuiz = async (documentId: number): Promise<DownloadQuizResponse> => {
  const response = await client.get<DownloadQuizResponse>(DOCUMENT_ENDPOINTS.downloadQuiz(documentId))
  return response.data
}

// 문서 이동
export interface MoveDocumentRequest {
  documentIds: number[]
  directoryId: number
}

export const moveDocument = async (data: MoveDocumentRequest): Promise<void> => {
  await client.patch(DOCUMENT_ENDPOINTS.moveDocument, data)
}
