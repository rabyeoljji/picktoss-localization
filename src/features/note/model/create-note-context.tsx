import { createContext, useContext, useState } from 'react'

import { toast } from 'sonner'

import { GetAllDirectoriesResponse } from '@/entities/directory/api'
import { CreateDocumentRequest } from '@/entities/document/api'
import { useCreateDocument } from '@/entities/document/api/hooks'

export const MIN_LENGTH = 3000
export const MAX_LENGTH = 50000

export const MAXIMUM_QUIZ_COUNT = 40

export type DocumentType = CreateDocumentRequest['documentType'] | null
export type QuizType = CreateDocumentRequest['quizType']

export interface CreateNoteState {
  directoryId: number
  documentType: DocumentType
  documentName: string
  quizType: QuizType
  star: string
  content: {
    markdown: string
    textLength: number
  }
  emoji: string
  isValid: boolean
}

export interface CreateNoteContextValues extends CreateNoteState {
  directories: GetAllDirectoriesResponse['directories']

  // Setter functions
  setDirectoryId: (directoryId: number) => void
  setDocumentType: (documentType: DocumentType) => void
  setDocumentName: (documentName: string) => void
  setQuizType: (quizType: QuizType) => void
  setStar: (star: string) => void
  setContent: (content: { markdown: string; textLength: number }) => void
  setEmoji: (emoji: string) => void
  setIsValid: (isValid: boolean) => void

  // Keyboard visibility state
  isKeyboardVisible: boolean
  setIsKeyboardVisible: (isKeyboardVisible: boolean) => void

  handleCreateDocument: () => Promise<void>
  isPending: boolean
}

export const CreateNoteContext = createContext<CreateNoteContextValues | null>(null)

export const CreateNoteProvider = ({
  directories,
  children,
}: {
  directories: GetAllDirectoriesResponse['directories']
  children: React.ReactNode
}) => {
  // 기본 상태 정의
  const [directoryId, setDirectoryId] = useState<number>(directories[0].id)
  const [documentType, setDocumentType] = useState<DocumentType>(null)
  const [documentName, setDocumentName] = useState<string>('')
  const [quizType, setQuizType] = useState<QuizType>('MULTIPLE_CHOICE')
  const [star, setStar] = useState<string>('5')
  const [content, setContent] = useState<{ markdown: string; textLength: number }>({
    markdown: '',
    textLength: 0,
  })
  const [emoji, setEmoji] = useState<string>('📝')
  const [isValid, setIsValid] = useState<boolean>(false)

  // 키보드 가시성 상태
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)

  const { mutateAsync: createDocument, isPending } = useCreateDocument()

  const handleCreateDocument = async () => {
    if (!documentName.trim()) {
      toast.error('문서 이름을 입력해주세요.')
      return
    }

    if (content.textLength < MIN_LENGTH) {
      toast.error(`최소 ${MIN_LENGTH}자 이상 입력해주세요.`)
      return
    }

    if (!documentType) {
      toast.error('문서 타입을 선택해주세요.')
      return
    }

    try {
      const contentBlob = new Blob([content.markdown], { type: 'text/markdown' })

      await createDocument({
        file: contentBlob,
        documentName,
        directoryId: String(directoryId),
        star,
        quizType,
        documentType,
      })

      toast.success('문서가 생성되었습니다.')
    } catch (error) {
      console.error(error)
      toast.error('문서 생성에 실패했습니다.')
    }
  }

  return (
    <CreateNoteContext.Provider
      value={{
        directories,
        directoryId,
        documentType,
        documentName,
        quizType,
        star,
        content,
        emoji,
        isValid,
        isKeyboardVisible,

        setDirectoryId,
        setDocumentType,
        setDocumentName,
        setQuizType,
        setStar,
        setContent,
        setEmoji,
        setIsValid,
        setIsKeyboardVisible,

        handleCreateDocument,
        isPending,
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
