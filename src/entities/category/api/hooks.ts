import { useQuery } from '@tanstack/react-query'

import { getCategories } from '.'
import { CATEGORY_KEYS } from './config'

export const useGetCategories = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.getCategories,
    queryFn: () => getCategories(),
  })
}
