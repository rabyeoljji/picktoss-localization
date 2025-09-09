const fs = require('fs')
const path = require('path')
const { getSpreadsheetIds, getAuth, loadSpreadsheet } = require('./utils.cjs')

// 스프레드시트에서 번역 데이터 가져오기
const fetchTranslationsFromSpreadsheet = async (docId, sheetId, expectedNamespace) => {
  if (!docId || docId === 'your_main_doc_id') {
    console.log(`Skipping download for invalid doc ID: ${docId}`)
    return {}
  }

  if (!sheetId || sheetId === 'your_profile_sheet_id') {
    console.log(`Skipping download for invalid sheet ID: ${sheetId}`)
    return {}
  }

  try {
    console.log(`Fetching translations from document: ${docId}, sheet ID: ${sheetId}`)
    const doc = await loadSpreadsheet(docId)

    // 지정된 시트 ID로 시트 찾기
    let sheet = null
    for (const sheetInfo of doc.sheetsByIndex) {
      if (sheetInfo.sheetId.toString() === sheetId) {
        sheet = sheetInfo
        break
      }
    }

    if (!sheet) {
      console.log(`Sheet with ID ${sheetId} not found in ${doc.title}`)
      return {}
    }

    // 데이터 읽기 - 셀 기반으로 원문 그대로 가져오기
    const translations = {}
    const processedKeys = new Set() // 중복 키 방지
    await sheet.loadCells()

    // 헤더 행에서 컬럼 인덱스 찾기
    const headerRow = 0
    let keyCol = 0,
      koCol = 1,
      enCol = 2

    // 헤더 스캔으로 컬럼 매핑
    for (let col = 0; col < sheet.columnCount; col++) {
      const cellValue = sheet.getCell(headerRow, col)?.value
      if (typeof cellValue === 'string') {
        const normalized = cellValue.trim().toLowerCase()
        if (normalized === 'key') keyCol = col
        else if (normalized === 'ko-kr' || normalized === 'ko') koCol = col
        else if (normalized === 'en-us' || normalized === 'en') enCol = col
      }
    }

    // 데이터 행 처리 (헤더 다음 행부터)
    for (let row = 1; row < sheet.rowCount; row++) {
      const keyCell = sheet.getCell(row, keyCol)
      const koCell = sheet.getCell(row, koCol)
      const enCell = sheet.getCell(row, enCol)

      const rawKey = keyCell?.value
      if (!rawKey || typeof rawKey !== 'string') continue
      if (!rawKey.includes('.')) continue
      if (expectedNamespace && !rawKey.startsWith(expectedNamespace + '.')) continue

      // 중복 키 방지
      if (processedKeys.has(rawKey)) continue
      processedKeys.add(rawKey)

      // 셀 값 그대로 가져오기 (이모지/특수문자 보존)
      let koVal = koCell?.value
      let enVal = enCell?.value

      // null/undefined는 빈 문자열로
      if (koVal == null) koVal = ''
      if (enVal == null) enVal = ''

      // 문자열로 변환 (이모지/특수문자 유지)
      koVal = String(koVal)
      enVal = String(enVal)

      // ko-KR 값이 키 문자열과 동일하면(플레이스홀더) 빈 값으로 간주
      if (koVal === rawKey) koVal = ''

      translations[rawKey] = {
        'ko-KR': koVal,
        'en-US': enVal,
      }
    }

    console.log(`Fetched ${Object.keys(translations).length} translations from sheet: ${sheet.title}`)
    return translations
  } catch (error) {
    console.error(`Error fetching from document ${docId}, sheet ${sheetId}:`, error.message)
    return {}
  }
}

// 모든 스프레드시트에서 데이터 가져오기
const fetchAllTranslations = async () => {
  const ids = getSpreadsheetIds()
  const allTranslations = {}
  const docId = ids.docId

  // 시트와 기대 네임스페이스 매핑 (common을 첫 번째로, daily를 마지막에 처리)
  const sheetConfigs = [
    { id: ids.common, ns: 'common' },
    { id: ids.daily, ns: 'daily' },
    { id: ids.createQuiz, ns: 'createQuiz' },
    { id: ids.progressQuiz, ns: 'progressQuiz' },
    { id: ids.library, ns: 'library' },
    { id: ids.explore, ns: 'explore' },
    { id: ids.quizDetail, ns: 'quizDetail' },
    { id: ids.profile, ns: 'profile' },
    { id: ids.etc, ns: 'etc' },
  ]

  console.log('Downloading translations from Google Sheets...')

  for (const { id: sheetId, ns } of sheetConfigs) {
    const translations = await fetchTranslationsFromSpreadsheet(docId, sheetId, ns)
    // 네임스페이스별로 분리해서 병합 (같은 키라도 네임스페이스가 다르면 별개로 처리)
    for (const [key, value] of Object.entries(translations)) {
      allTranslations[key] = value
    }
  }

  return allTranslations
}

// JSON 파일로 저장
const saveTranslationsToJson = async (translations) => {
  const localesPath = path.join(process.cwd(), 'src/shared/locales')
  const lngs = ['ko-KR', 'en-US']

  // 기존 translation.json 파일 백업 (고정된 이름으로 덮어쓰기)
  for (const lng of lngs) {
    const originalPath = path.join(localesPath, lng, 'translation.json')
    const backupPath = path.join(localesPath, lng, 'translation.backup.json')

    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath)
      console.log(`Backed up ${originalPath} to ${backupPath}`)
    }
  }

  // ko-KR 값이 있는 키를 기준으로 전체 키 집합 생성
  const baseKeys = Object.entries(translations)
    .filter(([key, values]) => typeof values['ko-KR'] === 'string' && values['ko-KR'].length > 0)
    .map(([key]) => key)

  // 정렬을 위해 공통 정렬 로직 구성
  const namespaceOrder = [
    'common',
    'daily',
    'createQuiz',
    'progressQuiz',
    'library',
    'explore',
    'quizDetail',
    'profile',
    'etc',
  ]
  const orderMap = new Map(namespaceOrder.map((ns, idx) => [ns, idx]))

  const sortedKeys = [...baseKeys].sort((ka, kb) => {
    const nsa = ka.split('.')[0]
    const nsb = kb.split('.')[0]
    const oa = orderMap.has(nsa) ? orderMap.get(nsa) : Number.MAX_SAFE_INTEGER
    const ob = orderMap.has(nsb) ? orderMap.get(nsb) : Number.MAX_SAFE_INTEGER
    if (oa !== ob) return oa - ob
    return ka.localeCompare(kb)
  })

  // 언어별로 파일 생성 (en-US가 비어있어도 키 포함, 값은 빈 문자열)
  for (const lng of lngs) {
    const lngData = {}
    for (const key of sortedKeys) {
      const v = translations[key] && typeof translations[key][lng] === 'string' ? translations[key][lng] : ''
      lngData[key] = v
    }

    // JSON 파일 저장
    const filePath = path.join(localesPath, lng, 'translation.json')
    const jsonString = JSON.stringify(lngData, null, 2)

    fs.writeFileSync(filePath, jsonString, 'utf8')
    console.log(`Saved ${Object.keys(lngData).length} translations to ${filePath}`)
  }
}

// 메인 실행 함수
const main = async () => {
  try {
    console.log('Starting translation download from Google Sheets...')

    // 모든 스프레드시트에서 번역 데이터 가져오기
    const translations = await fetchAllTranslations()
    console.log(`Fetched ${Object.keys(translations).length} translation keys total`)

    // JSON 파일로 저장
    await saveTranslationsToJson(translations)

    console.log('Translation download completed!')
  } catch (error) {
    console.error('Error in download process:', error)
    process.exit(1)
  }
}

// 스크립트 실행
main()
