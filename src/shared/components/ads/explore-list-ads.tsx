import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function ExploreListAds() {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    try {
      // Google AdSense 스크립트가 로드되었는지 확인
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className="w-full flex-center">
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
