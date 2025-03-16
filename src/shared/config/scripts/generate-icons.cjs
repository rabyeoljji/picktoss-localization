const fs = require('fs')
const path = require('path')

const svgDir = path.join(__dirname, '../../assets/icon')
const indexFile = path.join(svgDir, 'index.ts')

const toPascalCase = (str) => {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const generateIndex = () => {
  // SVG 파일 목록 가져오기
  const svgFiles = fs.readdirSync(svgDir).filter((file) => file.endsWith('.svg'))

  // index.ts 파일 내용 생성
  let indexContent = '// This file is auto-generated. Do not edit manually\n\n'

  // 각 SVG 파일에 대한 import 구문 생성
  svgFiles.forEach((file) => {
    const componentName = toPascalCase(path.basename(file, '.svg'))
    indexContent += `import ${componentName} from './${file}?react'\n`
  })

  // export 구문 생성
  indexContent += '\nexport {\n'
  svgFiles.forEach((file) => {
    const componentName = toPascalCase(path.basename(file, '.svg'))
    indexContent += `  ${componentName},\n`
  })
  indexContent += '}\n'

  // 파일 쓰기
  fs.writeFileSync(indexFile, indexContent, 'utf-8')
  console.log('Successfully generated index.ts for SVG files')
}

generateIndex()
