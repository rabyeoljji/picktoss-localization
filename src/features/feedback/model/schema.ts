import { z } from 'zod'

// 피드백 유형 enum
export const FeedbackTypeEnum = z.enum(['ERROR', 'PARTNERSHIP', 'ACCOUNT_INFO', 'OTHER'])

export type FeedbackType = z.infer<typeof FeedbackTypeEnum>

// 피드백 유형 매핑
export const feedbackTypeMap: Record<string, FeedbackType> = {
  오류: 'ERROR',
  제휴: 'PARTNERSHIP',
  회원정보: 'ACCOUNT_INFO',
  기타: 'OTHER',
}

// 피드백 스키마
export const feedbackSchema = z.object({
  type: z.enum(['ERROR', 'PARTNERSHIP', 'ACCOUNT_INFO', 'OTHER'], {
    required_error: '문의 유형을 선택해주세요',
  }),
  content: z.string().min(20, '상세 문의 내용을 20자 이상 적어주세요'),
  email: z.string().email('답변 받으실 이메일을 적어주세요'),
  files: z.array(z.instanceof(File)).optional(),
  privacy: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 이용동의가 필요합니다',
  }),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>
