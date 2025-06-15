import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { MEMBER_KEYS } from '@/entities/member/api/config'

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: AUTH_KEYS.postAuthInviteReward,
    mutationFn: ({ data }: { data: { inviteCode: string } }) => rewardForInviteCode({ data }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    },
  })
}

export const useCreateInviteLink = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.getAuthInvite,
    mutationFn: () => createInviteLink(),
  })
}

export const useGetInviteMemberInfo = (inviteCode: string) => {
  return useQuery({
    queryKey: AUTH_KEYS.getAuthInviteCreator(inviteCode),
    queryFn: () => getInviteMemberInfo(inviteCode),
  })
}

export const useCheckInviteCodeBySignUp = (queryOptions?: { enabled: boolean }) => {
  return useQuery({
    queryKey: AUTH_KEYS.getAuthInviteStatus,
    queryFn: () => checkInviteCodeBySignUp(),
    enabled: queryOptions?.enabled || true,
  })
}
