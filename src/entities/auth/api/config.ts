import { createKey } from '@/shared/api/lib/create-key'

const AUTH = 'auth'

export const AUTH_ENDPOINTS = {
  // GET
  getAuthInvite: '/auth/invite',
  getAuthInviteCreator: (inviteCode: string) => `/auth/invite/${inviteCode}/creator`,
  getAuthInviteStatus: '/auth/invite/status',

  // POST
  postLogin: '/login',
  postAuthInviteVerify: '/auth/invite/verify',
  postAuthInviteReward: '/auth/invite/reward',
}

export const AUTH_KEYS = {
  // GET
  getAuthInvite: createKey(AUTH, AUTH_ENDPOINTS.getAuthInvite),
  getAuthInviteCreator: (inviteCode: string) => createKey(AUTH, AUTH_ENDPOINTS.getAuthInviteCreator(inviteCode)),
  getAuthInviteStatus: createKey(AUTH, AUTH_ENDPOINTS.getAuthInviteStatus),

  // POST
  postLogin: createKey(AUTH, AUTH_ENDPOINTS.postLogin),
  postAuthInviteVerify: createKey(AUTH, AUTH_ENDPOINTS.postAuthInviteVerify),
  postAuthInviteReward: createKey(AUTH, AUTH_ENDPOINTS.postAuthInviteReward),
}
