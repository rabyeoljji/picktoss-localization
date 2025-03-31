import { IcBack, IcClose } from '@/shared/assets/icon'
import { useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

interface BackButtonProps {
  type?: 'back' | 'close'
  onClick?: () => void
  className?: HTMLElement['className']
}

export const BackButton = ({ type = 'back', onClick, className }: BackButtonProps) => {
  const router = useRouter()

  return (
    <button
      className={cn('p-2', className)}
      onClick={() => {
        if (onClick != null) {
          onClick()
        } else {
          router.back()
        }
      }}
    >
      {type === 'close' ? <IcClose /> : <IcBack />}
    </button>
  )
}
