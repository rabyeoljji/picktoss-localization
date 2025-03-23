import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useCreateFeedback } from '@/entities/feedback/api/hooks'

import { IcCamera, IcChevronRight, IcClose } from '@/shared/assets/icon'
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
        toast.error(firstError.message as string)
      }
    }
  }, [formState.submitCount, formState.errors])

  // 이미지 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      if (images.length + fileArray.length > 3) {
        // 최대 3개 이미지 제한
        toast.error('이미지는 최대 3개까지 첨부 가능합니다.')
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
    const selectedTypeLabel = Object.entries(feedbackTypeMap).find(([_, value]) => value === data.type)?.[0] || '문의'

    createFeedback(
      {
        type: data.type,
        content: data.content,
        email: data.email,
        files: images,
        title: `[${selectedTypeLabel}] 문의`,
      },
      {
        onSuccess: () => {
          toast.success('문의가 성공적으로 접수되었습니다.')
          if (onSuccess) onSuccess()
        },
        onError: () => {
          toast.error('문의 접수에 실패했습니다. 다시 시도해주세요.')
          if (onError) onError()
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="px-4 py-5">
          <div className="grid gap-2">
            <Text typo="h4">픽토스에 전하고 싶은 말을 남겨주세요</Text>
            <Text typo="body-1-regular" color="sub">
              내용을 꼼꼼히 확인한 후 이메일로 답변 드릴게요
            </Text>
          </div>

          {/* 문의 유형 */}
          <div className="mt-10 grid gap-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>문의 유형</FormLabel>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-2">
                    {Object.entries(feedbackTypeMap).map(([label, value]) => (
                      <FormItem key={value} className="space-y-0">
                        <FormControl>
                          <RadioGroupItem value={value} id={`type-${label}`} className="peer sr-only" />
                        </FormControl>
                        <label
                          htmlFor={`type-${label}`}
                          className={`rounded-full px-3 py-2 typo-button-4 ${
                            field.value === value
                              ? 'bg-inverse text-inverse'
                              : 'bg-base-1 ring ring-divider text-secondary'
                          }`}
                        >
                          {label}
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
                  <FormLabel required>상세 내용</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="문의하고자 하는 내용을 자세히 적어주세요"
                      helperText="20자 이상 입력해주세요"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* 사진 */}
          <div className="mt-10 grid gap-2">
            <FormLabel>사진</FormLabel>
            <div className="flex items-center gap-2">
              <div className="flex items-center mb-2">
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  className="flex-center flex-col gap-1 size-[80px] rounded-[12px] border border-outline"
                >
                  <IcCamera />
                  <Text typo="body-2-medium" color="secondary">
                    사진 ({images.length}/3)
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
                        <IcClose className="size-2" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-base-2" />

        <div className="px-4 pt-5">
          {/* 답변받을 이메일 */}
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="mb-3">
                    답변 받으실 이메일
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="이메일 주소를 입력해주세요" />
                  </FormControl>
                  <div className="mt-6">
                    <Text typo="body-2-medium" color="caption">
                      답변은 평균 7일 정도 소요됩니다.
                      <br />
                      문의하신 답변이 완료되면 이메일과 앱 푸시로 알려드립니다.
                      <br />앱 푸시가 꺼진 경우 알림이 가지 않으니, 푸시 설정을 확인해주세요.
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
                      title="개인정보 수집 및 이용동의"
                      trigger={
                        <button
                          type="button"
                          onClick={() => setOpenPrivacyDrawer(true)}
                          className="py-3 w-full flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            <Text typo="body-2-medium" color="primary">
                              개인정보 수집 및 이용동의
                            </Text>
                          </div>
                          <IcChevronRight className="size-4 text-icon-sub" />
                        </button>
                      }
                      body={
                        <div className="mt-[32px] mb-[46px]">
                          <Text typo="body-1-medium" color="secondary">
                            코니티는 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 다음과 같이
                            개인정보를 수집 이용합니다,
                            <br />
                            <br />
                            <ul className="list-disc ml-4">
                              <li>수집 이용 항목: 이름(닉네임), 이메일주소, 신고내용</li>
                              <li>수집 이용 목적: 법률 위반 사항 신고, 처리결과 회신</li>
                              <li>보유 및 이용기간: 전자상거래등에서의 소비자보호에 관한 법률에 따라 3년</li>
                            </ul>
                            <br />
                            <span className="text-info">
                              *위 개인정보 수집 이용에 동의하지 않으실 수 있으며, 동의하지 않는 경우 신고가 제한됩니다.
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
                          동의하기
                        </Button>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="px-4">
          <Button type="submit" disabled={isPending || !form.getValues().privacy}>
            {isPending ? '제출 중...' : '문의 보내기'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
