import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { MarkdownEditor } from '@/features/editor'

import { useCreateDocument } from '@/entities/document/api/hooks'

import { IcInfo } from '@/shared/assets/icon'
import { Form } from '@/shared/components/ui/form'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

const MIN_LENGTH = 1000
const MAX_LENGTH = 50000

// 마크다운 폼 정의
const MarkdownFormSchema = z.object({
  content: z.object({
    html: z.string(),
    markdown: z.string(),
    textLength: z.number().min(1000, {
      message: '최소 1000자 이상 입력해주세요.',
    }),
  }),
  quizType: z.enum(['MIX_UP', 'MULTIPLE_CHOICE']).default('MULTIPLE_CHOICE'),
})

type FormValues = z.infer<typeof MarkdownFormSchema>

interface NoteCreateMarkdownFormProps {
  directoryId: string
  onFormStateChange?: (isValid: boolean, isPending: boolean) => void
  title: string
  onSuccess: (id: number) => void
  onError: () => void
}

export const NoteCreateMarkdownForm = ({
  directoryId,
  onFormStateChange,
  title,
  onSuccess,
  onError,
}: NoteCreateMarkdownFormProps) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // 상태 초기화
  const [content, setContent] = useState({
    html: '',
    markdown: '',
    textLength: 0,
  })

  const { mutate: createDocumentMutate, isPending } = useCreateDocument()

  // 폼 초기화
  const form = useForm<FormValues>({
    resolver: zodResolver(MarkdownFormSchema),
    defaultValues: {
      content: {
        html: '',
        markdown: '',
        textLength: 0,
      },
      quizType: 'MULTIPLE_CHOICE',
    },
  })

  // 폼 상태가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    const isValidContent = form.formState.isValid
    onFormStateChange?.(isValidContent, isPending)
  }, [form.formState.isValid, isPending, onFormStateChange])

  // 컨텐츠가 변경될 때마다 form에 값 업데이트
  useEffect(() => {
    form.setValue('content', content, { shouldValidate: true })
  }, [content, form])

  // 키보드 감지 로직
  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔는지 감지 및 CSS 변수 설정
      const isKeyboard = visualViewport.height < window.innerHeight * 0.8
      setIsKeyboardVisible(isKeyboard)

      // 높이 변수 설정 (필요한 경우)
      document.documentElement.style.setProperty('--viewport-height', `${visualViewport.height}px`)
    }

    visualViewport.addEventListener('resize', handleViewportChange)
    visualViewport.addEventListener('scroll', handleViewportChange)

    // 초기 실행
    handleViewportChange()

    return () => {
      visualViewport.removeEventListener('resize', handleViewportChange)
      visualViewport.removeEventListener('scroll', handleViewportChange)
    }
  }, [])

  // 에디터 변경 핸들러
  const handleEditorChange = (html: string, markdown: string) => {
    const getTextFromHtml = (html: string) => {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      return tempDiv.textContent || ''
    }

    const textContent = getTextFromHtml(html)
    const textLength = textContent.length

    setContent({ html, markdown, textLength })
  }

  // 폼 제출 처리
  const onSubmit = (data: FormValues) => {
    // 마크다운 컨텐츠를 Blob으로 변환
    const contentBlob = new Blob([data.content.markdown], { type: 'text/markdown' })

    // API 요청 형식에 맞게 데이터 구성
    createDocumentMutate(
      {
        file: contentBlob,
        documentName: title,
        star: '3', // 별점을 하드코딩으로 3으로 설정 (문자열로 변환)
        quizType: data.quizType, // 사용자가 선택한 퀴즈 타입으로 설정
        documentType: 'TEXT',
        directoryId: directoryId, // props로 받은 디렉토리 ID 사용
      },
      {
        onSuccess: (response) => {
          onSuccess(response.id)
        },
        onError: (error) => {
          console.error(error)
          onError()
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        {/* h-screen - header-height - emoji-title-input-height */}
        <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height))-81px)] flex flex-col">
          <div className="flex-1 overflow-auto">
            <MarkdownEditor
              className="flex-1"
              onChange={handleEditorChange}
              placeholder="여기를 탭하여 입력을 시작하세요"
            />
          </div>

          <div
            className={cn(
              'flex justify-between items-center pt-2 pb-8 px-4 border-t border-divider',
              isKeyboardVisible && 'pb-2',
            )}
          >
            <div className="flex items-center gap-[2px]">
              <IcInfo className="size-4 text-base-6" />
              <Text typo="body-1-regular" color="caption">
                {content.textLength} / {MAX_LENGTH}자
              </Text>
            </div>
            <div className={content.textLength < MIN_LENGTH ? 'text-danger' : 'text-success'}>
              <Text typo="body-1-medium">
                {content.textLength < MIN_LENGTH
                  ? `최소 ${MIN_LENGTH}자 이상 (${MIN_LENGTH - content.textLength}자 남음)`
                  : '작성 완료'}
              </Text>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
