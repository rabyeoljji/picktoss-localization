import { useQuery } from '@tanstack/react-query'

import { getCategories } from '.'
import { CATEGORY_KEYS } from './config'

export const useGetCategories = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.getCategories,
    queryFn: () => getCategories(),
    gcTime: 10 * 60 * 1000, // 10 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => data.categories,
  })
}
