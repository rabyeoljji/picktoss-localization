import { createKey as originalCreateKey } from '@/shared/api/lib/create-key'

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
  getAuthInvite: originalCreateKey(AUTH, AUTH_ENDPOINTS.getAuthInvite),
  getAuthInviteCreator: (inviteCode: string) =>
    originalCreateKey(AUTH, AUTH_ENDPOINTS.getAuthInviteCreator(inviteCode)),
  getAuthInviteStatus: originalCreateKey(AUTH, AUTH_ENDPOINTS.getAuthInviteStatus),

  // POST
  postLogin: originalCreateKey(AUTH, AUTH_ENDPOINTS.postLogin),
  postAuthInviteVerify: originalCreateKey(AUTH, AUTH_ENDPOINTS.postAuthInviteVerify),
  postAuthInviteReward: originalCreateKey(AUTH, AUTH_ENDPOINTS.postAuthInviteReward),
}
