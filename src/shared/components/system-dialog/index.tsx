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
      <DialogContent className="w-[280px] rounded-[16px] p-6">
        <DialogHeader className="text-start">
          <DialogTitle className="typo-subtitle-2-bold text-text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{content}</div>
        <DialogFooter className="mt-10 items-center justify-end gap-8">
          <DialogClose asChild>
            <button className="typo-button-2 text-text-sub">{cancelLabel}</button>
          </DialogClose>
          <button
            className={cn(
              'typo-button-2',
              variant === 'default' && 'text-text-accent',
              variant === 'critical' && 'text-text-critical',
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
