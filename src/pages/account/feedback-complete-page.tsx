import { ImgConfirm } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { Link } from '@/shared/lib/router'

export const FeedbackCompletePage = () => {
  return (
    <div className="center flex-center flex-col">
      <ImgConfirm className="w-[100px]" />
      <Text typo="subtitle-1-bold" color="primary" className="mt-4">
        문의가 전송되었어요
      </Text>
      <Text typo="body-1-medium" color="sub" className="text-center mt-2">
        조금만 기다려주시면
        <br />
        이메일로 답변을 전달드릴게요
      </Text>

      <Link to="/" replace className="mt-[32px]">
        <Button variant="tertiary" size="md">
          픽토스 홈으로 가기
        </Button>
      </Link>
    </div>
  )
}
