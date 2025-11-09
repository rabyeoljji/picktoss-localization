import { z } from 'zod'

// 탈퇴 사유 enum
export const WithdrawReasonEnum = z.enum([
  'UNSATISFACTORY_RESULT',
  'SYSTEM_ISSUE',
  'INCONVENIENT_SERVICE',
  'OTHER_PROBLEM',
])

export type WithdrawReason = z.infer<typeof WithdrawReasonEnum>

// 탈퇴 사유 매핑
export const withdrawReasonMap: Record<string, WithdrawReason> = {
  'profile.withdraw_form.reason.unsatisfactory_result': 'UNSATISFACTORY_RESULT',
  'profile.withdraw_form.reason.system_issue': 'SYSTEM_ISSUE',
  'profile.withdraw_form.reason.inconvenient_service': 'INCONVENIENT_SERVICE',
  'profile.withdraw_form.reason.other_problem': 'OTHER_PROBLEM',
}

export const withdrawFormSchema = z.object({
  reason: z
    .enum(['UNSATISFACTORY_RESULT', 'SYSTEM_ISSUE', 'INCONVENIENT_SERVICE', 'OTHER_PROBLEM'], {
      invalid_type_error: '올바른 탈퇴 사유가 아닙니다',
    })
    .optional(),
  content: z.string().optional(),
  confirmNotification: z.boolean().refine((checked) => checked, '탈퇴 안내 확인 여부에 동의해주세요'),
})

export type WithdrawFormValues = z.infer<typeof withdrawFormSchema>
