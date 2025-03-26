import { createContext, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { GetAllDirectoriesResponse } from '@/entities/directory/api'
import { CreateDocumentRequest } from '@/entities/document/api'

export const MIN_LENGTH = 3000
export const MAX_LENGTH = 50000

export const MAXIMUM_QUIZ_COUNT = 40

const formSchema = z.object({
  directoryId: z.number(),
  documentType: z.enum(['TEXT', 'FILE', 'NOTION']).nullable(),
  documentName: z.string().nonempty({ message: '이름을 입력하세요.' }),
  quizType: z.enum(['MIX_UP', 'MULTIPLE_CHOICE']).default('MULTIPLE_CHOICE'),
  star: z.string().default('5'),
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
  emoji: z.string().default('📝'),
})

export type CreateNoteFormValues = z.infer<typeof formSchema>

export interface CreateNoteContextValues {
  directories: GetAllDirectoriesResponse['directories']
  form: ReturnType<typeof useForm<CreateNoteFormValues>>

  // Watched values
  directoryId: CreateNoteFormValues['directoryId']
  documentType: CreateNoteFormValues['documentType']
  documentName: CreateNoteFormValues['documentName']
  quizType: CreateNoteFormValues['quizType']
  star: CreateNoteFormValues['star']
  content: CreateNoteFormValues['content']
  emoji: CreateNoteFormValues['emoji']

  // Setter functions
  setDirectoryId: (directoryId: number) => void
  setDocumentType: (documentType: CreateDocumentRequest['documentType']) => void
  setDocumentName: (documentName: CreateDocumentRequest['documentName']) => void
  setQuizType: (quizType: CreateDocumentRequest['quizType']) => void
  setStar: (star: CreateDocumentRequest['star']) => void
  setContent: (content: { markdown: string; textLength: number }) => void
  setEmoji: (emoji: string) => void

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
  const form = useForm<CreateNoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      directoryId: directories[0].id,
      documentType: null,
      documentName: '',
      quizType: 'MULTIPLE_CHOICE',
      star: '5',
      content: {
        markdown: '',
        textLength: 0,
      },
      emoji: '📝',
    },
  })

  // Watch form values
  const directoryId = form.watch('directoryId')
  const documentType = form.watch('documentType')
  const documentName = form.watch('documentName')
  const quizType = form.watch('quizType')
  const star = form.watch('star')
  const content = form.watch('content')
  const emoji = form.watch('emoji')

  // Manage keyboard visibility with useState
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // Create setter functions
  const setDirectoryId = (value: number) => {
    form.setValue('directoryId', value, { shouldValidate: true })
  }

  const setDocumentType = (value: CreateDocumentRequest['documentType']) => {
    form.setValue('documentType', value, { shouldValidate: true })
  }

  const setDocumentName = (value: CreateDocumentRequest['documentName']) => {
    form.setValue('documentName', value, { shouldValidate: true })
  }

  const setQuizType = (value: CreateDocumentRequest['quizType']) => {
    form.setValue('quizType', value, { shouldValidate: true })
  }

  const setStar = (value: CreateDocumentRequest['star']) => {
    form.setValue('star', value, { shouldValidate: true })
  }

  const setContent = (value: { markdown: string; textLength: number }) => {
    form.setValue('content', value, { shouldValidate: true })
  }

  const setEmoji = (value: string) => {
    form.setValue('emoji', value, { shouldValidate: true })
  }

  return (
    <CreateNoteContext.Provider
      value={{
        directories,
        form,
        directoryId,
        documentType,
        documentName,
        quizType,
        star,
        content,
        emoji,
        isKeyboardVisible,
        setDirectoryId,
        setDocumentType,
        setDocumentName,
        setQuizType,
        setStar,
        setContent,
        setEmoji,
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
