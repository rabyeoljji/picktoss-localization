import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const DOCUMENT = 'document'

export const DOCUMENT_ENDPOINTS = {
  // POST
  createDocument: () => '/documents',
  // GET
  getSingleDocument: (documentId: number) => `/documents/${documentId}`,
  // GET (퀴즈 다운로드)
  downloadQuiz: (documentId: number) => `/documents/${documentId}/download-quiz`,
  // POST (문서 검색)
  searchDocument: () => '/documents/search',
  // POST (문서에서 추가 퀴즈 생성)
  addQuizzes: (documentId: number) => `/documents/${documentId}/add-quizzes`,
  // PATCH: 문서 이름 변경
  updateDocumentName: (documentId: number) => `/documents/${documentId}/update-name`,
  // PATCH: 문서 내용 업데이트
  updateDocumentContent: (documentId: number) => `/documents/${documentId}/update-content`,
  // PATCH: 문서 이동
  moveDocument: () => '/documents/move',
  // GET: 복습 필수 문서 조회
  getDocumentsNeedingReview: () => '/documents/review-need-documents',
}

export const DOCUMENT_KEYS = {
  createDocument: originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.createDocument()),
  getSingleDocument: (documentId: number) =>
    originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.getSingleDocument(documentId)),
  searchDocument: originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.searchDocument()),
  addQuizzes: (documentId: number) => originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.addQuizzes(documentId)),
  downloadQuiz: (documentId: number) => originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.downloadQuiz(documentId)),
  updateDocumentName: (documentId: number) =>
    originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.updateDocumentName(documentId)),
  updateDocumentContent: (documentId: number) =>
    originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.updateDocumentContent(documentId)),
  moveDocument: originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.moveDocument()),
  getDocumentsNeedingReview: originalCreateKey(DOCUMENT, DOCUMENT_ENDPOINTS.getDocumentsNeedingReview()),
}
