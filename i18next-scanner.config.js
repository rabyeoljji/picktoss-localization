const path = require('path')
const typescriptTransform = require('i18next-scanner-typescript')

// JavaScript와 TypeScript 파일 확장자
const COMMON_EXTENSIONS = '/**/*.{js,jsx,ts,tsx}'

module.exports = {
  // 스캔 대상 입력 파일/디렉토리
  input: [
    `./src/pages${COMMON_EXTENSIONS}`,
    `./src/shared/components${COMMON_EXTENSIONS}`,
    `./src/features${COMMON_EXTENSIONS}`,
    `./src/entities${COMMON_EXTENSIONS}`,
  ],
  options: {
    defaultLng: 'ko-KR', // 기본 언어 설정: 'ko-KR'
    lngs: ['ko-KR', 'en-US'], // 지원 언어 목록
    func: {
      // 번역 함수 이름 목록
      list: ['i18next.t', 'i18n.t', '$i18n.t', 't'],
      extensions: ['.js', '.jsx'], // .ts, .tsx 입력 X
    },
    trans: {
      extensions: ['.js', '.jsx'], // .ts, .tsx 입력 X
    },
    resource: {
      // 번역 파일 경로. {{lng}}, {{ns}}는 언어 및 네임스페이스로 대체
      loadPath: path.join(__dirname, 'src/shared/locales/{{lng}}/{{ns}}.json'),
      savePath: path.join(__dirname, 'src/shared/locales/{{lng}}/{{ns}}.json'),
    },
    defaultValue(lng, ns, key) {
      // 기본 언어(ko-KR)의 키값을 기본값으로 사용
      const keyAsDefaultValue = ['ko-KR']
      if (keyAsDefaultValue.includes(lng)) {
        const separator = '~~'
        return key.includes(separator) ? key.split(separator)[1] : key
      }

      return '' // 다른 언어는 빈 문자열로 설정
    },
    // 키 중복 처리
    keySeparator: false,
    nsSeparator: false,
    // 누락된 키 처리
    keepRemoved: true,
    // 키 정렬
    sort: true,
    // 중복 키 제거
    removeUnusedKeys: true,
    // 키 접두사
    prefix: '',
    // 키 접미사
    suffix: '',
    // 키 변환
    transform: function (file, enc, done) {
      const parser = this.parser
      const content = fs.readFileSync(file.path, enc)
      let match

      // t 함수 호출 찾기
      const tFunctionRegex = /t\(['"`]([^'"`]+)['"`]/g
      while ((match = tFunctionRegex.exec(content)) !== null) {
        parser.set(match[1])
      }

      // useTranslation 훅에서 사용되는 키 찾기
      const useTranslationRegex = /useTranslation\(['"`]([^'"`]+)['"`]\)/g
      while ((match = useTranslationRegex.exec(content)) !== null) {
        parser.set(match[1])
      }

      done()
    },
  },
  transform: {
    extensions: ['.ts', '.tsx'],
    transform: typescriptTransform({
      extensions: ['.ts', '.tsx'],
    }),
  },
}
