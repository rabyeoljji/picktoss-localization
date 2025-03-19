import { Button } from '@/shared/components/ui/button'
import { useRouter } from '@/shared/lib/router'

export const InstallInducePage = () => {
  // 홈으로 이동시키면 "PWAOnlyMobileLayout"에 의해 설치 가이드를 표시한다.
  const router = useRouter()

  return (
    <div className="center">
      <Button onClick={() => router.push('/collection')}>컬렉션으로 이동하기</Button>
      <Button onClick={() => router.push('/')}>지금 앱에서 전부 이용하기</Button>
    </div>
  )
}
