import { createKey } from '@/shared/api/lib/create-key'

const MEMBER = 'member'

export const MEMBER_ENDPOINTS = {
  // GET
  getMemberInfo: '/members/info',

  // PATCH
  updateQuizNotification: '/members/update-quiz-notification',
  updateMemberName: '/members/update-name',
  updateMemberCategory: '/members/update-category',

  // DELETE
  deleteMember: '/members/withdrawal',
}

export const MEMBER_KEYS = {
  // GET
  getMemberInfo: createKey(MEMBER, MEMBER_ENDPOINTS.getMemberInfo),

  // PATCH
  updateQuizNotification: createKey(MEMBER, MEMBER_ENDPOINTS.updateQuizNotification),
  updateMemberName: createKey(MEMBER, MEMBER_ENDPOINTS.updateMemberName),
  updateMemberCategory: createKey(MEMBER, MEMBER_ENDPOINTS.updateMemberCategory),

  // DELETE
  deleteMember: createKey(MEMBER, MEMBER_ENDPOINTS.deleteMember),
}
