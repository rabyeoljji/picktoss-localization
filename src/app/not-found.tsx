import { ImgPageerror } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const NotFound = () => {
  const router = useRouter()

  return (
    <div className="flex-center size-full flex-col gap-8 bg-surface-2">
      <div className="flex-center flex-col">
        <ImgPageerror className="size-24" />

        <div className="mt-4 flex flex-col items-center gap-2">
          <Text typo="subtitle-1-bold" className="text-center">
            페이지를 찾을 수 없어요
          </Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            존재하지 않는 주소거나, 요청하신 페이지의 <br /> 주소가 변경, 삭제되어 찾을 수 없어요
          </Text>
        </div>
      </div>

      <Button onClick={() => router.back()} variant={'primary'} size={'md'}>
        픽토스 홈으로 돌아가기
      </Button>
    </div>
  )
}

export default NotFound
