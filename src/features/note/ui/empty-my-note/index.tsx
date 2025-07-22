import { ImgNoteEmpty } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const EmptyMyNote = () => {
  const router = useRouter()

  return (
    <div className="size-full flex-center flex-col gap-[32px]">
      <div className="flex-center flex-col gap-[16px]">
        <ImgNoteEmpty className="size-[120px]" />

        <div className="flex-center flex-col gap-[8px]">
          <Text typo="subtitle-1-bold">생성한 퀴즈가 없어요</Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            내가 공부하는 노트에서 <br />
            간편하게 퀴즈를 만들어 보세요
          </Text>
        </div>
      </div>

      <Button
        size={'md'}
        className="size-fit"
        onClick={() =>
          router.push('/note/create', {
            search: {
              documentType: 'TEXT',
            },
          })
        }
      >
        퀴즈 생성하기
      </Button>
    </div>
  )
}

export default EmptyMyNote
