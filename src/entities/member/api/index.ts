import { client } from '@/shared/lib/axios/client'

import { MEMBER_ENDPOINTS } from './config'

// GET: 회원 정보 가져오기
export interface CategoryDto {
  id: number
  name: string
  emoji: string
}

export interface GetMemberInfoResponse {
  id: number
  name: string
  email: string
  category: CategoryDto
  socialPlatform: 'KAKAO' | 'GOOGLE'
  star: number
  bookmarkCount: number
  totalQuizCount: number
  monthlySolvedQuizCount: number
  quizNotificationEnabled: boolean
}

export const getMemberInfo = async (): Promise<GetMemberInfoResponse> => {
  const response = await client.get<GetMemberInfoResponse>(MEMBER_ENDPOINTS.getMemberInfo)
  return response.data
}

// PATCH: 퀴즈 알림 ON/OFF 업데이트
export interface UpdateQuizNotificationRequest {
  quizNotificationEnabled: boolean
}

export const updateQuizNotification = async (data: UpdateQuizNotificationRequest): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateQuizNotification, data)
  return response.data
}

// PATCH: 회원 이름 업데이트
export interface UpdateMemberNameRequest {
  name: string
}

export const updateMemberName = async (data: UpdateMemberNameRequest): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateMemberName, data)
  return response.data
}

// PATCH: 사용자 관심 카테고리 변경
export interface UpdateMemberCategoryRequest {
  categoryId: number
}

export const updateMemberCategory = async (data: UpdateMemberCategoryRequest): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateMemberCategory, data)
  return response.data
}

// DELETE: 회원 탈퇴
export interface DeleteMemberRequest {
  reason?: 'UNSATISFACTORY_RESULT' | 'INCONVENIENT_SERVICE' | 'SYSTEM_ISSUE' | 'SECURITY_CONCERNS'
  detail?: string
}

export const deleteMember = async (data: DeleteMemberRequest): Promise<void> => {
  const response = await client.delete<void>(MEMBER_ENDPOINTS.deleteMember, { data })
  return response.data
}
