import { useMutation } from '@tanstack/react-query'

import { FEEDBACK_KEYS } from './config'
import { createFeedback } from './index'

export const useCreateFeedback = () => {
  return useMutation({
    mutationKey: FEEDBACK_KEYS.postFeedback,
    mutationFn: (data: Parameters<typeof createFeedback>[0]) => createFeedback(data),
  })
}
