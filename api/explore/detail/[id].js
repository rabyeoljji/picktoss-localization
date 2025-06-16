export default async function handler(req, res) {
  const { id } = req.query

  try {
    // API URL 설정
    const apiUrl = process.env.VITE_API_URL || 'https://api.picktoss.com'

    // 문서 데이터 가져오기
    const response = await fetch(`${apiUrl}/documents/${id}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Picktoss-OG-Bot/1.0',
      },
    })

    let document = null
    if (response.ok) {
      document = await response.json()
    }

    // 메타 데이터 설정
    const title = document ? `${document.name} - 픽토스` : '픽토스: 나를 성장시키는 AI 퀴즈'
    const description = document?.previewContent || document?.description || '나를 성장시키는 똑똑한 퀴즈'
    const image = document?.ogImage || 'https://picktoss.com/images/og-image.png'
    const url = `https://picktoss.com/explore/detail/${id}`

    // HTML 생성
    const html = `<!doctype html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#00000000" />
  
      <title>${title}</title>
      <meta name="description" content="${description}" />
  
      <!-- OpenGraph meta tags -->
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${url}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
  
      <!-- Twitter Card meta tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
  
      <!-- Favicon -->
      <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
      <link rel="mask-icon" href="/favicon/apple-touch-icon.png" color="#FF9928" />
  
      <link rel="canonical" href="${url}" />
  
      <!-- PWA -->
      <link rel="manifest" href="/manifest.webmanifest" />
      
      <!-- 봇이 아닌 사용자는 SPA로 리다이렉트 -->
      <script>
        if (!/bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|kakaotalk/i.test(navigator.userAgent)) {
          window.location.href = '${url}';
        }
      </script>
      
      <!-- Kakao JavaScript SDK -->
      <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
    </head>
    <body>
      <div id="root">
        <!-- 크롤러를 위한 기본 컨텐츠 -->
        <div style="padding: 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1>${title}</h1>
          <p>${description}</p>
          ${image ? `<img src="${image}" alt="픽토스 미리보기" style="max-width: 100%; height: auto; border-radius: 8px;" />` : ''}
          <p>
            <a href="${url}" style="color: #FF9928; text-decoration: none;">
              픽토스에서 보기 →
            </a>
          </p>
        </div>
      </div>
      <script type="module" src="/src/app/main.tsx"></script>
    </body>
  </html>`

    // 응답 설정
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')
    res.status(200).send(html)
  } catch (error) {
    console.error('Error in explore page handler:', error)

    // 에러 시 기본 페이지로 리다이렉트
    res.redirect(302, `https://picktoss.com/explore/detail/${id}`)
  }
}
