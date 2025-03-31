import { createContext, useContext, useState } from 'react'

import { extractPlainText, generateMarkdownFromFile } from '@/features/note/lib'
import { useCreateNoteContext } from '@/features/note/model/create-note-context'
import { FileInfo, FileInfoSchema, isValidFileType } from '@/features/note/model/schema'

export interface UploadFileContextValues {
  fileInfo: FileInfo | null
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  changeFileInfo: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const UploadFileContext = createContext<UploadFileContextValues | null>(null)

export const UploadFileProvider = ({ children }: { children: React.ReactNode }) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { setValidationError } = useCreateNoteContext()

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

    if (fileInfo) {
      setFileInfo(null)
      setValidationError(null)
    }

    const file = e.target.files?.[0] ?? null

    if (!file) {
      if (!isValidFileType(file)) {
        setValidationError('PDF, DOCX, TXT 파일만 업로드할 수 있습니다.')
      }
      setIsProcessing(false)
      if (e.target) {
        e.target.value = ''
        setFileInfo(null)
      }
      return
    }

    try {
      const markdownString = await generateMarkdownFromFile(file)
      const markdownText = await extractPlainText(markdownString)

      const removeFileExtension = (filename: string) => {
        const lastDotIndex = filename.lastIndexOf('.')
        return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename
      }

      const newFileInfo = {
        name: removeFileExtension(file.name),
        size: file.size,
        content: markdownString,
        charCount: markdownText.length,
      }
      if (!validateFileInfo(newFileInfo)) {
        if (e.target) {
          e.target.value = ''
          setFileInfo(null)
        }
        return
      }

      setFileInfo(newFileInfo)
    } catch (err) {
      console.error('파일 처리 중 오류 발생:', err)
      setValidationError('파일 처리 중 문제가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <UploadFileContext.Provider
      value={{
        fileInfo,
        isProcessing,
        setIsProcessing,
        changeFileInfo,
      }}
    >
      {children}
    </UploadFileContext.Provider>
  )
}

export const useUploadFileContext = () => {
  const context = useContext(UploadFileContext)
  if (!context) {
    throw new Error('useCreateNoteContext must be used within a CreateNoteProvider')
  }
  return context
}
