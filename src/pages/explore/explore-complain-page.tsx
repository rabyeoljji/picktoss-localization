import { useEffect } from 'react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import ComplainForm from '@/features/explore/ui/complain-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const ExploreComplainPage = () => {
  const [name] = useQueryParam('/explore/complain/:noteId', 'name')
  const { t } = useTranslation()

  useEffect(() => {
    const root = window.document.getElementById('root')
    if (!root) return

    root.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header left={<BackButton />} title={t('explore.퀴즈_신고')} />

      <HeaderOffsetLayout>
        <div className="pt-[20px] px-[16px] flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[8px]">
            <Text typo="body-1-bold" color="sub">
              {t('explore.신고할_퀴즈')}
            </Text>
            <Text typo="subtitle-1-bold">{name}</Text>
          </div>

          <ComplainForm />
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(ExploreComplainPage, {
  backgroundClassName: 'bg-surface-1',
})
