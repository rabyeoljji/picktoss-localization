import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { IcRefresh } from '@/shared/assets/icon'
import { ImgNetworkerror } from '@/shared/assets/images'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { client } from '@/shared/lib/axios/client'
import { useTranslation } from '@/shared/locales/use-translation'

async function checkConnectivity(): Promise<boolean> {
  // navigator.onLine만으로는 충분치 않을 수 있어 health-check 요청으로 보강
  if (!navigator.onLine) return false

  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 2500)

  try {
    const res = await client.get('/health-check', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      signal: controller.signal,
    })
    return !!res.status
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}

const NetworkErrorFallback = () => {
  const { t } = useTranslation()

  const [checking, setChecking] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleRetry = useCallback(async () => {
    setChecking(true)
    const ok = await checkConnectivity()
    setChecking(false)

    if (!ok) {
      // 아직 오프라인
      window.location.reload()
      return
    }

    // 돌아갈 후보 경로: (1) location.state.from (2) sessionStorage.lastPath (3) 홈
    const fromState =
      location.state?.from?.pathname + (location.state?.from?.search ?? '') + (location.state?.from?.hash ?? '')
    const fromStorage = sessionStorage.getItem('lastPath') ?? '/'
    const target = fromState || fromStorage || '/'

    navigate(target, { replace: true })
  }, [navigate])

  return (
    <div className="flex-center size-full flex-col gap-8 bg-surface-2">
      <div className="flex-center flex-col">
        <ImgNetworkerror className="size-24" />

        <div className="mt-4 flex flex-col items-center gap-2">
          <Text typo="subtitle-1-bold" className="text-center">
            {t('etc.network_error.title1')} <br /> {t('etc.network_error.title2')}
          </Text>
          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('etc.network_error.message1')} <br />
            {t('etc.network_error.message2')}
          </Text>
        </div>
      </div>

      <Button
        left={<IcRefresh />}
        variant={'primary'}
        size={'md'}
        className="w-fit"
        onClick={handleRetry}
        disabled={checking}
      >
        {t('etc.network_error.button')}
      </Button>
    </div>
  )
}

export default NetworkErrorFallback
