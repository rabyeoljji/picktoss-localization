import { z } from 'zod'

export const MINIMUM_QUIZ_COUNT = 5
export const MAXIMUM_QUIZ_COUNT = 40

/** 글자수 제한 */
export const DOCUMENT_CONSTRAINTS = {
  TITLE: {
    MIN: 1,
    MAX: 50,
  },
  CONTENT: {
    MIN: 3000,
    MAX: 50000,
  },
} as const

/** 파일 관련 상수 */
export const FILE_CONSTRAINTS = {
  MIN_SIZE: 6 * 1024, // 6KB
  MAX_SIZE: 12 * 1024 * 1024, // 12MB
  SUPPORTED_TYPES: {
    PDF: {
      mime: 'application/pdf',
      extension: '.pdf',
    },
    DOCX: {
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: '.docx',
    },
    TXT: {
      mime: 'text/plain',
      extension: '.txt',
    },
  },
} as const

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
  directoryId: z.string().min(1, '폴더 선택은 필수입니다'),
  documentName: z
    .string()
    .min(DOCUMENT_CONSTRAINTS.TITLE.MIN, '노트 제목을 입력해주세요')
    .max(DOCUMENT_CONSTRAINTS.TITLE.MAX, '노트 제목은 30자까지 작성할 수 있어요'),
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
