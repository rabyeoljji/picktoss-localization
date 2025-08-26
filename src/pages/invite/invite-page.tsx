import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useGetInviteMemberInfo, useVerifyInviteCode } from '@/entities/auth/api/hooks'

import { IcLogo } from '@/shared/assets/icon'
import { ImgInviteEmpty, ImgInviteStar } from '@/shared/assets/images'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useRouter } from '@/shared/lib/router'
import { useTranslation } from '@/shared/locales/use-translation'

const InvitePage = () => {
  const { inviteCode } = useParams()
  const router = useRouter()
  const { t } = useTranslation()

  const [verifyCode, setVerifyCode] = useState(false)

  const { data: inviteUserData } = useGetInviteMemberInfo(inviteCode ?? '')
  const { mutate: verifyInviteCode, isPending } = useVerifyInviteCode()

  useEffect(() => {
    if (!inviteCode) return

    verifyInviteCode(
      { data: { inviteCode } },
      {
        onSuccess: () => {
          setVerifyCode(true)
        },
        onError: () => {
          setVerifyCode(false)
        },
      },
    )
  }, [inviteCode])

  if (isPending) {
    return <Loading center />
  }

  return (
    <>
      <Header
        className="bg-surface-2 pl-[16px] pr-[8px]"
        left={<IcLogo className="h-[26px] w-[102px] text-icon-sub" />}
        right={
          <a href="https://picktoss.framer.website" target="_blank" rel="noopener noreferrer" className="p-[8px]">
            <TextButton size={'md'} variant={'sub'}>
              {t('profile.서비스_소개')}
            </TextButton>
          </a>
        }
      />

      <HeaderOffsetLayout className="size-full">
        {!verifyCode ? (
          // 만료된 초대 코드일 경우
          <ExpiredInvite />
        ) : (
          // 유효한 초대 코드일 경우
          <div className="mt-[88.5px] px-[16px] flex-center flex-col gap-[44px]">
            <div className="flex-center flex-col gap-[32px]">
              <ImgInviteStar width={160} height={160} />

              <div className="flex-center flex-col gap-[12px]">
                <div className="flex-center flex-col gap-[8px]">
                  <Text typo="h3" color="sub">
                    {t('profile.님이_보내신', { name: inviteUserData?.name })}
                  </Text>
                  <Text typo="h2">
                    {t('profile.픽토스_초대와')}{' '}
                    <Text as={'span'} typo="h2" color="accent">
                      {t('profile.별_50개')}
                    </Text>
                  </Text>
                </div>

                <Text typo="body-1-medium" color="sub" className="text-center">
                  {t('profile.매일_간단한_퀴즈로_배운_것을_기억하세요')} <br />
                  {t('profile.픽토스에선_별을_사용해_노트필기_저장한_자료_등')} <br />
                  {t('profile.모든_걸_퀴즈로_만들_수_있어요')}
                </Text>
              </div>
            </div>

            <Button
              onClick={() => router.replace('/invite/login', { search: { inviteCode } })}
              className="max-w-[260px]"
            >
              {t('profile.바로_받기')}
            </Button>
          </div>
        )}
      </HeaderOffsetLayout>
    </>
  )
}

const ExpiredInvite = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="mt-[88.5px] px-[16px] flex-center flex-col gap-[44px]">
      <div className="flex-center flex-col gap-[32px]">
        <ImgInviteEmpty width={160} height={160} />

        <div className="flex-center flex-col gap-[12px]">
          <div className="flex-center flex-col gap-[8px]">
            <Text typo="h3" color="sub">
              {t('profile.이런')}
            </Text>
            <Text typo="h2">{t('profile.초대장이_사라졌어요')}</Text>
          </div>

          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('profile.유효기간이_만료되어_새로운_초대_링크가_필요해요')} <br />
            {t('profile.퀴즈를_만들_수_있는_별을_더_받고_싶다면')} <br />
            {t('profile.친구에게_링크를_다시_요청해보세요')}
          </Text>
        </div>
      </div>

      <Button onClick={() => router.replace('/invite/login')} className="max-w-[260px]">
        {t('profile.그냥_바로_가입하기')}
      </Button>
    </div>
  )
}

export default withHOC(InvitePage, {
  backgroundClassName: 'bg-surface-2',
})
