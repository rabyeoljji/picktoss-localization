import { useMutation, useQuery } from '@tanstack/react-query'

import { useUserStore } from '@/features/user/model/user-store'

import { MEMBER_KEYS } from './config'
import {
  deleteMember,
  getInviteLinkMember,
  getMemberInfo,
  updateInterestCollectionCategories,
  updateMemberName,
  updateQuizNotification,
  updateTodayQuizCount,
} from './index'

export const useGetInviteLinkMember = () => {
  return useQuery({
    queryKey: MEMBER_KEYS.getInviteLinkMember,
    queryFn: () => getInviteLinkMember(),
  })
}

export const useGetMemberInfo = () => {
  const { setUser } = useUserStore()

  return useMutation({
    mutationKey: MEMBER_KEYS.getMemberInfo,
    mutationFn: () => getMemberInfo(),
    onSuccess: (data) => {
      setUser(data)
    },
  })
}

export const useUpdateTodayQuizCount = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.updateTodayQuizCount,
    mutationFn: (data: Parameters<typeof updateTodayQuizCount>[0]) => updateTodayQuizCount(data),
  })
}

export const useUpdateQuizNotification = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.updateQuizNotification,
    mutationFn: (data: Parameters<typeof updateQuizNotification>[0]) => updateQuizNotification(data),
  })
}

export const useUpdateMemberName = () => {
  const { mutate: refetchMemberInfo } = useGetMemberInfo()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateMemberName,
    mutationFn: (data: Parameters<typeof updateMemberName>[0]) => updateMemberName(data),
    onSettled: () => {
      refetchMemberInfo()
    },
  })
}

export const useUpdateInterestCollectionCategories = () => {
  const { mutate: refetchMemberInfo } = useGetMemberInfo()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateInterestCollectionCategories,
    mutationFn: (data: Parameters<typeof updateInterestCollectionCategories>[0]) =>
      updateInterestCollectionCategories(data),
    onSettled: () => {
      refetchMemberInfo()
    },
  })
}

export const useDeleteMember = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.deleteMember,
    mutationFn: (data: Parameters<typeof deleteMember>[0]) => deleteMember(data),
  })
}
