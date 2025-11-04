import { IcRefresh } from '@/shared/assets/icon'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const Error = () => {
  const router = useRouter()

  return (
    <div className="flex-center size-full flex-col gap-8 bg-surface-2">
      <div className="flex-center flex-col">
        <div className="mt-4 flex flex-col items-center gap-2">
          <Text typo="subtitle-1-bold" className="text-center">
            ⚠️ 알 수 없는 문제가 발생했어요
          </Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            아래 버튼을 눌러 메인 화면으로 이동해주세요 <br />
          </Text>
        </div>
      </div>

      <Button left={<IcRefresh />} variant={'primary'} size={'md'} onClick={() => router.replace('/')}>
        픽토스 홈으로 돌아가기
      </Button>
    </div>
  )
}

export default Error
