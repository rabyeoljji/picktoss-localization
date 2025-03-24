import WithdrawForm from '@/features/withdraw/ui/withdraw-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Text } from '@/shared/components/ui/text'
import { useRouter } from '@/shared/lib/router'

const WithdrawPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-base-1 flex flex-col pb-[40px]">
      <Header
        left={
          <SystemDialog
            trigger={<BackButton onClick={() => {}} />} // todo: onClick
            title="계정을 삭제하시겠어요?"
            content="픽토스에서 만든 노트와 314개의 문제가 모두 삭제됩니다"
            cancelLabel="취소"
            confirmLabel="계정 삭제"
            onConfirm={() => router.back()} // todo: onConfirm
            variant="critical"
          />
        }
        title="회원탈퇴"
      />

      <div className="w-full flex flex-col overflow-x-hidden px-[16px]">
        <Text typo="h4" className="pb-[8px] pt-[20px]">
          픽토스님이 떠나시는 이유를 알려주세요
        </Text>
        <Text typo="body-1-medium" color="sub">
          주신 의견을 통해 더 나은 서비스를 만들 수 있도록 노력할게요
        </Text>

        <WithdrawForm />
      </div>
    </div>
  )
}

export default WithdrawPage
