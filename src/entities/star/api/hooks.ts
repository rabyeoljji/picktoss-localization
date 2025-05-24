import { useQuery } from '@tanstack/react-query'

import { STAR_KEYS } from './config'
import { StarHistorySortType, getStarHistory } from './index'

export const useGetStarHistory = (sort?: StarHistorySortType) => {
  return useQuery({
    queryKey: [STAR_KEYS.getStarHistory, sort],
    queryFn: () => getStarHistory(sort),
  })
}
