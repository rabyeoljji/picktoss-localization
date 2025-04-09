import { withHOC } from '@/app/hoc/with-page-config'

import { useAuthStore } from '@/features/auth'

import { Button } from '@/shared/components/ui/button'
import { useRouter } from '@/shared/lib/router'

const HomePage = () => {
  const router = useRouter()
  const clearToken = useAuthStore((state) => state.clearToken)
  router.push('/note')

  const handleLogout = () => {
    clearToken()
  }

  return (
    <div className="flex flex-col gap-6 px-10">
      <Button onClick={() => router.push('/note/create')}>문서 만들기</Button>
      <Button onClick={handleLogout}>로그아웃</Button>
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: '데일리',
  backgroundColor: 'bg-surface-2',
})
