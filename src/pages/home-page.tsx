import { withHOC } from '@/app/hoc/with-page-config'

import { SearchInput } from '@/shared/components/ui/search-input'
import { useRouter } from '@/shared/lib/router'

const HomePage = () => {
  const router = useRouter()
  router.push('/account/contact')
  router.push('/')

  return (
    <div className="flex flex-col gap-6 px-10">
      <SearchInput />
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: '홈',
})
