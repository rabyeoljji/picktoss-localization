import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import ComplainForm from '@/features/explore/ui/complain-form'

import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'

const ExploreComplainPage = () => {
  const [name] = useQueryParam('/explore/complain/:noteId', 'name')

  return (
    <>
      <Header left={<BackButton />} title="퀴즈 신고" />

      <HeaderOffsetLayout>
        <div className="pt-[20px] px-[16px] pb-[14px] flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[8px]">
            <Text typo="body-1-bold" color="sub">
              신고할 퀴즈
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
