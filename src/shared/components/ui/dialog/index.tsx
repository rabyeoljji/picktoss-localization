import * as React from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/shared/lib/utils'

import { Button } from '../button'
import { TextButton } from '../text-button'

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/75',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        data-slot="dialog-content"
        className={cn(
          'bg-surface-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[343px] translate-x-[-50%] translate-y-[-50%] rounded-[20px] px-6 pt-8 pb-5 shadow-md duration-200',
          className,
        )}
        {...props}
      >
        {children}
        {/* <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close> */}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-2 text-center', className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('flex', className)} {...props} />
}

function DialogCloseTextButton({ label = '닫기' }: { label?: string }) {
  return (
    <DialogClose asChild>
      <TextButton variant="secondary" className="mt-4 h-5 w-full">
        {label}
      </TextButton>
    </DialogClose>
  )
}

function DialogCTA({
  label,
  onClick,
  hasClose = false,
  closeLabel = '닫기',
  className,
}: React.ComponentProps<'button'> & {
  label: string
  onClick: () => void
  hasClose?: boolean
  closeLabel?: string
  className: HTMLElement['className']
}) {
  return (
    <div className="w-full">
      <Button onClick={onClick} className={className}>
        {label}
      </Button>
      {hasClose && <DialogCloseTextButton label={closeLabel} />}
    </div>
  )
}

function DialogCTA_B({
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  className,
}: {
  primaryButtonLabel: string
  secondaryButtonLabel: string
  onPrimaryButtonClick: () => void
  onSecondaryButtonClick: () => void
  className?: HTMLElement['className']
}) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <Button onClick={onPrimaryButtonClick} size="md">
        {primaryButtonLabel}
      </Button>
      <Button variant="secondary2" onClick={onSecondaryButtonClick} size="md">
        {secondaryButtonLabel}
      </Button>
    </div>
  )
}

DialogCTA.B = DialogCTA_B

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title data-slot="dialog-title text-text-primary" className={cn('typo-h4', className)} {...props} />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('typo-subtitle-2-medium text-text-sub', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogCloseTextButton,
  DialogCTA,
}
