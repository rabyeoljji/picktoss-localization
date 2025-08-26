'use client'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'

import { useAuthStore } from '@/features/auth'
import { WithdrawFormValues, withdrawFormSchema, withdrawReasonMap } from '@/features/withdraw/model/schema'

import { useDeleteMember, useUser } from '@/entities/member/api/hooks'

import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Selectbox } from '@/shared/components/ui/selectbox'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRouter } from '@/shared/lib/router'

const WithdrawForm = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { clearToken } = useAuthStore()

  const { data: user } = useUser()
  const { mutate: deleteMemberMutate, isPending } = useDeleteMember()

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      reason: undefined,
      content: undefined,
      confirmNotification: false,
    },
  })

  const { control, handleSubmit, watch } = form

  const handleClickDeleteAccount = (data: WithdrawFormValues) => {
    deleteMemberMutate(
      {
        ...(data.reason && { reason: data.reason }),
        ...(data.content && { detail: data.content }),
      },
      {
        onSuccess: () => {
          clearToken()
          router.replace('/login')
        },
      },
    )
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
                className="flex flex-col gap-[8px] py-[40px] px-[16px]"
              >
                {Object.entries(withdrawReasonMap).map(([label, value]) => (
                  <FormItem key={value} className="space-y-0">
                    <FormControl>
                      <Selectbox
                        relativeItem={<RadioGroupItem value={value} id={`type-${label}`} className="peer sr-only" />}
                        htmlFor={`type-${label}`}
                        selected={field.value === value}
                      >
                        {label}
                      </Selectbox>
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

        <div className="px-[16px]">
          <Text typo="body-1-bold" color="sub">
            {t('profile.상세내용')}
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
                    placeholder={t('profile.선택하신_이유에_관한_자세한_내용을_남겨주세요')}
                    className="input-basic my-[8px] h-[256px] w-full resize-none"
                    maxLength={500}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Text typo="body-2-medium" color="caption" className="mb-[32px]">
            {`${t('profile.500자_이내로_입력해주세요')} (${watch('content')?.length || 0}/500)`}
          </Text>
        </div>

        <div className="h-2 w-full bg-base-2" />

        <div className="w-full flex flex-col gap-[24px] pt-[20px] pb-[40px] px-[16px]">
          {/* 데이터 삭제 동의 */}
          <FormField
            control={form.control}
            name="confirmNotification"
            render={({ field }) => (
              <FormItem className="flex items-center gap-[8px]">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} id="checkNotification" />
                </FormControl>
                <label htmlFor="checkNotification">
                  <Text typo="body-2-medium" color="primary">
                    {t('profile.저장한_데이터는_모두_삭제되며_복구할_수_없음을_확인했습니다')}
                  </Text>
                </label>
              </FormItem>
            )}
          />

          {/* 계정 삭제 확인 dialog */}
          <SystemDialog
            trigger={
              <Button disabled={isPending || !form.getValues().confirmNotification} className="w-full">
                {isPending ? t('profile.제출_중') : t('profile.탈퇴하기')}
              </Button>
            }
            title={t('profile.계정을_삭제하시겠어요')}
            content={
              <Text typo="body-1-medium" color="sub">
                {t('profile.픽토스에서_만든')}{' '}
                <Text as="span" typo="body-1-medium" color="critical">
                  {t('profile.개의_문제', { count: user?.totalQuizCount ?? 0 })}
                </Text>
                {t('profile.가')} <br /> {t('profile.모두_삭제됩니다')}
              </Text>
            }
            confirmLabel={t('profile.계정_삭제')}
            onConfirm={handleSubmit(handleClickDeleteAccount)}
            variant="critical"
          />
        </div>
      </form>
    </Form>
  )
}

export default WithdrawForm
