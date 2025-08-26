const path = require('path')

module.exports = {
  // 스캔 대상 입력 파일/디렉토리
  input: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/shared/components/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
    './src/entities/**/*.{js,jsx,ts,tsx}',
  ],
  options: {
    defaultLng: 'ko-KR',
    lngs: ['ko-KR', 'en-US'],
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    resource: {
      loadPath: path.join(__dirname, 'src/shared/locales/{{lng}}/{{ns}}.json'),
      savePath: path.join(__dirname, 'src/shared/locales/{{lng}}/{{ns}}.json'),
    },
    defaultValue(lng, ns, key) {
      const keyAsDefaultValue = ['ko-KR']
      if (keyAsDefaultValue.includes(lng)) {
        const separator = '~~'
        return key.includes(separator) ? key.split(separator)[1] : key
      }
      return ''
    },
    keySeparator: false,
    nsSeparator: false,
    keepRemoved: true,
    sort: true,
    removeUnusedKeys: true,
    prefix: '',
    suffix: '',
  },
}
