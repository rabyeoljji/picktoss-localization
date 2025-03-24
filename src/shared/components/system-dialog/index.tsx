import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'

interface SystemDialogProps {
  trigger: React.ReactNode
  title: string
  content: React.ReactNode
  variant?: 'default' | 'critical'
  cancelLabel?: string
  confirmLabel?: string
  onConfirm: () => void
}

export const SystemDialog = ({
  trigger,
  title,
  content,
  variant = 'default',
  cancelLabel = '취소',
  confirmLabel = '버튼명',
  onConfirm,
}: SystemDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[280px] w-fit rounded-[16px] px-[24px] pt-[24px] pb-[8px]">
        <DialogHeader className="text-center">
          <DialogTitle className="typo-subtitle-2-bold text-text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-center text-sub typo-body-1-medium">{content}</div>
        <DialogFooter className="mt-[20px] self-stretch inline-flex justify-between items-center">
          <DialogClose asChild>
            <button className="typo-button-2 text-text-sub w-28 h-12 text-center justify-center text-base leading-none">
              {cancelLabel}
            </button>
          </DialogClose>
          <button
            className={cn(
              'typo-button-2 w-28 h-12 text-center justify-center text-base leading-none',
              variant === 'default' && 'text-accent',
              variant === 'critical' && 'text-critical',
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
