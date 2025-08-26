const path = require('path')
const { JWT } = require('google-auth-library')
const { GoogleSpreadsheet } = require('google-spreadsheet')

// 데이터 확인용 스크립트
const verifyData = async () => {
  try {
    console.log('Verifying data in Google Sheets...')

    // 서비스 계정 키 로드
    const credentialsPath = path.join(process.cwd(), 'picktoss-455407-978771846215.json')
    const credentials = JSON.parse(require('fs').readFileSync(credentialsPath, 'utf8'))

    // 인증 설정
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
    })

    // 스프레드시트 ID
    const docId = '1pyqFjxRbewCt9ZGD--GxbTSBTXeQcrizsRX_iBs2R8g'

    const doc = new GoogleSpreadsheet(docId, auth)
    await doc.loadInfo()

    console.log('Spreadsheet title:', doc.title)

    // Daily 시트 확인
    const dailySheet = doc.sheetsByIndex[0]
    console.log(`\nChecking Daily sheet: ${dailySheet.title}`)

    await dailySheet.loadCells()

    // 첫 10행의 데이터 확인
    console.log('\nFirst 10 rows of data:')
    for (let row = 0; row < Math.min(10, dailySheet.rowCount); row++) {
      const keyCell = dailySheet.getCell(row, 0)
      const koCell = dailySheet.getCell(row, 1)
      const enCell = dailySheet.getCell(row, 2)

      if (keyCell.value) {
        console.log(`Row ${row + 1}: Key="${keyCell.value}", ko-KR="${koCell.value}", en-US="${enCell.value}"`)
      }
    }

    // 전체 행 수 확인
    console.log(`\nTotal rows in Daily sheet: ${dailySheet.rowCount}`)

    // Profile 시트도 확인
    const profileSheet = doc.sheetsByIndex[6] // Profile 시트
    console.log(`\nChecking Profile sheet: ${profileSheet.title}`)

    await profileSheet.loadCells()

    // 첫 5행의 데이터 확인
    console.log('\nFirst 5 rows of Profile data:')
    for (let row = 0; row < Math.min(5, profileSheet.rowCount); row++) {
      const keyCell = profileSheet.getCell(row, 0)
      const koCell = profileSheet.getCell(row, 1)
      const enCell = profileSheet.getCell(row, 2)

      if (keyCell.value) {
        console.log(`Row ${row + 1}: Key="${keyCell.value}", ko-KR="${koCell.value}", en-US="${enCell.value}"`)
      }
    }

    console.log(`\nTotal rows in Profile sheet: ${profileSheet.rowCount}`)

    console.log('\n✅ Data verification completed!')
  } catch (error) {
    console.error('❌ Data verification failed:', error.message)
    console.error('Full error:', error)
  }
}

verifyData()
