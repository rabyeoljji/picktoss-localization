import { createKey as originalCreateKey } from "@/shared/api/lib/create-key"

const MEMBER = "member"

export const MEMBER_ENDPOINTS = {
  // GET
  getMemberInfo: () => "/members/info",
  getInviteLinkMember: () => "/members/reward",

  // PATCH
  updateTodayQuizCount: () => "/members/update-today-quiz-count",
  updateQuizNotification: () => "/members/update-quiz-notification",
  updateMemberName: () => "/members/update-name",
  updateInterestCollectionCategories: () => "/members/update-collection-categories",

  // DELETE
  deleteMember: () => "/members/withdrawal",
}

export const MEMBER_KEYS = {
  getMemberInfo: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.getMemberInfo()),
  getInviteLinkMember: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.getInviteLinkMember()),
  updateTodayQuizCount: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.updateTodayQuizCount()),
  updateQuizNotification: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.updateQuizNotification()),
  updateMemberName: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.updateMemberName()),
  updateInterestCollectionCategories: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.updateInterestCollectionCategories()),
  deleteMember: originalCreateKey(MEMBER, MEMBER_ENDPOINTS.deleteMember()),
}
