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

const InvitePage = () => {
  const { inviteCode } = useParams()
  const router = useRouter()

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
              서비스 소개
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
                    {inviteUserData?.name}님이 보내신
                  </Text>
                  <Text typo="h2">
                    픽토스 초대와{' '}
                    <Text as={'span'} typo="h2" color="accent">
                      별 50개!
                    </Text>
                  </Text>
                </div>

                <Text typo="body-1-medium" color="sub" className="text-center">
                  매일 간단한 퀴즈로 배운 것을 기억하세요. <br />
                  픽토스에선 별을 사용해 노트필기, 저장한 자료 등 <br />
                  모든 걸 퀴즈로 만들 수 있어요
                </Text>
              </div>
            </div>

            <Button
              onClick={() => router.replace('/invite/login', { search: { inviteCode } })}
              className="max-w-[260px]"
            >
              바로 받기
            </Button>
          </div>
        )}
      </HeaderOffsetLayout>
    </>
  )
}

const ExpiredInvite = () => {
  const router = useRouter()

  return (
    <div className="mt-[88.5px] px-[16px] flex-center flex-col gap-[44px]">
      <div className="flex-center flex-col gap-[32px]">
        <ImgInviteEmpty width={160} height={160} />

        <div className="flex-center flex-col gap-[12px]">
          <div className="flex-center flex-col gap-[8px]">
            <Text typo="h3" color="sub">
              이런!
            </Text>
            <Text typo="h2">초대장이 사라졌어요</Text>
          </div>

          <Text typo="body-1-medium" color="sub" className="text-center">
            유효기간이 만료되어 새로운 초대 링크가 필요해요 <br />
            퀴즈를 만들 수 있는 별을 더 받고 싶다면 <br />
            친구에게 링크를 다시 요청해보세요
          </Text>
        </div>
      </div>

      <Button onClick={() => router.replace('/invite/login')} className="max-w-[260px]">
        그냥 바로 가입하기
      </Button>
    </div>
  )
}

export default withHOC(InvitePage, {
  backgroundClassName: 'bg-surface-2',
})
