import { useMutation } from "@tanstack/react-query"
import { createFeedback } from "./index"
import { FEEDBACK_KEYS } from "./config"

export const useCreateFeedback = () => {
  return useMutation({
    mutationKey: FEEDBACK_KEYS.postFeedback,
    mutationFn: (data: Parameters<typeof createFeedback>[0]) => createFeedback(data),
  })
}
