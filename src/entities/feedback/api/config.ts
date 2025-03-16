import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

const FEEDBACK = 'feedback'

export const FEEDBACK_ENDPOINTS = {
  postFeedback: () => '/feedback',
}

export const FEEDBACK_KEYS = {
  postFeedback: originalCreateKey(FEEDBACK, FEEDBACK_ENDPOINTS.postFeedback()),
}
