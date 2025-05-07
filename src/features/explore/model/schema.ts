import { z } from 'zod'

// 신고 사유 enum
export const ComplainReasonEnum = z.enum([
  'OFF_TOPIC',
  'HARMFUL_CONTENT',
  'DEFAMATION_OR_COPYRIGHT',
  'PROFANITY_OR_HATE_SPEECH',
])

export type ComplainReason = z.infer<typeof ComplainReasonEnum>

// 신고 사유 매핑
export const complainReasonMap: Record<string, ComplainReason> = {
  '주제와 관련 없는 내용이에요': 'OFF_TOPIC',
  '유해한 내용을 포함하고 있어요': 'HARMFUL_CONTENT',
  '명예훼손 또는 저작권이 침해되었어요': 'DEFAMATION_OR_COPYRIGHT',
  '욕설/생명경시/혐오 표현이 사용되었어요': 'PROFANITY_OR_HATE_SPEECH',
}

export const complainFormSchema = z.object({
  reason: z.enum(['OFF_TOPIC', 'HARMFUL_CONTENT', 'DEFAMATION_OR_COPYRIGHT', 'PROFANITY_OR_HATE_SPEECH'], {
    invalid_type_error: '올바른 신고 사유가 아닙니다',
  }),
  content: z.string().optional(),
})

export type ComplainFormValues = z.infer<typeof complainFormSchema>
