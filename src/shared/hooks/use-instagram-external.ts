import { useEffect } from 'react'

export function useInstagramExternal() {
  useEffect(() => {
    const ua = navigator.userAgent
    const isInstagram = /Instagram/i.test(ua)

    // '?ext=1' 같은 플래그가 있으면 재귀 호출 방지
    const already = new URL(location.href).searchParams.has('ext')
    if (!isInstagram || already) return

    const target =
      location.origin +
      location.pathname +
      location.search + // 쿼리에 무엇이 있든 그대로 두고
      (location.search ? '&' : '?') + // 쿼리 없는 주소엔 '?' 붙이기
      'ext=1'

    // 인스타그램 내장 브라우저에서 외부 브라우저로 열기
    // 인스타그램은 외부 브라우저로 열기 위한 특별한 스킴을 제공하지 않으므로
    // 사용자에게 직접 외부 브라우저에서 열도록 안내
    const openInBrowser = () => {
      // 모바일에서 공유 기능을 통해 외부 브라우저로 열도록 유도
      if (navigator.share) {
        navigator.share({
          title: '픽토스',
          text: '외부 브라우저에서 열기',
          url: target,
        }).catch(() => {
          // share API가 실패하면 클립보드에 복사하거나 다른 방법 시도
          fallbackToClipboard(target)
        })
      } else {
        fallbackToClipboard(target)
      }
    }

    const fallbackToClipboard = (url: string) => {
      // 클립보드에 URL 복사 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          alert('URL이 클립보드에 복사되었습니다. 외부 브라우저에 붙여넣어 주세요.')
        }).catch(() => {
          // 클립보드 복사도 실패하면 사용자에게 수동으로 URL 복사하도록 안내
          showUrlPrompt(url)
        })
      } else {
        showUrlPrompt(url)
      }
    }

    const showUrlPrompt = (url: string) => {
      const shouldOpen = confirm(
        '더 나은 경험을 위해 외부 브라우저에서 열어주세요.\n\n' +
        '확인을 누르면 URL이 선택됩니다. 복사하여 외부 브라우저에 붙여넣어 주세요.'
      )
      
      if (shouldOpen) {
        // URL을 선택 가능한 형태로 표시
        const input = document.createElement('input')
        input.value = url
        input.style.position = 'fixed'
        input.style.top = '50%'
        input.style.left = '50%'
        input.style.transform = 'translate(-50%, -50%)'
        input.style.zIndex = '9999'
        input.style.padding = '10px'
        input.style.border = '2px solid #007bff'
        input.style.borderRadius = '4px'
        input.style.backgroundColor = 'white'
        document.body.appendChild(input)
        input.focus()
        input.select()
        
        // 5초 후 자동으로 제거
        setTimeout(() => {
          if (document.body.contains(input)) {
            document.body.removeChild(input)
          }
        }, 5000)
      }
    }

    // 인스타그램 내장 브라우저 감지 시 즉시 실행하지 않고
    // 약간의 지연을 두어 페이지가 완전히 로드된 후 실행
    const timer = setTimeout(openInBrowser, 1000)

    return () => clearTimeout(timer)
  }, [])
}
