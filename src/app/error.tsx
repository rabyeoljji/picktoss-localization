import { IcRefresh } from '@/shared/assets/icon'
import { ImgNetworkerror } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'

const NetworkErrorFallback = () => {
  return (
    <div className="flex-center size-full flex-col gap-8 bg-surface-2">
      <div className="flex-center flex-col">
        <ImgNetworkerror className="size-24" />

        <div className="mt-4 flex flex-col items-center gap-2">
          <Text typo="subtitle-1-bold" className="text-center">
            네트워크 문제로 <br /> 연결이 지연되고 있어요
          </Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            네트워크 연결 상태를 확인하신 후, <br />
            새로고침 버튼을 눌러주세요
          </Text>
        </div>
      </div>

      <Button left={<IcRefresh />} variant={'primary'} size={'md'} onClick={() => window.location.reload()}>
        새로고침
      </Button>
    </div>
  )
}

export default NetworkErrorFallback
