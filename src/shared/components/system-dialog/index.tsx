import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/shared/components/ui/dialog"
import { Text } from "../ui/text"
import { cn } from "@/shared/lib/utils"

interface SystemDialogProps {
  trigger: React.ReactNode
  title: string
  content: React.ReactNode
  variant?: "default" | "critical"
  cancelLabel?: string
  confirmLabel?: string
  onConfirm: () => void
}

export const SystemDialog = ({
  trigger,
  title,
  content,
  variant = "default",
  cancelLabel = "취소",
  confirmLabel = "버튼명",
  onConfirm,
}: SystemDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="w-[280px]">
        <DialogHeader className="text-start">
          <DialogTitle>
            <Text typo="subtitle-2-bold" color="primary">
              {title}
            </Text>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{content}</div>
        <DialogFooter className="mt-10 flex items-center gap-8">
          <DialogClose asChild>
            <button className="typo-button-2 text-text-sub">
              {cancelLabel}
            </button>
          </DialogClose>
          <button
            className={cn(
              "typo-button-2",
              variant === "default" && "text-text-accent",
              variant === "critical" && "text-text-critical",
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
