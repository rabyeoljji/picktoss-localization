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
const formSchema = z.object({
  content: z.object({
    markdown: z.string(),
    textLength: z
      .number()
      .min(MIN_LENGTH, {
        message: `최소 ${MIN_LENGTH}자 이상 입력해주세요.`,
      })
      .max(MAX_LENGTH, {
        message: `최대 ${MAX_LENGTH}자 이하 입력해주세요.`,
      }),
  }),
  quizType: z.enum(['MIX_UP', 'MULTIPLE_CHOICE']).default('MULTIPLE_CHOICE'),
})

type FormValues = z.infer<typeof formSchema>

interface NoteCreateMarkdownFormProps {
  directoryId: string
  onFormStateChange?: (isValid: boolean, isPending: boolean) => void
  title: string
  onSuccess: (id: number) => void
  onError: () => void
  content: { markdown: string; textLength: number }
  setContent: ({ markdown, textLength }: { markdown: string; textLength: number }) => void
}

export const NoteCreateMarkdownForm = ({
  directoryId,
  onFormStateChange,
  title,
  onSuccess,
  onError,
  content,
  setContent,
}: NoteCreateMarkdownFormProps) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // API 훅 호출
  const { mutate: createDocumentMutate, isPending } = useCreateDocument()

  // Form 초기화
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: {
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
    form.setValue('content', content, {
      shouldValidate: true,
    })
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

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (markdown: string) => {
    setContent({
      markdown,
      textLength: markdown.length,
    })
  }

  // 폼 제출 핸들러
  const onSubmit = (data: FormValues) => {
    if (!title.trim()) {
      return
    }

    // 마크다운 컨텐츠를 Blob으로 변환
    const contentBlob = new Blob([data.content.markdown], { type: 'text/markdown' })

    createDocumentMutate(
      {
        file: contentBlob,
        documentName: title,
        directoryId: directoryId,
        star: '3', // 별점 기본값
        quizType: data.quizType,
        documentType: 'TEXT',
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
            <div className="flex items-center gap-1">
              <IcInfo className="size-4 text-icon-sub" />
              <Text typo="body-1-regular" color="caption">
                최소 1000자 이상 입력해주세요
              </Text>
            </div>
            <div className={content.textLength < MIN_LENGTH ? 'text-danger' : 'text-success'}>
              <Text typo="body-1-medium" color="secondary">
                {content.textLength} / {MAX_LENGTH}
              </Text>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
