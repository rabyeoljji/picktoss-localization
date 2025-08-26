const fs = require('fs')
const path = require('path')
const { glob } = require('glob')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const {
  getSpreadsheetIds,
  getAuth,
  loadSpreadsheet,
  getSheetIdByPath,
  getNamespaceByPath,
  addNamespaceToKey,
  extractTranslationKeys,
} = require('./utils.cjs')

// 스프레드시트에 데이터 업로드
const uploadToSpreadsheet = async (docId, sheetId, data) => {
  if (!docId || docId === 'your_main_doc_id') {
    console.log(`Skipping upload for invalid doc ID: ${docId}`)
    return
  }

  if (!sheetId || sheetId === 'your_profile_sheet_id') {
    console.log(`Skipping upload for invalid sheet ID: ${sheetId}`)
    return
  }

  try {
    console.log(`Uploading to document: ${docId}, sheet ID: ${sheetId}`)
    const doc = await loadSpreadsheet(docId)

    // 지정된 시트 ID로 시트 찾기
    let sheet = null
    for (const sheetInfo of doc.sheetsByIndex) {
      if (sheetInfo.sheetId.toString() === sheetId) {
        sheet = sheetInfo
        break
      }
    }

    // 시트가 없으면 새로 생성
    if (!sheet) {
      console.log(`Sheet with ID ${sheetId} not found, creating new sheet...`)
      sheet = await doc.addSheet({ title: `Sheet_${sheetId}` })
    }

    // 기존 데이터 읽기
    await sheet.loadCells()

    // 헤더 행 확인 및 설정
    const headerRow = 0
    if (!sheet.getCell(headerRow, 0).value) {
      sheet.getCell(headerRow, 0).value = 'Key'
      sheet.getCell(headerRow, 1).value = 'ko-KR'
      sheet.getCell(headerRow, 2).value = 'en-US'
    }

    // 기존 키들 수집
    const existingKeys = new Set()
    for (let row = 1; row < sheet.rowCount; row++) {
      const keyCell = sheet.getCell(row, 0)
      if (keyCell.value && keyCell.value !== 'Key') {
        existingKeys.add(keyCell.value)
      }
    }
    console.log(`Found ${existingKeys.size} existing keys in sheet`)

    // 모든 키를 새로 쓰도록 강제 설정
    const allKeys = []

    for (const [key, translations] of Object.entries(data)) {
      allKeys.push({ key, translations })
    }

    console.log(`Preparing to write ${allKeys.length} keys to sheet`)

    // 모든 키를 새로 쓰기
    if (allKeys.length > 0) {
      console.log(`Writing ${allKeys.length} keys to sheet...`)

      // 헤더 행 다음부터 시작 (1행부터)
      let rowIndex = 1

      for (const { key, translations } of allKeys) {
        console.log(`Writing key: ${key}, ko-KR: ${translations['ko-KR']}, en-US: ${translations['en-US']}`)
        sheet.getCell(rowIndex, 0).value = key
        sheet.getCell(rowIndex, 1).value = translations['ko-KR'] || key
        sheet.getCell(rowIndex, 2).value = translations['en-US'] || ''
        rowIndex++
      }
    } else {
      console.log('No keys to write')
    }

    // 변경사항 저장
    await sheet.saveUpdatedCells()
    console.log(`Successfully uploaded ${Object.keys(data).length} keys to sheet: ${sheet.title}`)
  } catch (error) {
    console.error(`Error uploading to document ${docId}, sheet ${sheetId}:`, error.message)
  }
}

// 메인 실행 함수
const main = async () => {
  try {
    console.log('Starting translation key upload from scanned files...')

    // 스프레드시트별로 데이터 분류
    const sheetDataMap = {}
    const ids = getSpreadsheetIds()
    const docId = ids.docId

    // 스캔된 번역 파일 읽기
    const koKRPath = path.join(__dirname, '../ko-KR/translation.json')
    const enUSPath = path.join(__dirname, '../en-US/translation.json')

    if (!fs.existsSync(koKRPath)) {
      console.error('Korean translation file not found. Please run scan:i18n first.')
      process.exit(1)
    }

    const koKRData = JSON.parse(fs.readFileSync(koKRPath, 'utf8'))
    const enUSData = fs.existsSync(enUSPath) ? JSON.parse(fs.readFileSync(enUSPath, 'utf8')) : {}

    // 네임스페이스별로 데이터 분류
    for (const [key, koValue] of Object.entries(koKRData)) {
      const namespace = key.split('.')[0]
      let sheetId = null

      // 네임스페이스에 따른 시트 ID 결정
      switch (namespace) {
        case 'daily':
          sheetId = ids.daily
          break
        case 'profile':
          sheetId = ids.profile
          break
        case 'explore':
          sheetId = ids.explore
          break
        case 'library':
          sheetId = ids.library
          break
        case 'createQuiz':
          sheetId = ids.createQuiz
          break
        case 'quizDetail':
          sheetId = ids.quizDetail
          break
        case 'progressQuiz':
          sheetId = ids.progressQuiz
          break
        case 'etc':
          sheetId = ids.etc
          break
        default:
          console.warn(`Unknown namespace: ${namespace} for key: ${key}`)
          continue
      }

      if (!sheetId) {
        console.warn(`No sheet ID found for namespace: ${namespace}`)
        continue
      }

      if (!sheetDataMap[sheetId]) {
        sheetDataMap[sheetId] = {}
      }

      sheetDataMap[sheetId][key] = {
        'ko-KR': koValue,
        'en-US': enUSData[key] || '',
      }
    }

    // 각 시트에 업로드
    for (const [sheetId, data] of Object.entries(sheetDataMap)) {
      if (Object.keys(data).length > 0) {
        console.log(`Uploading ${Object.keys(data).length} keys to sheet ID: ${sheetId}`)

        // 네임스페이스별로 키 개수 출력
        const namespaceCounts = {}
        for (const key of Object.keys(data)) {
          const namespace = key.split('.')[0]
          namespaceCounts[namespace] = (namespaceCounts[namespace] || 0) + 1
        }

        console.log('Keys by namespace:')
        for (const [namespace, count] of Object.entries(namespaceCounts)) {
          console.log(`  ${namespace}: ${count} keys`)
        }

        // 실제 업로드 실행
        await uploadToSpreadsheet(docId, sheetId, data)
      }
    }

    console.log('Translation key upload completed!')
  } catch (error) {
    console.error('Error in upload process:', error)
    process.exit(1)
  }
}

// 스크립트 실행
main()
