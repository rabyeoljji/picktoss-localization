import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { ComplainFormValues, complainFormSchema, complainReasonMap } from '@/features/explore/model/schema'

import { useCreateDocumentComplaint } from '@/entities/document/api/hooks'

import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Selectbox } from '@/shared/components/ui/selectbox'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const ComplainForm = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { noteId } = useParams()

  const { mutate: complainDocument, isPending } = useCreateDocumentComplaint(Number(noteId))

  const form = useForm<ComplainFormValues>({
    resolver: zodResolver(complainFormSchema),
    defaultValues: {
      reason: undefined,
      content: undefined,
    },
  })

  const { control, handleSubmit, watch, formState } = form

  const handleComplain = (data: ComplainFormValues) => {
    complainDocument(
      {
        complaintReason: data.reason,
        ...(data.content && { content: data.content }),
      },
      {
        onSuccess: () => {
          toast(t('explore.complain_form.report_complete_message'))
          router.replace('/quiz-detail/:noteId', {
            params: [String(noteId)],
          })
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleComplain)} className="flex flex-col gap-[32px]">
        {/* 신고 사유 */}
        <div>
          <Text typo="body-1-bold" color="sub" className="mb-[12px]">
            {t('explore.complain_form.select_reason_title')} <span className="text-accent">*</span>
          </Text>

          <FormField
            name="reason"
            control={control}
            render={({ field }) => (
              <FormItem>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col gap-[8px]">
                  {Object.entries(complainReasonMap).map(([label, value]) => (
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
        </div>

        {/* 상세 내용 */}
        <div>
          <Text typo="body-1-bold" color="sub">
            {t('explore.complain_form.details_label')}
          </Text>

          <FormField
            name="content"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t('explore.complain_form.details_placeholder')}
                    className="input-basic my-[8px] h-[256px] w-full resize-none"
                    maxLength={500}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Text typo="body-2-medium" color="caption" className="mb-[32px]">
            {`${t('explore.complain_form.character_limit')} (${watch('content')?.length || 0}/500)`}
          </Text>
        </div>

        <div className="pt-[20px] pb-[40px] px-[16px]">
          <Button
            type="submit"
            data-state={(isPending || formState.isSubmitting) && 'loading'}
            disabled={!formState.isValid}
          >
            {t('explore.complain_form.report_button')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ComplainForm
