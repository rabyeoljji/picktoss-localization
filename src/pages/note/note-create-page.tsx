import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { MarkdownEditor } from '@/features/editor'

import { useCreateDocument } from '@/entities/document/api/hooks'

import { IcFile, IcInfo, IcWrite } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

// Zod schema for form validation
const FormSchema = z.object({
  title: z.string().min(1, {
    message: '제목을 입력해주세요.',
  }),
  emoji: z.string(),
  content: z.object({
    html: z.string(),
    markdown: z.string().min(10, {
      message: '내용을 더 입력해주세요.',
    }),
    textLength: z.number().min(10, {
      message: '내용을 더 입력해주세요.',
    }),
  }),
  quizType: z.enum(['MIX_UP', 'MULTIPLE_CHOICE']).default('MULTIPLE_CHOICE'),
})

type FormValues = z.infer<typeof FormSchema>

const NoteCreatePage = () => {
  const [method, setMethod] = useState<'markdown' | 'file' | null>(null)
  const [content, setContent] = useState({
    html: '',
    markdown: '',
    textLength: 0,
  })

  const { mutate: createDocumentMutate, isPending } = useCreateDocument()
  const router = useRouter()

  // PWA 환경에 대응하기 위한 visualViewport 처리
  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔을 때 높이 변화 감지
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

  // 폼 초기화
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
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

  // 컨텐츠가 변경될 때마다 form에 값 업데이트
  useEffect(() => {
    form.setValue('content', content, { shouldValidate: true })
  }, [content, form])

  const onSubmit = (data: FormValues) => {
    // 마크다운 컨텐츠를 Blob으로 변환
    const contentBlob = new Blob([data.content.markdown], { type: 'text/markdown' })

    // API 요청 형식에 맞게 데이터 구성
    createDocumentMutate(
      {
        file: contentBlob,
        documentName: data.title,
        star: '3', // 별점을 하드코딩으로 3으로 설정 (문자열로 변환)
        quizType: data.quizType,
        documentType: 'TEXT',
        directoryId: '1', // 기본 디렉토리 ID 또는 state에서 받아오기
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
    <div
      className="min-h-screen max-w-xl mx-auto bg-surface-1 relative"
      style={{ height: 'var(--viewport-height, 100vh)' }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Header
            className="sticky top-0 w-full z-50"
            left={<BackButton type="close" />}
            content={
              <>
                <div className="center">전공 공부</div>
                <div className="ml-auto w-fit">
                  <Button variant="primary" size="sm" type="submit" disabled={!form.formState.isValid || isPending}>
                    {isPending ? '생성 중...' : '만들기'}
                  </Button>
                </div>
              </>
            }
          />

          {!method && <SelectMethod setMethod={setMethod} />}

          {method === 'markdown' && <NoteCreatePageMarkdown content={content} setContent={setContent} form={form} />}
          {method === 'file' && <NoteCreatePageFile />}
        </form>
      </Form>
    </div>
  )
}

export default NoteCreatePage

const NoteCreatePageMarkdown = ({
  content,
  setContent,
  form,
}: {
  content: { html: string; markdown: string; textLength: number }
  setContent: (content: { html: string; markdown: string; textLength: number }) => void
  form: ReturnType<typeof useForm<FormValues>>
}) => {
  const MIN_LENGTH = 1000
  const MAX_LENGTH = 50000
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔는지 감지 (화면 높이가 원래보다 작아졌는지 확인)
      const isKeyboard = visualViewport.height < window.innerHeight * 0.8
      setIsKeyboardVisible(isKeyboard)
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

  useEffect(() => {
    // 이모지 피커 외부 클릭 시 닫기
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    form.setValue('emoji', emojiData.emoji, { shouldValidate: true })
    setShowEmojiPicker(false)
  }

  return (
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
                    {field.value}
                  </button>
                </FormControl>
              </FormItem>
            )}
          />
          {showEmojiPicker && (
            <div className="absolute top-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.LIGHT} width={300} height={400} />
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
  )
}

const NoteCreatePageFile = () => {
  return <div></div>
}

const SelectMethod = ({ setMethod }: { setMethod: (method: 'markdown' | 'file') => void }) => {
  return (
    <div className="flex-center h-[calc(var(--viewport-height,100vh)-(var(--header-height)))]">
      <div className="grid gap-[10px] w-full">
        <SquareButton
          variant="secondary"
          size="lg"
          left={<IcWrite />}
          className="w-[180px] mx-auto"
          onClick={() => setMethod('markdown')}
        >
          직접 작성하기
        </SquareButton>
        <div className="mx-auto">
          <SquareButton
            variant="secondary"
            size="lg"
            left={<IcFile />}
            onClick={() => setMethod('file')}
            className="w-[180px]"
          >
            파일 올리기
          </SquareButton>
          <Text typo="body-1-medium" color="caption" className="mt-2">
            *txt, docx, 3MB 이상 12MB 미만
          </Text>
        </div>
      </div>
    </div>
  )
}
