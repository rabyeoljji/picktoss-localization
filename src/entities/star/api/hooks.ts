import { useQuery } from '@tanstack/react-query'

import { STAR_KEYS } from './config'
import { getStarHistory } from './index'

export const useGetStarHistory = () => {
  return useQuery({
    queryKey: STAR_KEYS.getStarHistory,
    queryFn: () => getStarHistory(),
  })
}
