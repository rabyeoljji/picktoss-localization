import { IcBack, IcClose } from '@/shared/assets/icon'
import { useRouter } from '@/shared/lib/router'

interface BackButtonProps {
  cancel: boolean
  onClick?: () => void
}

export const BackButton = ({ cancel, onClick }: BackButtonProps) => {
  const router = useRouter()

  return (
    <button className="p-2" onClick={() => onClick?.() || router.back()}>
      {cancel ? <IcClose /> : <IcBack />}
    </button>
  )
}
