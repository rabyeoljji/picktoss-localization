import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const Category = 'category'

export const CATEGORY_ENDPOINTS = {
  // GET
  getCategories: '/categories',
}

export const CATEGORY_KEYS = {
  // GET
  getCategories: originalCreateKey(Category, CATEGORY_ENDPOINTS.getCategories),
}
