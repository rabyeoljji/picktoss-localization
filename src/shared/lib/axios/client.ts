import axios from 'axios'

import { useAuthStore } from '@/features/auth/model/auth-store'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone) {
      config.headers = config.headers ?? {}
      config.headers['X-Timezone'] = timezone
    }
    return config
  },
  (error) => Promise.reject(error),
)

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().clearToken()
    }
    return Promise.reject(error.response)
  },
)
