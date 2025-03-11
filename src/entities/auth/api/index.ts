import { client } from "@/shared/lib/axios/client"
import { AUTH_ENDPOINTS } from "./config"

// 로그인
export interface LoginRequest {
  accessToken: string
  socialPlatform: "KAKAO" | "GOOGLE"
}

export interface LoginResponse {
  accessToken: string
  accessTokenExpiration: string // ISO 날짜 문자열
  signUp: boolean
}

export const login = async ({ data }: { data: LoginRequest }) => {
  const response = await client.post<LoginResponse>(AUTH_ENDPOINTS.postLogin, data)
  return response.data
}

// 이메일 인증 코드 생성 및 발송
export interface SendVerificationCodeRequest {
  email: string
}

export const sendVerificationCode = async ({ data }: { data: SendVerificationCodeRequest }) => {
  const response = await client.post<void>(AUTH_ENDPOINTS.postAuthVerification, data)
  return response.data
}

// 이메일 코드 인증
export interface VerifyVerificationCodeRequest {
  email: string
  verificationCode: string
}

export const verifyVerificationCode = async ({ data }: { data: VerifyVerificationCodeRequest }) => {
  const response = await client.post<void>(AUTH_ENDPOINTS.postAuthVerificationCheck, data)
  return response.data
}

// 초대 코드 유효성 검사
export interface VerifyInviteCodeRequest {
  inviteCode: string
}

export const verifyInviteCode = async ({ data }: { data: VerifyInviteCodeRequest }) => {
  const response = await client.post<void>(AUTH_ENDPOINTS.postAuthInviteVerify, data)
  return response.data
}

// 초대 코드 인증 후 별 지급
export const rewardForInviteCode = async ({ data }: { data: VerifyInviteCodeRequest }) => {
  const response = await client.post<void>(AUTH_ENDPOINTS.postAuthInviteReward, data)
  return response.data
}

// 초대 링크 생성
export interface CreateInviteLinkResponse {
  inviteLink: string
}

export const createInviteLink = async () => {
  const response = await client.get<CreateInviteLinkResponse>(AUTH_ENDPOINTS.getAuthInvite)
  return response.data
}

// 초대 링크 생성자 정보 조회
export interface GetInviteMemberResponse {
  name: string
}

export const getInviteMemberInfo = async (inviteCode: string) => {
  const response = await client.get<GetInviteMemberResponse>(AUTH_ENDPOINTS.getAuthInviteCreator(inviteCode))
  return response.data
}

// 초대 코드로 회원가입 여부 체크
export interface CheckInviteCodeBySignUpResponse {
  type: "READY" | "NONE"
}

export const checkInviteCodeBySignUp = async () => {
  const response = await client.get<CheckInviteCodeBySignUpResponse>(AUTH_ENDPOINTS.getAuthInviteStatus)
  return response.data
}
