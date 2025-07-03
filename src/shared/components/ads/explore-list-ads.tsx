import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function ExploreListAds() {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    const initializeAd = () => {
      try {
        console.log('🔄 AdSense 초기화 시도...')
        
        if (typeof window === 'undefined') {
          console.log('⚠️ 서버 렌더링 환경')
          return
        }

        // adsbygoogle 스크립트 로딩 확인
        if (!window.adsbygoogle) {
          console.log('⏳ AdSense 스크립트 로딩 대기...')
          setTimeout(initializeAd, 100)
          return
        }

        console.log('✅ AdSense 광고 요청')
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        
      } catch (error) {
        console.error('❌ AdSense 오류:', error)
      }
    }

    // 컴포넌트 마운트 후 잠시 대기
    const timer = setTimeout(initializeAd, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '280px',
        }}
        data-ad-client="ca-pub-7227087294100067"
        data-ad-slot="2319969557"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
