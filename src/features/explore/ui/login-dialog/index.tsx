import { ImgSymbol } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { useRouter } from '@/shared/lib/router'

const LoginDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pt-[32px] px-[24px] pb-[20px] w-[308px] flex flex-col gap-[32px]">
        <div className="w-full flex flex-col gap-[16px]">
          <div className="w-full flex-center">
            <ImgSymbol className="size-[120px]" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <DialogTitle className="typo-h4 text-center">로그인하고 전부 이용해요!</DialogTitle>
            <DialogDescription className="typo-subtitle-2-medium text-sub text-center">
              픽토스 회원은 나만의 퀴즈를 <br />
              간편하게 만들고 저장할 수 있어요
            </DialogDescription>
          </div>
        </div>

        <div className="w-full flex flex-col gap-[24px]">
          <Button onClick={() => router.push('/login')} className="w-full">
            로그인
          </Button>
          <DialogClose asChild>
            <button className=" text-sub">닫기</button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
