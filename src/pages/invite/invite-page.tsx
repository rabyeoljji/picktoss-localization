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
  const INVITE_REWARD = 50
  const SPECIAL_REWARD = 1000

  const { inviteCode } = useParams()
  const router = useRouter()
  const { t } = useTranslation()

  const [verifyCode, setVerifyCode] = useState(false)

  const { data: inviteUserData } = useGetInviteMemberInfo(inviteCode ?? '')
  const { mutate: verifyInviteCode, isPending } = useVerifyInviteCode()

  const isSpecial = inviteCode === 'KONKUK' || inviteCode === 'SANGMYUNG'

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
                    {t('profile.invite_page.invite_message1', { name: inviteUserData?.name })}
                  </Text>
                  <Text typo="h2">
                    {t('profile.invite_page.invite_message2')}{' '}
                    <Text as={'span'} typo="h2" color="accent">
                      {t('profile.invite_page.star_count', { count: isSpecial ? SPECIAL_REWARD : INVITE_REWARD })}
                    </Text>
                  </Text>
                </div>

                <Text typo="body-1-medium" color="sub" className="text-center">
                  {t('profile.invite_page.daily_quiz_message')} <br />
                  {t('profile.invite_page.star_usage1')} <br />
                  {t('profile.invite_page.star_usage2')}
                </Text>
              </div>
            </div>

            <Button
              onClick={() => router.replace('/invite/login', { search: { inviteCode } })}
              className="max-w-[260px]"
            >
              {t('profile.invite_page.receive_button')}
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
              {t('profile.invite_page.expired_oops')}
            </Text>
            <Text typo="h2">{t('profile.invite_page.expired_title')}</Text>
          </div>

          <Text typo="body-1-medium" color="sub" className="text-center">
            {t('profile.invite_page.expired_message')} <br />
            {t('profile.invite_page.more_stars_message')} <br />
            {t('profile.invite_page.request_link_message')}
          </Text>
        </div>
      </div>

      <Button onClick={() => router.replace('/invite/login')} className="max-w-[260px]">
        {t('profile.invite_page.signup_button')}
      </Button>
    </div>
  )
}

export default withHOC(InvitePage, {
  backgroundClassName: 'bg-surface-2',
})
