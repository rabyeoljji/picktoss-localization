import { z } from 'zod'

// 피드백 유형 enum
export const FeedbackTypeEnum = z.enum(['ERROR', 'PARTNERSHIP', 'ACCOUNT_INFO', 'OTHER'])

export type FeedbackType = z.infer<typeof FeedbackTypeEnum>

// 피드백 유형 매핑
export const feedbackTypeMap: Record<string, FeedbackType> = {
  'profile.feedback_form.inquiry_type.error': 'ERROR',
  'profile.feedback_form.inquiry_type.partnership': 'PARTNERSHIP',
  'profile.feedback_form.inquiry_type.account_info': 'ACCOUNT_INFO',
  'profile.feedback_form.inquiry_type.other': 'OTHER',
}

// 피드백 스키마
export const feedbackSchema = z.object({
  type: z.enum(['ERROR', 'PARTNERSHIP', 'ACCOUNT_INFO', 'OTHER'], {
    required_error: 'profile.feedback_form.type_required_message',
  }),
  content: z.string().min(20, 'profile.feedback_form.content_required_message'),
  email: z.string().email('profile.feedback_form.email_required_message'),
  files: z.array(z.instanceof(File)).optional(),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'profile.feedback_form.privacy_required_message',
  }),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>
