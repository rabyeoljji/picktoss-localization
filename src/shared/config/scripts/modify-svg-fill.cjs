const fs = require("fs")
const path = require("path")
const svgDir = path.join(__dirname, "../../../assets/svg")

const updateSvgFile = (filePath) => {
  // 파일 읽기
  const svgContent = fs.readFileSync(filePath, "utf-8")

  // fill 속성을 currentColor로 변경
  let updatedContent = svgContent.replace(/<svg([^>]+)fill="[^"]*"/, '<svg$1fill="currentColor"')

  // path 태그 내의 fill 속성 제거
  updatedContent = updatedContent.replace(/<path([^>]+)fill="[^"]*"/g, "<path$1")

  // 파일 쓰기
  fs.writeFileSync(filePath, updatedContent, "utf-8")
}

// 디렉토리 내 SVG 파일 처리
const updateAllSvgFiles = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isFile() && path.extname(file) === ".svg") {
      updateSvgFile(filePath)
    }
  })
}

updateAllSvgFiles(svgDir)
