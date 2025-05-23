import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { MEMBER_KEYS } from './config'
import {
  DeleteMemberRequest,
  UpdateMemberCategoryRequest,
  UpdateMemberNameRequest,
  UpdateQuizNotificationRequest,
  deleteMember,
  getMemberInfo,
  updateMemberCategory,
  updateMemberName,
  updateQuizNotification,
} from './index'

export const useUser = () => {
  return useQuery({
    queryKey: MEMBER_KEYS.getMemberInfo,
    queryFn: () => getMemberInfo(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useUpdateQuizNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateQuizNotification,
    mutationFn: (data: UpdateQuizNotificationRequest) => updateQuizNotification(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    },
  })
}

export const useUpdateMemberName = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateMemberName,
    mutationFn: (data: UpdateMemberNameRequest) => updateMemberName(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    },
  })
}

export const useUpdateMemberCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: MEMBER_KEYS.updateMemberCategory,
    mutationFn: (data: UpdateMemberCategoryRequest) => updateMemberCategory(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.getMemberInfo })
    },
  })
}

export const useDeleteMember = () => {
  return useMutation({
    mutationKey: MEMBER_KEYS.deleteMember,
    mutationFn: (data: DeleteMemberRequest) => deleteMember(data),
  })
}
