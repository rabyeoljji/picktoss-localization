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
  '생성한 결과물이 만족스럽지 않아요': 'UNSATISFACTORY_RESULT',
  '접속 오류 등 시스템 이용이 불편해요': 'SYSTEM_ISSUE',
  '기능 등 서비스 이용이 불편해요': 'INCONVENIENT_SERVICE',
  '위 내용 외에 다른 문제가 있어요': 'OTHER_PROBLEM',
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
