import { createKey } from '@/shared/api/lib/create-key'

const Category = 'category'

export const CATEGORY_ENDPOINTS = {
  // GET
  getCategories: '/categories',
}

export const CATEGORY_KEYS = {
  // GET
  getCategories: createKey(Category, CATEGORY_ENDPOINTS.getCategories),
}
