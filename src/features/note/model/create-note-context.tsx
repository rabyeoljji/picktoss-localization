import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { calculateStar, extractPlainTextAsync, generateMarkdownFromFile } from '@/features/note/lib'
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
  setIsPublic: (isPublic: boolean) => void
  clearNoteInfo: () => void

  isPending: boolean
  handleCreateDocument: () => Promise<void>
  checkDrawerTriggerActivate: () => boolean
  checkCreateActivate: () => boolean

  // upload file
  fileInfo: FileInfo | null
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  changeFileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void

  // 유효성 에러 메세지 설정 함수
  setValidationError: (errorMessage: string | null) => void
}

const initialNoteState = {
  star: '5',
  emoji: '📝',
  documentName: '',
  categoryId: null,
  isPublic: true,
  quizType: null,
  content: '',
  fileInfo: null,
}

export const CreateNoteContext = createContext<CreateNoteContextValues | null>(null)

export const CreateNoteProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const [documentType, setDocumentType] = useQueryParam('/note/create', 'documentType')
  const prevDocumentTypeRef = useRef<DocumentType | null>(null) // 안정성을 위해 ref에 값 저장

  const [state, setState] = useState<{
    star: string
    emoji: string
    documentName: string
    categoryId: number | null
    isPublic: boolean
    quizType: QuizType | null
    content: string
    fileInfo: FileInfo | null
  }>(initialNoteState)
  const [isProcessing, setIsProcessing] = useState(false)

  // 유효성 검사 에러 상태
  const [validationError, setValidationError] = useState<string | null>(null)

  const { mutateAsync: createDocument, isPending } = useCreateDocument()

  // 탭을 변경하면 내용 초기화
  useEffect(() => {
    const prevDocumentType = prevDocumentTypeRef.current

    if (prevDocumentType !== documentType) {
      clearNoteInfo()
    }

    prevDocumentTypeRef.current = documentType
  }, [documentType])

  // 글자수에 따른 별 개수 설정
  useEffect(() => {
    setState((prev) => ({ ...prev, star: String(calculateStar(state.content.length)) }))
  }, [state.content])

  // validation error가 설정될 때마다 토스트 생성
  useEffect(() => {
    if (validationError) {
      toast.error(validationError, {
        icon: <IcWarningFilled className="size-4 text-icon-critical" />,
      })
      setValidationError(null)
    }
  }, [validationError])

  /** drawer trigger 활성화 조건 체크 함수 */
  const checkDrawerTriggerActivate = () => {
    const isContentValid =
      state.content.length >= DOCUMENT_CONSTRAINTS.CONTENT.MIN &&
      state.content.length <= DOCUMENT_CONSTRAINTS.CONTENT.MAX
    const isNameValid = state.documentName.trim().length > 0
    const isTypeValid = documentType !== null
    return isContentValid && isNameValid && isTypeValid
  }

  const checkCreateActivate = () => {
    return checkDrawerTriggerActivate() && state.categoryId !== null && state.quizType !== null
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

  /** file이 변경되면 fileInfo상태와 name, content를 설정하는 함수 */
  const changeFileInfo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true)

    if (state.fileInfo) {
      setState((prev) => ({ ...prev, fileInfo: null }))
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
      const markdownText = await extractPlainTextAsync(markdownString)

      const newFileInfo = {
        name: file.name,
        size: file.size,
        content: markdownString,
        charCount: markdownText.length,
      }
      if (!validateFileInfo(newFileInfo)) {
        return
      }

      const removeFileExtension = (filename: string) => {
        const lastDotIndex = filename.lastIndexOf('.')
        return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename
      }

      setState((prev) => ({
        ...prev,
        documentName: removeFileExtension(newFileInfo.name),
        content: newFileInfo.content,
        fileInfo: newFileInfo,
      }))
    } catch (err) {
      console.error('파일 처리 중 오류 발생:', err)
      setValidationError('파일 처리 중 문제가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearNoteInfo = () => {
    setState({ ...initialNoteState })
  }

  /** 노트 생성 유효성 검사 함수 */
  const checkIsValid = () => {
    const blob = new Blob([state.content], { type: 'text/markdown' })
    const file = new File([blob], `${state.documentName}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      categoryId: state.categoryId,
      isPublic: state.isPublic,
      documentName: state.documentName,
      file,
      quizType: state.quizType,
      star: state.star,
      emoji: state.emoji,
      documentType: documentType,
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
      documentType: documentType,
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
        documentType: documentType,
        categoryId: state.categoryId,
        isPublic: state.isPublic,
        documentName: state.documentName,
        quizType: state.quizType,
        star: state.star,
        content: state.content,
        emoji: state.emoji,

        setDocumentType,
        setDocumentName: (documentName: string) => setState((prev) => ({ ...prev, documentName })),
        setQuizType: (quizType: QuizType) => setState((prev) => ({ ...prev, quizType })),
        setStar: (star: string) => setState((prev) => ({ ...prev, star })),
        setContent: (content: string) => setState((prev) => ({ ...prev, content })),
        setEmoji: (emoji: string) => setState((prev) => ({ ...prev, emoji })),
        setCategoryId: (categoryId: number) => setState((prev) => ({ ...prev, categoryId })),
        setIsPublic: (isPublic: boolean) => setState((prev) => ({ ...prev, isPublic })),
        clearNoteInfo,

        fileInfo: state.fileInfo,
        changeFileInfo,
        isProcessing,
        setIsProcessing,

        checkDrawerTriggerActivate,
        checkCreateActivate,
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
