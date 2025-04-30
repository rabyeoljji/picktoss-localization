import { client } from '@/shared/lib/axios/client'

import { CATEGORY_ENDPOINTS } from './config'

export interface Category {
  id: number
  name: string
  emoji: string
  orders: number
}

interface CategoriesResponse {
  categories: Category[]
}

export const getCategories = async () => {
  const response = await client.get<CategoriesResponse>(CATEGORY_ENDPOINTS.getCategories)
  return response.data
}
