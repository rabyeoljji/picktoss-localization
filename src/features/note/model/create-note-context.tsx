import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'
import { calculateStar, extractPlainTextAsync, generateMarkdownFromFile } from '@/features/note/lib'
import { CreateDocumentSchema, FileInfo, FileInfoSchema, isValidFileType } from '@/features/note/model/schema'

import { CreateDocumentPayload } from '@/entities/document/api'
import { useCreateDocument } from '@/entities/document/api/hooks'

import { IcWarningFilled } from '@/shared/assets/icon'
import { generateSimpleNonce } from '@/shared/lib/nonce'
import { useQueryParam } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

export type DocumentType = CreateDocumentPayload['documentType']

export interface CreateNoteState {
  documentType: DocumentType
  isPublic: boolean
  star: string
  content: string
  fileInfo: FileInfo | null
}

export interface CreateNoteContextValues extends CreateNoteState {
  // Setter functions
  setDocumentType: (documentType: DocumentType) => void
  setStar: (star: string) => void
  setIsPublic: (isPublic: boolean) => void
  setContent: (content: string) => void
  clearNoteInfo: () => void

  isPending: boolean
  handleCreateDocument: ({ onSuccess }: { onSuccess: () => void }) => Promise<void>
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
  isPublic: true,
  content: '',
  fileInfo: null,
}

export const CreateNoteContext = createContext<CreateNoteContextValues | null>(null)

export const CreateNoteProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()

  const [{ documentType }, setParams] = useQueryParam('/note/create')
  const prevDocumentTypeRef = useRef<DocumentType | null>(null) // 안정성을 위해 ref에 값 저장

  const [state, setState] = useState<{
    star: string
    content: string
    isPublic: boolean
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
    const isTypeValid = documentType !== null
    return isContentValid && isTypeValid
  }

  const checkCreateActivate = () => {
    return checkDrawerTriggerActivate()
  }

  /** fileInfo 유효성 검사 함수 */
  const validateFileInfo = (info: unknown) => {
    const result = FileInfoSchema.safeParse(info)
    if (!result.success) {
      setValidationError(t(result.error.errors[0]?.message) ?? 'file validation error')
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
      setValidationError(t('createQuiz.toast.file_not_found'))
      return
    }
    if (!isValidFileType(file)) {
      setValidationError(t('createQuiz.toast.upload_allowed_types_pdf_docx_txt'))
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

      setState((prev) => ({
        ...prev,
        content: newFileInfo.content,
        fileInfo: newFileInfo,
      }))
    } catch (err) {
      console.error('파일 처리 중 오류 발생:', err)
      setValidationError(t('createQuiz.toast.file_processing_error'))
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
    const file = new File([blob], `${generateSimpleNonce(16)}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      isPublic: state.isPublic,
      file,
      star: state.star,
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

  const handleCreateDocument = async ({ onSuccess }: { onSuccess: () => void }) => {
    if (!checkIsValid()) {
      return
    }

    const blob = new Blob([state.content], { type: 'text/markdown' })
    const file = new File([blob], `${generateSimpleNonce(16)}.md`, { type: 'text/markdown' })

    const createDocumentData = {
      file,
      isPublic: state.isPublic,
      star: state.star,
      documentType: documentType,
    }

    createDocument(createDocumentData, {
      onSuccess: ({ id }) => {
        setParams({ isLoading: true, documentId: id })
        onSuccess()
      },
      onError: (error) => {
        toast.error(t('createQuiz.toast.document_generation_failed') + ' / errorMessage: ' + error.message, {
          icon: <IcWarningFilled className="size-4 text-icon-critical" />,
        })
      },
    })
  }

  return (
    <CreateNoteContext.Provider
      value={{
        documentType,
        isPublic: state.isPublic,
        star: state.star,
        content: state.content,

        setDocumentType: (documentType: DocumentType) => setParams({ documentType }),
        setStar: (star: string) => setState((prev) => ({ ...prev, star })),
        setContent: (content: string) => setState((prev) => ({ ...prev, content })),
        clearNoteInfo,
        setIsPublic: (isPublic: boolean) => setState((prev) => ({ ...prev, isPublic })),
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
