import { toast } from 'sonner'

import { withHOC } from '@/app/hoc/with-page-config'

import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const HomePage = () => {
  const router = useRouter()
  router.push('/account/contact')
  router.push('/')

  return (
    <div className="flex flex-col gap-6 px-10">
      <Text typo="h1">어떤 걸 만들어볼까요?</Text>
      <Button variant="secondary1">호에에엥</Button>
      <Button variant="secondary2">호에에엥</Button>
      <Button variant="tertiary">호에에엥</Button>
      <div className="bg-surface-1 size-8">alsjdlas</div>
      <div
        className="bg-surface-1 size-8"
        onClick={() =>
          toast('헤헿', {
            action: {
              label: '버튼',
              onClick: () => {
                console.log('click')
              },
            },
          })
        }
      >
        토스트
      </div>
    </div>
  )
}

export default withHOC(HomePage, {
  activeTab: '홈',
})
