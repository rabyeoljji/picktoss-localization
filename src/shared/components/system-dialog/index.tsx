import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface SystemDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  content?: React.ReactNode
  variant?: 'default' | 'critical'
  cancelLabel?: string
  confirmLabel?: string
  onConfirm: () => void
  preventClose?: boolean
  disabledConfirm?: boolean
}

export const SystemDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  content,
  variant = 'default',
  cancelLabel,
  confirmLabel,
  onConfirm,
  preventClose = false,
  disabledConfirm = false,
}: SystemDialogProps) => {
  const { t } = useTranslation()

  const handleOpenChange = (newOpen: boolean) => {
    if (preventClose && !newOpen) {
      return
    }
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[280px] w-fit rounded-[16px] px-[24px] pt-[24px] pb-[8px] whitespace-pre-line">
        <DialogHeader className="text-center">
          <DialogTitle className="typo-subtitle-2-bold text-text-primary">{title}</DialogTitle>
          {description && <DialogDescription className="typo-body-1-medium text-sub">{description}</DialogDescription>}
        </DialogHeader>
        {content && <div className="mt-4 text-center text-sub typo-body-1-medium">{content}</div>}
        <DialogFooter className="mt-[20px] self-stretch inline-flex justify-between items-center">
          <DialogClose asChild>
            <button className="typo-button-2 text-sub w-28 h-12 text-center justify-center text-base leading-none">
              {cancelLabel ?? t('common.cancel')}
            </button>
          </DialogClose>
          <button
            className={cn(
              'typo-button-2 w-28 h-12 text-center justify-center text-base leading-none disabled:text-disabled disabled:pointer-events-none',
              variant === 'default' && 'text-accent',
              variant === 'critical' && 'text-critical',
            )}
            onClick={onConfirm}
            disabled={disabledConfirm}
          >
            {confirmLabel ?? t('common.confirm')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
