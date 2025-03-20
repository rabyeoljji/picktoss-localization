import { useEffect, useState } from 'react'

import { IcClose } from '@/shared/assets/icon'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'

interface AlertDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  height?: 'full' | 'lg' | 'md' | 'sm'
  hasClose?: boolean
  title?: string
  description?: string
  body?: React.ReactNode
  footer?: React.ReactNode
}

/** @none dismissible은 반드시 open 상태를 직접 control해야함 */
export const AlertDrawer = ({
  open,
  onOpenChange,
  trigger,
  height,
  title,
  description,
  hasClose = true,
  body,
  footer,
}: AlertDrawerProps) => {
  const [_open, _setOpen] = useState(open)

  useEffect(() => {
    _setOpen(open)
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    _setOpen(newOpen)
    onOpenChange(newOpen)
  }

  return (
    <Drawer open={_open} onOpenChange={handleOpenChange} dismissible={false}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent height={height} hasHandle={false}>
        {hasClose || title || description ? (
          <DrawerHeader>
            <div className="relative flex justify-between">
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {hasClose && (
                <button className="ml-auto">
                  <IcClose onClick={() => handleOpenChange(false)} />
                </button>
              )}
            </div>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        ) : null}

        {body}

        <DrawerFooter>{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
