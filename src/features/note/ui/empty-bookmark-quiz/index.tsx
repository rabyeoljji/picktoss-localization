import { ImgBookmarkEmpty } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const EmptyBookmarkQuiz = () => {
  const router = useRouter()

  return (
    <div className="size-full flex-center flex-col gap-[32px]">
      <div className="flex-center flex-col gap-[16px]">
        <ImgBookmarkEmpty className="size-[120px]" />

        <div className="flex-center flex-col gap-[8px]">
          <Text typo="subtitle-1-bold">북마크한 퀴즈가 없어요</Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            픽토스에서 사람들이 만든 <br />
            관심분야의 퀴즈를 저장해 보세요
          </Text>
        </div>
      </div>

      <Button size={'md'} className="size-fit" onClick={() => router.replace('/explore')}>
        퀴즈 보러가기
      </Button>
    </div>
  )
}

export default EmptyBookmarkQuiz
