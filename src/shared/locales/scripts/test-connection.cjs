const path = require('path')
const { JWT } = require('google-auth-library')
const { GoogleSpreadsheet } = require('google-spreadsheet')

// 테스트용 스크립트
const testConnection = async () => {
  try {
    console.log('Testing Google Sheets API connection...')

    // 서비스 계정 키 로드
    const credentialsPath = path.join(process.cwd(), 'picktoss-455407-978771846215.json')
    const credentials = JSON.parse(require('fs').readFileSync(credentialsPath, 'utf8'))

    console.log('Service account email:', credentials.client_email)

    // 인증 설정
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
    })

    // 스프레드시트 ID (Daily 시트 테스트)
    const docId = '1pyqFjxRbewCt9ZGD--GxbTSBTXeQcrizsRX_iBs2R8g'

    console.log('Loading spreadsheet...')
    const doc = new GoogleSpreadsheet(docId, auth)
    await doc.loadInfo()

    console.log('Spreadsheet title:', doc.title)
    console.log('Available sheets:')
    doc.sheetsByIndex.forEach((sheet, index) => {
      console.log(`  ${index}: ${sheet.title} (ID: ${sheet.sheetId})`)
    })

    // Daily 시트 테스트 (첫 번째 시트)
    const dailySheet = doc.sheetsByIndex[0]
    console.log(`\nTesting Daily sheet: ${dailySheet.title}`)

    // 셀 읽기 테스트
    await dailySheet.loadCells()
    const cellA1 = dailySheet.getCell(0, 0)
    console.log('A1 cell value:', cellA1.value)

    // 셀 쓰기 테스트
    const testCell = dailySheet.getCell(0, 3) // D1 셀
    testCell.value = `Test write at ${new Date().toISOString()}`
    await dailySheet.saveUpdatedCells()
    console.log('Successfully wrote test data to D1')

    console.log('✅ Connection test successful!')
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    console.error('Full error:', error)
  }
}

testConnection()
