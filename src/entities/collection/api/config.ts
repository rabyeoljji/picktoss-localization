import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const COLLECTION = 'collection'

export const COLLECTION_ENDPOINTS = {
  // GET
  getAllCollections: () => '/collections',
  getCollectionCategories: () => '/collections/categories',
  getBookmarkedCollections: () => '/collections/bookmarked-collections',
  getInterestCategoryCollections: () => '/collections/interest-category-collection',
  searchCollections: (keyword: string) => `/collections/${keyword}`,
  getCollectionInfoByCollectionId: (collectionId: number) => `/collections/${collectionId}/info`,
  getQuizzesInCollectionByCollectionCategory: (collectionCategory: string) =>
    `/collections/${collectionCategory}/quizzes`,
  getCollectionContainingQuiz: (quizId: number) => `/collections/quizzes/${quizId}`,
  getMyCollections: () => '/collections/my-collections',

  // POST
  createCollection: () => '/collections',
  createCollectionBookmark: (collectionId: number) => `/collections/${collectionId}/create-bookmark`,
  createCollectionComplaint: (collectionId: number) => `/collections/${collectionId}/complaint`,
  createCollectionQuizSet: (collectionId: number) => `/collections/${collectionId}/collection-quizzes`,

  // PATCH
  updateCollectionQuizzes: (collectionId: number) => `/collections/${collectionId}/update-quizzes`,
  updateCollectionInfo: (collectionId: number) => `/collections/${collectionId}/update-info`,
  updateCollectionRandomQuizResult: () => '/collections/random-quiz/result',
  addQuizToCollection: (collectionId: number) => `/collection/${collectionId}/add-quiz`,

  // DELETE
  deleteCollection: (collectionId: number) => `/collections/${collectionId}/delete-collection`,
  deleteCollectionBookmark: (collectionId: number) => `/collections/${collectionId}/delete-bookmark`,
}

export const COLLECTION_KEYS = {
  // GET
  getAllCollections: originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getAllCollections()),
  getCollectionCategories: originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getCollectionCategories()),
  getBookmarkedCollections: originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getBookmarkedCollections()),
  getInterestCategoryCollections: originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getInterestCategoryCollections()),
  searchCollections: (keyword: string) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.searchCollections(keyword)),
  getCollectionInfoByCollectionId: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getCollectionInfoByCollectionId(collectionId)),
  getQuizzesInCollectionByCollectionCategory: (collectionCategory: string) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getQuizzesInCollectionByCollectionCategory(collectionCategory)),
  getCollectionContainingQuiz: (quizId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getCollectionContainingQuiz(quizId)),
  getMyCollections: originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.getMyCollections()),

  // POST
  createCollection: originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.createCollection()),
  createCollectionBookmark: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.createCollectionBookmark(collectionId)),
  createCollectionComplaint: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.createCollectionComplaint(collectionId)),
  createCollectionQuizSet: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.createCollectionQuizSet(collectionId)),

  // PATCH
  updateCollectionQuizzes: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.updateCollectionQuizzes(collectionId)),
  updateCollectionInfo: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.updateCollectionInfo(collectionId)),
  updateCollectionRandomQuizResult: originalCreateKey(
    COLLECTION,
    COLLECTION_ENDPOINTS.updateCollectionRandomQuizResult(),
  ),
  addQuizToCollection: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.addQuizToCollection(collectionId)),

  // DELETE
  deleteCollection: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.deleteCollection(collectionId)),
  deleteCollectionBookmark: (collectionId: number) =>
    originalCreateKey(COLLECTION, COLLECTION_ENDPOINTS.deleteCollectionBookmark(collectionId)),
}
