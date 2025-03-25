import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { MarkdownEditor } from '@/features/editor'

import { useCreateDocument } from '@/entities/document/api/hooks'

import { IcInfo } from '@/shared/assets/icon'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const MIN_LENGTH = 1000
const MAX_LENGTH = 50000

// 마크다운 폼 정의
const MarkdownFormSchema = z.object({
  title: z.string().min(1, {
    message: '제목을 입력해주세요.',
  }),
  emoji: z.string().optional(),
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
}

export const NoteCreateMarkdownForm = ({ directoryId, onFormStateChange }: NoteCreateMarkdownFormProps) => {
  const router = useRouter()

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

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
      title: '',
      emoji: '📝',
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
    onFormStateChange?.(form.formState.isValid, isPending)
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

  // 이모지 선택기 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
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

  // 이모지 선택 핸들러
  const handleEmojiSelect = (emoji: EmojiClickData) => {
    form.setValue('emoji', emoji.emoji)
    setShowEmojiPicker(false)
  }

  // 폼 제출 처리
  const onSubmit = (data: FormValues) => {
    // 마크다운 컨텐츠를 Blob으로 변환
    const contentBlob = new Blob([data.content.markdown], { type: 'text/markdown' })

    // API 요청 형식에 맞게 데이터 구성
    createDocumentMutate(
      {
        file: contentBlob,
        documentName: data.title,
        star: '3', // 별점을 하드코딩으로 3으로 설정 (문자열로 변환)
        quizType: data.quizType, // 사용자가 선택한 퀴즈 타입으로 설정
        documentType: 'TEXT',
        directoryId: directoryId, // props로 받은 디렉토리 ID 사용
      },
      {
        onSuccess: (response) => {
          toast('문서가 생성되었습니다.')
          // 생성 성공 시 해당 문서로 이동
          router.replace('/note/:noteId', {
            params: [response.id.toString()],
          })
        },
        onError: (error) => {
          toast('문서 생성 실패')
          console.error('문서 생성 실패:', error)
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="h-[calc(var(--viewport-height,100vh)-(var(--header-height)))] flex flex-col">
          <div className="p-4 pt-6 flex items-center gap-3 border-b border-divider">
            <div className="relative" ref={emojiPickerRef}>
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="typo-h4 flex-center size-[40px] px-[10px] py-2 rounded-[6px] border border-outline bg-base-2"
                      >
                        {field.value || '📝'}
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />
              {showEmojiPicker && (
                <div className="absolute top-12 left-0 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width={320}
                    height={450}
                    theme={Theme.AUTO}
                    searchDisabled
                  />
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="새로운 퀴즈" className="typo-h3 p-0 border-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <MarkdownEditor onChange={handleEditorChange} placeholder="여기를 탭하여 입력을 시작하세요" />
          </div>

          <div
            className={cn(
              'w-full flex justify-between items-center h-[40px] px-4 py-[10px] bg-surface-1 z-10',
              isKeyboardVisible ? 'pb-[10px]' : 'pb-[40px]',
            )}
          >
            <div className="flex items-center gap-1">
              <IcInfo className="size-4 text-caption" />
              <Text typo="body-2-medium" color="caption">
                최소 {MIN_LENGTH}자 이상 입력해주세요
              </Text>
            </div>
            <div>
              <Text typo="body-2-medium">
                {content.textLength} <span className="text-sub">/ {MAX_LENGTH}</span>
              </Text>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
