import { useMutation, useQuery } from "@tanstack/react-query"
import {
  login,
  sendVerificationCode,
  verifyVerificationCode,
  verifyInviteCode,
  rewardForInviteCode,
  createInviteLink,
  getInviteMemberInfo,
  checkInviteCodeBySignUp,
} from "./index"
import { AUTH_KEYS } from "./config"

export const useLogin = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.postLogin,
    mutationFn: ({ data }: { data: Parameters<typeof login>[0]["data"] }) => login({ data }),
  })
}

export const useSendVerificationCode = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.postAuthVerification,
    mutationFn: ({ data }: { data: { email: string } }) => sendVerificationCode({ data }),
  })
}

export const useVerifyVerificationCode = () => {
  return useMutation({
    mutationKey: AUTH_KEYS.postAuthVerificationCheck,
    mutationFn: ({ data }: { data: { email: string; verificationCode: string } }) => verifyVerificationCode({ data }),
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
