'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { WithdrawFormValues, withdrawFormSchema, withdrawReasonMap } from '@/features/withdraw/model/schema'

import { useDeleteMember } from '@/entities/member/api/hooks'

import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const WithdrawForm = () => {
  const router = useRouter()

  const { mutate: deleteMemberMutate, isPending } = useDeleteMember()

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      reason: undefined,
      content: undefined,
      conformNotification: false,
    },
  })

  const { control, handleSubmit, watch } = form

  const handleClickDeleteAccount = (data: WithdrawFormValues) => {
    const requestBody: { reason?: WithdrawFormValues['reason']; detail?: WithdrawFormValues['content'] } = {}

    if (data.reason) {
      requestBody['reason'] = data.reason
    }
    if (data.content) {
      requestBody['detail'] = data.content
    }

    deleteMemberMutate(requestBody, {
      onSuccess: () => {
        router.replace('/login')
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleClickDeleteAccount)}>
        {/* 탈퇴 사유 */}
        <FormField
          name="reason"
          control={control}
          render={({ field }) => (
            <FormItem>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col gap-[8px] py-[40px]"
              >
                {Object.entries(withdrawReasonMap).map(([label, value]) => (
                  <FormItem key={value} className="space-y-0">
                    <FormControl>
                      <RadioGroupItem value={value} id={`type-${label}`} className="peer sr-only" />
                    </FormControl>
                    <label
                      htmlFor={`type-${label}`}
                      key={value}
                      className={cn(
                        'w-full flex-center rounded-[10px] border border-outline py-[13.5px] px-[16px] transition-colors cursor-pointer',
                        field.value === value && 'bg-accent border-accent',
                      )}
                    >
                      <Text
                        typo={field.value === value ? 'body-1-bold' : 'body-1-medium'}
                        color={field.value === value ? 'accent' : 'secondary'}
                        className="inline-block size-fit"
                      >
                        {label}
                      </Text>
                    </label>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

        <Text typo="body-1-bold" color="sub">
          상세내용
        </Text>

        {/* 상세 내용 */}
        <FormField
          name="content"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="선택하신 이유에 관한 자세한 내용을 남겨주세요"
                  className="input-basic my-[8px] h-[256px] w-full resize-none"
                  maxLength={500}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Text typo="body-2-medium" color="caption" className="mb-[32px]">
          {`500자 이내로 입력해주세요 (${watch('content')?.length || 0}/500)`}
        </Text>

        <div className="h-2 w-full bg-base-2" />

        {/* 데이터 삭제 동의 */}
        <FormField
          control={form.control}
          name="conformNotification"
          render={({ field }) => (
            <FormItem className="flex items-center gap-[8px] pt-[20px] pb-[24px]">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="checkNotification" />
              </FormControl>
              <label htmlFor="checkNotification">
                <Text typo="body-2-medium" color="primary">
                  저장한 데이터는 모두 삭제되며 복구할 수 없음을 확인했습니다
                </Text>
              </label>
            </FormItem>
          )}
        />

        {/* 계정 삭제 확인 dialog */}
        <SystemDialog
          trigger={
            <Button disabled={isPending || !form.getValues().conformNotification} className="w-full">
              {isPending ? '제출 중...' : '탈퇴하기'}
            </Button>
          }
          title="계정을 삭제하시겠어요?"
          content={
            <Text typo="body-1-medium" color="sub">
              픽토스에서 만든 노트와{' '}
              <Text typo="body-1-medium" color="critical" className="inline-block size-fit">
                {314}개의 문제
              </Text>
              가 <br />
              모두 삭제됩니다
            </Text>
          }
          confirmLabel="계정 삭제"
          onConfirm={handleSubmit(handleClickDeleteAccount)}
          variant="critical"
        />
      </form>
    </Form>
  )
}

export default WithdrawForm
