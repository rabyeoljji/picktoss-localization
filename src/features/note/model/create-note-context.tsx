import { createContext, useContext, useState } from 'react'

import { GetAllDirectoriesResponse } from '@/entities/directory/api'

export const MIN_LENGTH = 3000
export const MAX_LENGTH = 50000

export const MAXIMUM_QUIZ_COUNT = 40

export type DocumentType = 'TEXT' | 'FILE' | 'NOTION' | null
export type QuizType = 'MIX_UP' | 'MULTIPLE_CHOICE'

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
  isLoading: boolean
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
  setIsLoading: (isLoading: boolean) => void

  // Keyboard visibility state
  isKeyboardVisible: boolean
  setIsKeyboardVisible: (isKeyboardVisible: boolean) => void
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 키보드 가시성 상태
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false)

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
        isLoading,
        isKeyboardVisible,
        setDirectoryId,
        setDocumentType,
        setDocumentName,
        setQuizType,
        setStar,
        setContent,
        setEmoji,
        setIsValid,
        setIsLoading,
        setIsKeyboardVisible,
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
