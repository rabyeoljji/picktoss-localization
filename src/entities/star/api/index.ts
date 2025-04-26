import { client } from '@/shared/lib/axios/client'

import { STAR_ENDPOINTS } from './config'

interface StarHistoryResponse {
  starHistories: {
    description: string
    changeAmount: number
    transactionType: 'DEPOSIT' | 'WITHDRAWAL'
    createdAt: string
  }[]
}

export const getStarHistory = async (): Promise<StarHistoryResponse> => {
  const response = await client.get<StarHistoryResponse>(STAR_ENDPOINTS.getStarHistory())
  return response.data
}
