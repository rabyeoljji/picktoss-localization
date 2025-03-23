import { ChangeEvent, FormEvent, useRef, useState } from 'react'

import { toast } from 'sonner'

import { useCreateFeedback } from '@/entities/feedback/api/hooks'

import { IcCamera, IcChevronRight, IcClose } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRouter } from '@/shared/lib/router'

type FeedbackType = 'ERROR' | 'PARTNERSHIP' | 'ACCOUNT_INFO' | 'OTHER'

// 문의유형별 매핑
const feedbackTypeMap: Record<string, FeedbackType> = {
  오류: 'ERROR',
  제휴: 'PARTNERSHIP',
  회원정보: 'ACCOUNT_INFO',
  기타: 'OTHER',
}

export const FeedbackPage = () => {
  const router = useRouter()
  const { mutate: createFeedback, isPending } = useCreateFeedback()
  const [privacy, setPrivacy] = useState(false)
  const [openPrivacyDrawer, setOpenPrivacyDrawer] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('')
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 이미지 선택 처리
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      if (images.length + fileArray.length > 3) {
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
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!selectedType) {
      toast.error('문의 유형을 선택해주세요.')
      return
    }

    if (!content.trim() || content.trim().length < 20) {
      toast.error('상세 내용을 20자 이상 입력해주세요.')
      return
    }

    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.')
      return
    }

    if (!privacy) {
      toast.error('개인정보 수집 및 이용동의가 필요합니다.')
      return
    }

    createFeedback(
      {
        type: feedbackTypeMap[selectedType],
        content,
        email,
        files: images,
        title: `[${selectedType}] 문의`,
      },
      {
        onSuccess: () => {
          toast('문의가 성공적으로 접수되었습니다.')
          router.back()
        },
        onError: () => {
          toast('문의 접수에 실패했습니다. 다시 시도해주세요.')
        },
      },
    )
  }

  return (
    <div className="min-h-screen bg-base-1 flex flex-col pb-[40px]">
      <Header left={<BackButton />} title="문의하기" />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="px-4 py-5">
          <div className="grid gap-2">
            <Text typo="h4">픽토스에 전하고 싶은 말을 남겨주세요</Text>
            <Text typo="body-1-regular" color="sub">
              내용을 꼼꼼히 확인한 후 이메일로 답변 드릴게요
            </Text>
          </div>

          {/* 문의 유형 */}
          <div className="mt-10 grid gap-3">
            <Label required>문의 유형</Label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="flex flex-wrap gap-2">
              {Object.keys(feedbackTypeMap).map((type) => (
                <RadioGroupItem key={type} value={type} id={`type-${type}`} className="peer sr-only" />
              ))}
              <label
                htmlFor="type-오류"
                className={`rounded-full px-3 py-2 typo-button-4 ${
                  selectedType === '오류' ? 'bg-inverse text-inverse' : 'bg-base-1 ring ring-divider text-secondary'
                }`}
              >
                오류
              </label>
              <label
                htmlFor="type-제휴"
                className={`rounded-full px-3 py-2 typo-button-4 ${
                  selectedType === '제휴' ? 'bg-inverse text-inverse' : 'bg-base-1 ring ring-divider text-secondary'
                }`}
              >
                제휴
              </label>
              <label
                htmlFor="type-회원정보"
                className={`rounded-full px-3 py-2 typo-button-4 ${
                  selectedType === '회원정보' ? 'bg-inverse text-inverse' : 'bg-base-1 ring ring-divider text-secondary'
                }`}
              >
                회원정보
              </label>
              <label
                htmlFor="type-기타"
                className={`rounded-full px-3 py-2 typo-button-4 ${
                  selectedType === '기타' ? 'bg-inverse text-inverse' : 'bg-base-1 ring ring-divider text-secondary'
                }`}
              >
                기타
              </label>
            </RadioGroup>
          </div>

          {/* 상세 내용 */}
          <div className="mt-[32px] grid gap-2">
            <Label required>상세 내용</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의하고자 하는 내용을 자세히 적어주세요"
              helperText="20자 이상 입력해주세요"
            />
          </div>

          {/* 사진 */}
          <div className="mt-10 grid gap-2">
            <Label>사진</Label>
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
            <Label required className="mb-3">
              답변 받으실 이메일
            </Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />
            <div className="mt-6">
              <Text typo="body-2-medium" color="caption">
                답변은 평균 7일 정도 소요됩니다.
                <br />
                문의하신 답변이 완료되면 이메일과 앱 푸시로 알려드립니다.
                <br />앱 푸시가 꺼진 경우 알림이 가지 않으니, 푸시 설정을 확인해주세요.
              </Text>
            </div>
          </div>

          {/* 개인정보 수집 및 동의 */}
          <div className="my-3">
            <AlertDrawer
              hasClose
              open={openPrivacyDrawer}
              onOpenChange={setOpenPrivacyDrawer}
              title="개인정보 수집 및 이용동의"
              trigger={
                <button className="py-3 w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={privacy} />
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
                    코니티는 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 다음과 같이 개인정보를 수집
                    이용합니다,
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
                  onClick={() => {
                    setPrivacy(true)
                    setOpenPrivacyDrawer(false)
                  }}
                >
                  동의하기
                </Button>
              }
            />
          </div>
        </div>

        <Button disabled={isPending || !privacy}>{isPending ? '제출 중...' : '문의 확인하기'}</Button>
      </form>
    </div>
  )
}
