import { useMutation, useQuery } from '@tanstack/react-query'

import {
  checkInviteCodeBySignUp,
  createInviteLink,
  getInviteMemberInfo,
  login,
  rewardForInviteCode,
  verifyInviteCode,
} from '.'
import { AUTH_KEYS } from './config'

export const useLogin = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.postLogin,
    mutationFn: ({ data }: { data: Parameters<typeof login>[0]['data'] }) => login({ data }),
  })
}

export const useVerifyInviteCode = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.postAuthInviteVerify,
    mutationFn: ({ data }: { data: { inviteCode: string } }) => verifyInviteCode({ data }),
  })
}

export const useRewardForInviteCode = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.postAuthInviteReward,
    mutationFn: ({ data }: { data: { inviteCode: string } }) => rewardForInviteCode({ data }),
  })
}

export const useCreateInviteLink = () => {
  return useQuery({
    queryKey: AUTH_KEYS.getAuthInvite,
    queryFn: () => createInviteLink(),
  })
}

export const useGetInviteMemberInfo = (inviteCode: string) => {
  return useQuery({
    queryKey: AUTH_KEYS.getAuthInviteCreator(inviteCode),
    queryFn: () => getInviteMemberInfo(inviteCode),
  })
}

export const useCheckInviteCodeBySignUp = () => {
  return useQuery({
    queryKey: AUTH_KEYS.getAuthInviteStatus,
    queryFn: () => checkInviteCodeBySignUp(),
  })
}
