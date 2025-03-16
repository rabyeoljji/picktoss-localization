import { client } from '@/shared/lib/axios/client'

import { MEMBER_ENDPOINTS } from './config'

// GET: 회원 정보 조회
interface GetMemberInfoResponse {
  id: number
  name: string
  email: string
  socialPlatform: 'KAKAO' | 'GOOGLE'
  role: 'ROLE_USER' | 'ROLE_ADMIN'
  interestCategories: string[]
  documentUsage: {
    possessDocumentCount: number
    maxPossessDocumentCount: number
  }
  star: number
  quizNotificationEnabled: boolean
}

export const getMemberInfo = async (): Promise<GetMemberInfoResponse> => {
  const response = await client.get<GetMemberInfoResponse>(MEMBER_ENDPOINTS.getMemberInfo())
  return response.data
}

// GET: 초대 링크 보상(초대 링크로 회원가입 여부 확인)
export const getInviteLinkMember = async (): Promise<void> => {
  const response = await client.get<void>(MEMBER_ENDPOINTS.getInviteLinkMember())
  return response.data
}

// PATCH: 오늘의 퀴즈 개수 업데이트
interface UpdateTodayQuizCountRequest {
  todayQuizCount: number
}

export const updateTodayQuizCount = async (data: UpdateTodayQuizCountRequest): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateTodayQuizCount(), data)
  return response.data
}

// PATCH: 퀴즈 알림 ON/OFF 업데이트
interface UpdateQuizNotificationRequest {
  quizNotificationEnabled: boolean
}

export const updateQuizNotification = async (data: UpdateQuizNotificationRequest): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateQuizNotification(), data)
  return response.data
}

// PATCH: 회원 이름 업데이트
interface UpdateMemberNameRequest {
  name: string
}

export const updateMemberName = async (data: UpdateMemberNameRequest): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateMemberName(), data)
  return response.data
}

// PATCH: 관심분야 태그 업데이트
interface UpdateInterestCollectionCategoriesRequest {
  interestCollectionCategories: string[]
}

export const updateInterestCollectionCategories = async (
  data: UpdateInterestCollectionCategoriesRequest,
): Promise<void> => {
  const response = await client.patch<void>(MEMBER_ENDPOINTS.updateInterestCollectionCategories(), data)
  return response.data
}

// DELETE: 회원 탈퇴
interface DeleteMemberRequest {
  reason: 'UNSATISFACTORY_RESULT' | 'INCONVENIENT_SERVICE' | 'SYSTEM_ISSUE' | 'SECURITY_CONCERNS'
  detail: string
}

export const deleteMember = async (data: DeleteMemberRequest): Promise<void> => {
  const response = await client.delete<void>(MEMBER_ENDPOINTS.deleteMember(), { data })
  return response.data
}
