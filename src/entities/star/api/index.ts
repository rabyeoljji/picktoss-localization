import { client } from '@/shared/lib/axios/client'

import { STAR_ENDPOINTS } from './config'

export type StarHistorySortType = 'DEPOSIT' | 'WITHDRAWAL'

interface StarHistoryResponse {
  starHistories: {
    description: string
    changeAmount: number
    transactionType: StarHistorySortType
    createdAt: string
  }[]
}

export const getStarHistory = async (sort?: StarHistorySortType): Promise<StarHistoryResponse> => {
  const params = sort ? { 'usage-history-sort-type': sort } : {}

  const response = await client.get<StarHistoryResponse>(STAR_ENDPOINTS.getStarHistory(), { params })
  return response.data
}
