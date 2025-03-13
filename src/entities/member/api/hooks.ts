import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getMemberInfo,
  getInviteLinkMember,
  updateTodayQuizCount,
  updateQuizNotification,
  updateMemberName,
  updateInterestCollectionCategories,
  deleteMember,
} from "./index"
import { MEMBER_KEYS } from "./config"

export const useGetMemberInfo = () => {
  return useQuery({
    queryKey: MEMBER_KEYS.getMemberInfo,
    queryFn: () => getMemberInfo(),
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
  return useMutation({
    mutationKey: MEMBER_KEYS.updateMemberName,
    mutationFn: (data: Parameters<typeof updateMemberName>[0]) => updateMemberName(data),
  })
}

export const useUpdateInterestCollectionCategories = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.updateInterestCollectionCategories,
    mutationFn: (data: Parameters<typeof updateInterestCollectionCategories>[0]) =>
      updateInterestCollectionCategories(data),
  })
}

export const useDeleteMember = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.deleteMember,
    mutationFn: (data: Parameters<typeof deleteMember>[0]) => deleteMember(data),
  })
}
