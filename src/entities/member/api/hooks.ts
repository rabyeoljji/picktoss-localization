import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

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

export const useUser = () => {
  return useSuspenseQuery({
    queryKey: MEMBER_KEYS.getMemberInfo,
    queryFn: () => getMemberInfo(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useGetInviteLinkMember = () => {
  return useQuery({
    queryKey: MEMBER_KEYS.getInviteLinkMember,
    queryFn: () => getInviteLinkMember(),
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateMemberName,
    mutationFn: (data: Parameters<typeof updateMemberName>[0]) => updateMemberName(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    },
  })
}

export const useUpdateInterestCollectionCategories = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateInterestCollectionCategories,
    mutationFn: (data: Parameters<typeof updateInterestCollectionCategories>[0]) =>
      updateInterestCollectionCategories(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    },
  })
}

export const useDeleteMember = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.deleteMember,
    mutationFn: (data: Parameters<typeof deleteMember>[0]) => deleteMember(data),
  })
}
