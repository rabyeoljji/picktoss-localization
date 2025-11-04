import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { useNetworkStatus } from '@/shared/hooks/use-network-status'

export const useOfflineGuard = () => {
  const online = useNetworkStatus()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!online) {
      navigate('/network-error', { state: { from: location } })
    }
  }, [online, navigate, location])
}
