import { createKey } from '@/shared/api/lib/create-key'

const STAR = 'star'

export const STAR_ENDPOINTS = {
  getStarHistory: () => '/stars',
}

export const STAR_KEYS = {
  getStarHistory: createKey(STAR, STAR_ENDPOINTS.getStarHistory()),
}
