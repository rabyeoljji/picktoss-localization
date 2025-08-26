import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useCreateFeedback } from '@/entities/feedback/api/hooks'

import { IcCamera, IcChevronRight, IcClose, IcWarningFilled } from '@/shared/assets/icon'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'

import { FeedbackFormValues, feedbackSchema, feedbackTypeMap } from '../model/schema'

interface FeedbackFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const FeedbackForm = ({ onSuccess, onError }: FeedbackFormProps) => {
  const { t } = useTranslation()
  const { mutate: createFeedback, isPending } = useCreateFeedback()
  const [openPrivacyDrawer, setOpenPrivacyDrawer] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 폼 설정
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: undefined,
      content: '',
      email: '',
      privacy: false,
      files: [],
    },
  })

  const { formState } = form

  // 이미지 상태를 폼 값과 동기화
  useEffect(() => {
    form.setValue('files', images)
  }, [images, form])

  // 유효성 검사 에러 발생 시 토스트 표시
  useEffect(() => {
    if (formState.submitCount > 0 && Object.keys(formState.errors).length > 0) {
      // 첫 번째 에러 메시지 표시
      const firstError = Object.values(formState.errors)[0]
      if (firstError && firstError.message) {
        toast(firstError.message as string, {
          icon: <IcWarningFilled className="size-4 text-icon-critical" />,
        })
      }
    }
  }, [formState.submitCount, formState.errors])

  // 이미지 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      if (images.length + fileArray.length > 3) {
        // 최대 3개 이미지 제한
        toast(t('profile.이미지는_최대_3개까지_첨부_가능합니다'), {
          icon: <IcWarningFilled className="size-4 text-icon-critical" />,
        })
        return
      }
      setImages((prev) => [...prev, ...fileArray])
    }
  }

  // 이미지 제거 처리
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // 이미지 첨부 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  // 폼 제출 처리
  const onSubmit = (data: FeedbackFormValues) => {
    // 선택된 타입의 한글 이름 찾기
    const selectedTypeLabel =
      Object.entries(feedbackTypeMap).find(([_, value]) => value === data.type)?.[0] || t('profile.문의')

    createFeedback(
      {
        type: data.type,
        content: data.content,
        email: data.email,
        files: images,
        title: `[${selectedTypeLabel}] ${t('profile.문의')}`,
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess()
        },
        onError: () => {
          toast(t('profile.잠시_후_다시_시도해주세요'), {
            icon: <IcWarningFilled className="size-4 text-icon-critical" />,
          })
          if (onError) onError()
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form className="flex flex-col flex-1" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-4 py-5">
          <div className="grid gap-2">
            <Text typo="h4">{t('profile.픽토스에_전하고_싶은_말을_남겨주세요')}</Text>
            <Text typo="body-1-regular" color="sub">
              {t('profile.내용을_꼼꼼히_확인한_후_이메일로_답변_드릴게요')}
            </Text>
          </div>

          {/* 문의 유형 */}
          <div className="mt-10 grid gap-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('profile.문의_유형')}</FormLabel>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-2">
                    {Object.entries(feedbackTypeMap).map(([label, value]) => (
                      <FormItem key={value} className="space-y-0">
                        <FormControl>
                          <RadioGroupItem value={value} id={`type-${label}`} className="peer sr-only" />
                        </FormControl>
                        <label
                          htmlFor={`type-${label}`}
                          className={`h-[32px] rounded-full px-[13.5px] cursor-pointer typo-button-4 py-2 ${
                            field.value === value
                              ? 'bg-inverse text-inverse'
                              : 'bg-base-1 ring ring-divider text-secondary'
                          }`}
                        >
                          <span className="px-1">{label}</span>
                        </label>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
          </div>

          {/* 상세 내용 */}
          <div className="mt-[32px] grid gap-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('profile.상세_내용')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('profile.문의하고자_하는_내용을_자세히_적어주세요')}
                      helperText={t('profile.20자_이상_입력해주세요')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* 사진 */}
          <div className="mt-10 grid gap-2">
            <FormLabel>{t('profile.사진')}</FormLabel>
            <div className="flex items-center gap-2 pb-[12px]">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  className="flex-center flex-col gap-1 size-[80px] rounded-[12px] border border-outline"
                >
                  <IcCamera />
                  <Text typo="body-2-medium" color="secondary">
                    {t('profile.사진')} ({images.length}/3)
                  </Text>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {images.length > 0 && (
                <>
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="size-[80px] rounded-[12px] border border-outline"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="size-5 bg-base-2 p-1 rounded-full flex-center absolute top-[10px] right-[8px]"
                      >
                        <IcClose className="size-3 text-icon-secondary" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-base-2" />

        <div className="px-4 pt-5 pb-10">
          {/* 답변받을 이메일 */}
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="mb-3">
                    {t('profile.답변_받으실_이메일')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('profile.이메일_주소를_입력해주세요')} />
                  </FormControl>
                  <div className="mt-6">
                    <Text typo="body-2-medium" color="caption">
                      {t('profile.답변은_평균_7일_정도_소요됩니다')}
                      <br />
                      {t('profile.문의하신_답변이_완료되면_이메일과_앱_푸시로_알려드립니다')}
                      <br />
                      {t('profile.앱_푸시가_꺼진_경우_알림이_가지_않으니_푸시_설정을_확인해주세요')}
                    </Text>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* 개인정보 수집 및 동의 */}
          <div className="my-3">
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AlertDrawer
                      hasClose
                      open={openPrivacyDrawer}
                      onOpenChange={setOpenPrivacyDrawer}
                      height="md"
                      title={t('profile.개인정보_수집_및_이용동의')}
                      trigger={
                        <button
                          type="button"
                          onClick={() => setOpenPrivacyDrawer(true)}
                          className="py-3 w-full flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            <Text typo="body-2-medium" color="primary">
                              {t('profile.개인정보_수집_및_이용동의')}
                            </Text>
                          </div>
                          <IcChevronRight className="size-4 text-icon-sub" />
                        </button>
                      }
                      body={
                        <div className="mt-[32px] mb-[46px]">
                          <Text typo="body-1-medium" color="secondary">
                            {t(
                              'profile.코니티는_개인정보보호법_등_관련_법령상의_개인정보보호_규정을_준수하며_다음과_같이_개인정보를_수집_이용합니다',
                            )}
                            <br />
                            <br />
                            <ul className="list-disc ml-4">
                              <li>{t('profile.수집_이용_항목_이름_닉네임_이메일주소_신고내용')}</li>
                              <li>{t('profile.수집_이용_목적_법률_위반_사항_신고_처리결과_회신')}</li>
                              <li>
                                {t('profile.보유_및_이용기간_전자상거래등에서의_소비자보호에_관한_법률에_따라_3년')}
                              </li>
                            </ul>
                            <br />
                            <span className="text-info">
                              {t(
                                'profile.위_개인정보_수집_이용에_동의하지_않으실_수_있으며_동의하지_않는_경우_신고가_제한됩니다',
                              )}
                            </span>
                          </Text>
                        </div>
                      }
                      footer={
                        <Button
                          className="mt-[14px] mb-[48px]"
                          onClick={(e) => {
                            e.stopPropagation()
                            field.onChange(true)

                            setTimeout(() => {
                              setOpenPrivacyDrawer(false)
                            }, 10)
                          }}
                        >
                          {t('profile.동의하기')}
                        </Button>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending || !form.getValues().privacy}>
            {isPending ? t('profile.제출_중') : t('profile.문의_보내기')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
