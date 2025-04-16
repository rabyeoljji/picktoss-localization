import { client } from '@/shared/lib/axios/client'

import { CATEGORY_ENDPOINTS } from './config'

interface CategoriesResponse {
  categories: {
    id: number
    name: string
    emoji: string
  }[]
}

export const getCategories = async () => {
  const response = await client.get<CategoriesResponse>(CATEGORY_ENDPOINTS.getCategories)
  return response.data
}
