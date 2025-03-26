import { client } from '@/shared/lib/axios/client'

import { DOCUMENT_ENDPOINTS } from './config'

// 문서 생성
export interface CreateDocumentRequest {
  file: File | Blob
  directoryId: string
  documentType: 'FILE' | 'TEXT' | 'NOTION'
  documentName: string
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
  star: string
}

interface CreateDocumentResponse {
  id: number
}

export const createDocument = async (data: CreateDocumentRequest): Promise<CreateDocumentResponse> => {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('directoryId', data.directoryId)
  formData.append('documentName', data.documentName)
  formData.append('star', data.star)
  formData.append('quizType', data.quizType)
  formData.append('documentType', data.documentType)
  const response = await client.post<CreateDocumentResponse>(DOCUMENT_ENDPOINTS.createDocument(), formData, {
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
  })
  return response.data
}

// 문서 검색
interface SearchRequest {
  keyword: string
}

interface SearchDocumentResponse {
  // API 스펙에 맞게 작성 – 예시로 document 목록만 포함
  documents: {
    documentId: number
    documentName: string
    content: string
    documentType: 'FILE' | 'TEXT'
    directory: {
      id: number
      name: 'string'
    }
  }[]

  quizzes: {
    id: number
    question: string
    answer: string
    documentId: number
    documentName: string
    documentType: 'FILE' | 'TEXT'
    directoryName: string
  }[]
}

export const searchDocument = async (data: SearchRequest): Promise<SearchDocumentResponse> => {
  const response = await client.post<SearchDocumentResponse>(DOCUMENT_ENDPOINTS.searchDocument(), data)
  return response.data
}

// 단일 문서 조회
interface GetSingleDocumentResponse {
  id: number
  documentName: string
  content: string
  quizGenerationStatus:
    | 'UNPROCESSED'
    | 'PROCESSED'
    | 'PROCESSING'
    | 'COMPLETELY_FAILED'
    | 'PARTIAL_SUCCESS'
    | 'QUIZ_GENERATION_ERROR'
  characterCount: number
  totalQuizCount: number
  updatedAt: string
  // 추가 정보 (예: 디렉토리, 퀴즈 목록 등) 포함 가능
}

export const getSingleDocument = async (documentId: number): Promise<GetSingleDocumentResponse> => {
  const response = await client.get<GetSingleDocumentResponse>(DOCUMENT_ENDPOINTS.getSingleDocument(documentId))
  return response.data
}

// 문서에 추가 퀴즈 생성
interface CreateQuizzesRequest {
  star: number
  quizType: 'MIX_UP' | 'MULTIPLE_CHOICE'
}

interface CreateQuizzesResponse {
  quizSetId: string
  quizSetType: 'TODAY_QUIZ_SET' | 'DOCUMENT_QUIZ_SET' | 'COLLECTION_QUIZ_SET' | 'FIRST_QUIZ_SET'
  createdAt: string
}

export const addQuizzes = async (documentId: number, data: CreateQuizzesRequest): Promise<CreateQuizzesResponse> => {
  const response = await client.post<CreateQuizzesResponse>(DOCUMENT_ENDPOINTS.addQuizzes(documentId), data)
  return response.data
}

// 문서 퀴즈 다운로드
export const downloadQuiz = async (documentId: number): Promise<string> => {
  const response = await client.get<string>(DOCUMENT_ENDPOINTS.downloadQuiz(documentId))
  return response.data
}

// 문서 이름 변경
interface UpdateDocumentNameRequest {
  name: string
}

export const updateDocumentName = async (documentId: number, data: UpdateDocumentNameRequest): Promise<void> => {
  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.updateDocumentName(documentId), data)
  return response.data
}

// 문서 내용 업데이트
interface UpdateDocumentContentRequest {
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

// 문서 이동
interface MoveDocumentRequest {
  documentIds: number[]
  directoryId: number
}

export const moveDocument = async (data: MoveDocumentRequest): Promise<void> => {
  const response = await client.patch<void>(DOCUMENT_ENDPOINTS.moveDocument(), data)
  return response.data
}

// 복습 필수 문서 조회
interface GetDocumentsNeedingReviewResponse {
  documents: {
    id: number
    documentName: string
    reviewNeededQuizCount: number
  }[]
}

export const getDocumentsNeedingReview = async (): Promise<GetDocumentsNeedingReviewResponse> => {
  const response = await client.get<GetDocumentsNeedingReviewResponse>(DOCUMENT_ENDPOINTS.getDocumentsNeedingReview())
  return response.data
}
