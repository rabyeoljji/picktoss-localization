const path = require('path')
const fs = require('fs')
const { JWT } = require('google-auth-library')
const { GoogleSpreadsheet } = require('google-spreadsheet')

// 스프레드시트 ID들을 가져오는 함수
const getSpreadsheetIds = () => {
  return {
    docId: '1pyqFjxRbewCt9ZGD--GxbTSBTXeQcrizsRX_iBs2R8g',
    profile: '155541024',
    explore: '497513136',
    library: '1568600552',
    createQuiz: '1393231670',
    quizDetail: '91884141',
    daily: '0',
    progressQuiz: '569607710',
    etc: '1693238403',
  }
}

// Google 서비스 계정 인증 설정
const getAuth = () => {
  const credentialsPath = path.join(process.cwd(), 'picktoss-455407-978771846215.json')

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found at: ${credentialsPath}`)
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
  })
}

// 스프레드시트 문서 로드
const loadSpreadsheet = async (docId) => {
  const auth = getAuth()
  const doc = new GoogleSpreadsheet(docId, auth)
  await doc.loadInfo()
  return doc
}

// 파일 경로에 따른 적절한 시트 ID 결정
const getSheetIdByPath = (filePath) => {
  const ids = getSpreadsheetIds()

  if (filePath.includes('/account/') || filePath.includes('/invite/')) {
    return ids.profile
  }

  if (filePath.includes('/explore/')) {
    return ids.explore
  }

  if (filePath.includes('/library/')) {
    return ids.library
  }

  if (filePath.includes('/note-create/')) {
    return ids.createQuiz
  }

  if (filePath.includes('/quiz-detail/')) {
    return ids.quizDetail
  }

  if (filePath.includes('home-page.tsx')) {
    return ids.daily
  }

  if (filePath.includes('progress-quiz-page.tsx')) {
    return ids.progressQuiz
  }

  // theme-quiz와 search-page.tsx는 제외
  if (filePath.includes('/theme-quiz/') || filePath.includes('search-page.tsx')) {
    return ''
  }

  return ids.etc
}

// 파일 경로에 따른 네임스페이스 결정
const getNamespaceByPath = (filePath) => {
  if (filePath.includes('/account/') || filePath.includes('/invite/')) {
    return 'profile'
  }

  if (filePath.includes('/explore/')) {
    return 'explore'
  }

  if (filePath.includes('/library/')) {
    return 'library'
  }

  if (filePath.includes('/note-create/')) {
    return 'createQuiz'
  }

  if (filePath.includes('/quiz-detail/')) {
    return 'quizDetail'
  }

  if (filePath.includes('home-page.tsx')) {
    return 'daily'
  }

  if (filePath.includes('progress-quiz-page.tsx')) {
    return 'progressQuiz'
  }

  // theme-quiz와 search-page.tsx는 제외
  if (filePath.includes('/theme-quiz/') || filePath.includes('search-page.tsx')) {
    return null
  }

  return 'etc'
}

// 키 이름에 네임스페이스 추가
const addNamespaceToKey = (key, namespace) => {
  // 이미 네임스페이스가 있는 경우 그대로 반환
  if (key.includes('.')) {
    return key
  }

  // 네임스페이스가 없는 경우 추가
  return `${namespace}.${key}`
}

// 번역 키 추출 및 정리
const extractTranslationKeys = (content, filePath) => {
  const keys = []
  const namespace = getNamespaceByPath(filePath)

  if (!namespace) {
    return keys // 제외된 파일들
  }

  // t 함수 호출 패턴
  const tFunctionRegex = /t\(['"`]([^'"`]+)['"`]/g
  let match

  while ((match = tFunctionRegex.exec(content)) !== null) {
    const key = match[1]

    // amplitude 관련 키 제외
    if (key.includes('_click') || key.includes('_view') || key.includes('_clicked')) {
      continue
    }

    const namespacedKey = addNamespaceToKey(key, namespace)
    keys.push(namespacedKey)
  }

  return [...new Set(keys)] // 중복 제거
}

module.exports = {
  getSpreadsheetIds,
  getAuth,
  loadSpreadsheet,
  getSheetIdByPath,
  getNamespaceByPath,
  addNamespaceToKey,
  extractTranslationKeys,
}
