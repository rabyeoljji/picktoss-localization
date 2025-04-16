import { createKey } from '@/shared/api/lib/create-key'

const FEEDBACK = 'feedback'

export const FEEDBACK_ENDPOINTS = {
  postFeedback: () => '/feedback',
}

export const FEEDBACK_KEYS = {
  postFeedback: createKey(FEEDBACK, FEEDBACK_ENDPOINTS.postFeedback()),
}
