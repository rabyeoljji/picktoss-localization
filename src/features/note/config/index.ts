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
