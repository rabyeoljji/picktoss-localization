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
  name: z.string().default('새로운 노트'),
  size: z
    .number()
    .min(FILE_CONSTRAINTS.MIN_SIZE, '용량이 더 큰 파일을 선택해주세요')
    .max(FILE_CONSTRAINTS.MAX_SIZE, '용량이 더 작은 파일을 선택해주세요'),
  charCount: z
    .number()
    .min(DOCUMENT_CONSTRAINTS.CONTENT.MIN, '1,000자 이상인 파일을 업로드해주세요')
    .max(DOCUMENT_CONSTRAINTS.CONTENT.MAX, '50,000자 이하인 파일을 업로드해주세요'),
  content: z.string().min(1, '파일 내용은 필수입니다'),
})

export type FileInfo = z.infer<typeof FileInfoSchema>

// 문서 생성 요청 스키마
export const CreateDocumentSchema = z.object({
  categoryId: z.number().min(1, '카테고리 선택은 필수입니다'),
  isPublic: z.boolean(),
  file: z.any().refine((data) => data instanceof File, {
    message: 'The data must be a File object.',
  }),
  quizType: z.enum(['MULTIPLE_CHOICE', 'MIX_UP'], {
    required_error: '퀴즈 유형을 선택해주세요',
  }),
  star: z.string(),
  documentType: z.enum(['FILE', 'TEXT', 'NOTION'], {
    required_error: '노트 유형을 선택해주세요',
  }),
  emoji: z.string().default('📝'),
})

export type CreateDocumentRequest = z.infer<typeof CreateDocumentSchema>
