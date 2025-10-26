import { z } from 'zod'

import { DOCUMENT_CONSTRAINTS, FILE_CONSTRAINTS } from '@/features/note/config'

// 파일 타입 체크 함수
export const isValidFileType = (file: File | null): boolean => {
  if (!file) return false

  const fileName = file.name.toLowerCase()
  const fileExtension = `.${fileName.split('.').pop()}`

  // MIME 타입 또는 확장자가 허용된 것인지 확인
  return Object.values(FILE_CONSTRAINTS.SUPPORTED_TYPES).some(
    (type) => type.mime === file.type || type.extension === fileExtension,
  )
}

// 파일 정보 스키마
export const FileInfoSchema = z.object({
  name: z.string().default('createQuiz.default_file_name'),
  size: z
    .number()
    .min(FILE_CONSTRAINTS.MIN_SIZE, 'createQuiz.toast.select_larger_file_size')
    .max(FILE_CONSTRAINTS.MAX_SIZE, 'createQuiz.toast.select_smaller_file_size'),
  charCount: z
    .number()
    .min(DOCUMENT_CONSTRAINTS.CONTENT.MIN, 'createQuiz.toast.upload_file_min_chars')
    .max(DOCUMENT_CONSTRAINTS.CONTENT.MAX, 'createQuiz.toast.upload_file_max_chars'),
  content: z.string().min(1, 'createQuiz.toast.file_content_required'),
})

export type FileInfo = z.infer<typeof FileInfoSchema>

// 문서 생성 요청 스키마
export const CreateDocumentSchema = z.object({
  isPublic: z.boolean(),
  file: z.any().refine((data) => data instanceof File, {
    message: 'The data must be a File object.',
  }),
  star: z.string(),
  documentType: z.enum(['FILE', 'TEXT', 'NOTION'], {
    required_error: '노트 유형을 선택해주세요',
  }),
})

export type CreateDocumentRequest = z.infer<typeof CreateDocumentSchema>
