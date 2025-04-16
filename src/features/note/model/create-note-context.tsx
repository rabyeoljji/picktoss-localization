import { createContext, useContext, useEffect, useState } from 'react'

import { toast } from 'sonner'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { extractPlainText, generateMarkdownFromFile } from '@/features/note/lib'
import { CreateDocumentSchema, FileInfo, FileInfoSchema, isValidFileType } from '@/features/note/model/schema'

import { CreateDocumentPayload } from '@/entities/document/api'
import { useCreateDocument } from '@/entities/document/api/hooks'

import { IcWarningFilled } from '@/shared/assets/icon'
import { useQueryParam, useRouter } from '@/shared/lib/router'

export type DocumentType = CreateDocumentPayload['documentType']
export type QuizType = CreateDocumentPayload['quizType']

export interface CreateNoteState {
  documentType: DocumentType
  documentName: string
  quizType: QuizType | null
  star: string
  content: string
  emoji: string
  categoryId: number | null
  isPublic: boolean
  fileInfo: FileInfo | null
}

export interface CreateNoteContextValues extends CreateNoteState {
  // Setter functions
  setDocumentType: (documentType: DocumentType) => void
  setDocumentName: (documentName: string) => void
  setQuizType: (quizType: QuizType) => void
  setStar: (star: string) => void
  setContent: (content: string) => void
  setEmoji: (emoji: string) => void
  setCategoryId: (categoryId: number) => void

  isPending: boolean
  handleCreateDocument: () => Promise<void>
  checkButtonActivate: () => boolean

  // upload file
  fileInfo: FileInfo | null
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  changeFileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void

  // 유효성 에러 메세지 설정 함수
  setValidationError: (errorMessage: string | null) => void
}

export const CreateNoteContext = createContext<CreateNoteContextValues | null>(null)

export const CreateNoteProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const [initDocumentType] = useQueryParam('/note/create', 'documentType')

  const [state, setState] = useState<{
    star: string
    emoji: string
    documentName: string
    categoryId: number | null
    isPublic: boolean
    quizType: QuizType | null
    content: string
    fileInfo: FileInfo | null
    documentType: DocumentType
  }>({
    star: '5',
    emoji: '📝',
    documentName: '',
    categoryId: null,
    isPublic: true,
    quizType: null,
    content: '',
    fileInfo: null,
    documentType: initDocumentType,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // 유효성 검사 에러 상태
  const [validationError, setValidationError] = useState<string | null>(null)

  const { mutateAsync: createDocument, isPending } = useCreateDocument()

  // validation error가 설정될 때마다 토스트 생성
  useEffect(() => {
    if (validationError) {
      toast.error(validationError, {
        icon: <IcWarningFilled className="size-4 text-icon-critical" />,
      })
      setValidationError(null)
    }
  }, [validationError])

  /** 만들기 버튼 활성화 조건 체크 함수 */
  const checkButtonActivate = () => {
    const isContentValid =
      state.content.length >= DOCUMENT_CONSTRAINTS.CONTENT.MIN &&
      state.content.length <= DOCUMENT_CONSTRAINTS.CONTENT.MAX
    const isNameValid = state.documentName.trim().length > 0
    const isTypeValid = state.documentType !== null
    return isContentValid && isNameValid && isTypeValid
  }

  /** fileInfo 유효성 검사 함수 */
  const validateFileInfo = (info: unknown) => {
    const result = FileInfoSchema.safeParse(info)
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message ?? 'file validation error')
      return false
    }
    setValidationError(null)
    return true
  }

  /** file이 변경되면 fileInfo상태를 설정하는 함수 */
  const changeFileInfo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true)

    if (state.fileInfo) {
      setState({ ...state, fileInfo: null })
      setValidationError(null)
    }

    const file = e.target.files?.[0] ?? null

    if (!file) {
      setIsProcessing(false)
      setValidationError('파일이 존재하지 않습니다.')
      return
    }
    if (!isValidFileType(file)) {
      setValidationError('PDF, DOCX, TXT 파일만 업로드할 수 있습니다.')
    }

    try {
      const markdownString = await generateMarkdownFromFile(file)
      const markdownText = await extractPlainText(markdownString)

      const newFileInfo = {
        name: file.name,
        size: file.size,
        content: markdownString,
        charCount: markdownText.length,
      }
      if (!validateFileInfo(newFileInfo)) {
        return
      }

      setState({ ...state, fileInfo: newFileInfo })
    } catch (err) {
      console.error('파일 처리 중 오류 발생:', err)
      setValidationError('파일 처리 중 문제가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  /** 노트 생성 유효성 검사 함수 */
  const checkIsValid = () => {
    const blob = new Blob([state.content], { type: 'text/markdown' })
    const file = new File([blob], `${state.documentName}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      documentName: state.documentName,
      file,
      quizType: state.quizType,
      star: state.star,
      emoji: state.emoji,
      documentType: state.documentType ?? 'TEXT',
    }

    const result = CreateDocumentSchema.safeParse(createDocumentData)
    if (!result.success) {
      setValidationError(result.error.errors[0]?.message ?? 'create validation error')
      return false
    }

    setValidationError(null)
    return true
  }

  const handleCreateDocument = async () => {
    if (!checkIsValid()) {
      return
    }

    const blob = new Blob([state.content], { type: 'text/markdown' })
    const file = new File([blob], `${state.documentName}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      documentName: state.documentName,
      file,
      categoryId: state.categoryId || 0,
      isPublic: state.isPublic,
      quizType: state.quizType || 'MIX_UP',
      star: state.star,
      emoji: state.emoji,
      documentType: state.documentType,
    }

    createDocument(createDocumentData, {
      onSuccess: ({ id }) => {
        toast.success('문서가 생성되었습니다.')
        router.push('/quiz-loading', {
          search: {
            documentId: id,
            documentName: state.documentName,
            star: Number(state.star),
          },
        })
      },
      onError: (error) => {
        toast.error('문서 생성에 실패했습니다. / errorMessage: ' + error.message, {
          icon: <IcWarningFilled className="size-4 text-icon-critical" />,
        })
      },
    })
  }

  return (
    <CreateNoteContext.Provider
      value={{
        categoryId: state.categoryId,
        isPublic: state.isPublic,
        documentType: state.documentType,
        documentName: state.documentName,
        quizType: state.quizType,
        star: state.star,
        content: state.content,
        emoji: state.emoji,

        setDocumentType: (documentType: DocumentType) => setState({ ...state, documentType }),
        setDocumentName: (documentName: string) => setState({ ...state, documentName }),
        setQuizType: (quizType: QuizType) => setState({ ...state, quizType }),
        setStar: (star: string) => setState({ ...state, star }),
        setContent: (content: string) => setState({ ...state, content }),
        setEmoji: (emoji: string) => setState({ ...state, emoji }),
        setCategoryId: (categoryId: number) => setState({ ...state, categoryId }),

        fileInfo: state.fileInfo,
        changeFileInfo,
        isProcessing,
        setIsProcessing,

        checkButtonActivate,
        handleCreateDocument,
        isPending,
        setValidationError,
      }}
    >
      {children}
    </CreateNoteContext.Provider>
  )
}

export const useCreateNoteContext = () => {
  const context = useContext(CreateNoteContext)
  if (!context) {
    throw new Error('useCreateNoteContext must be used within a CreateNoteProvider')
  }
  return context
}
