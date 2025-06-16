import { useState } from 'react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import InviteDrawer from '@/features/invite/ui/invite-drawer'

import { useUpdateQuizNotification, useUser } from '@/entities/member/api/hooks'

import { IcChevronRight, IcDisclaimer, IcMy, IcNotification, IcRecord } from '@/shared/assets/icon'
import { ImgGraph, ImgInviteStar, ImgStar } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Disclaimer, DisclaimerContent, DisclaimerTrigger } from '@/shared/components/ui/disclaimer'
import { Switch } from '@/shared/components/ui/switch'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { Link, useRouter } from '@/shared/lib/router'

const AccountPage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()

  const { data: user } = useUser()
  const { mutate: updateNotification } = useUpdateQuizNotification()

  const [notificationEnabled, setNotificationEnabled] = useState(user?.quizNotificationEnabled)

  // 낙관적 업데이트 적용
  const handleNotification = (checked: boolean) => {
    trackEvent('my_setting_push_click', { value: checked })
    setNotificationEnabled(checked)

    if (checked) {
      updateNotification(
        { quizNotificationEnabled: checked },
        {
          onError: () => setNotificationEnabled(false),
        },
      )
    } else {
      updateNotification(
        { quizNotificationEnabled: checked },
        {
          onError: () => setNotificationEnabled(true),
        },
      )
    }
  }

  return (
    <>
      <Header
        left={<BackButton type="close" />}
        title={'MY'}
        right={
          <div className="flex items-center">
            <Link
              to="/account/quiz-record"
              type="button"
              className="size-[40px] flex-center"
              onClick={() => {
                trackEvent('my_history_click')
              }}
            >
              <IcRecord className="size-[24px]" />
            </Link>
            <Link to="/account/notification-config" type="button" className="size-[40px] flex-center">
              <IcNotification className="size-[24px]" />
            </Link>
          </div>
        }
      />

      <HeaderOffsetLayout className="h-full overflow-y-auto scrollbar-hide">
        <div className="px-[16px] pb-[36px] flex flex-col">
          <Link to="/account/info" className="flex items-center gap-[16px] py-[20px]">
            <div className="size-[72px] bg-base-3 rounded-full overflow-hidden flex-center shrink-0">
              {user?.image ? (
                <img src={user?.image} alt="" className="object-cover" />
              ) : (
                <IcMy className="size-[42px] text-icon-sub" />
              )}
            </div>

            <div className="w-[calc(100%-72px-16px)] flex flex-col gap-[4px]">
              <div className="w-full flex items-center gap-[8px]">
                <Text typo="subtitle-1-bold" className="min-w-[47px] max-w-[70%] truncate">
                  {user?.name}
                </Text>
                <Tag className="shrink-0" size={'md'}>
                  {user?.category.emoji} {user?.category.name}
                </Tag>
              </div>

              <Text typo="body-1-medium" color="sub">
                {user?.email}
              </Text>
            </div>
          </Link>

          <div className="flex flex-col gap-[24px]">
            <div className="bg-surface-2 rounded-[12px] flex items-center h-[56px]">
              <Link
                to="/library"
                search={{ tab: 'MY' }}
                className="flex-1/2 h-full px-[16px] py-[12px] flex-center gap-[8px] border-r border-divider"
              >
                <Text typo="subtitle-2-bold" color="secondary">
                  내 퀴즈
                </Text>
                <Text typo="subtitle-2-bold" color="accent">
                  {user?.totalQuizCount}
                </Text>
              </Link>
              <Link
                to="/library"
                search={{ tab: 'BOOKMARK' }}
                className="flex-1/2 h-full px-[16px] py-[12px] flex-center gap-[8px]"
              >
                <Text typo="subtitle-2-bold" color="secondary">
                  북마크
                </Text>
                <Text typo="subtitle-2-bold" color="accent">
                  {user?.bookmarkCount}
                </Text>
              </Link>
            </div>

            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between border border-outline rounded-[12px] h-[80px] py-[16px] px-[20px]">
                <div className="flex items-center gap-[12px]">
                  <ImgGraph width={40} height={40} />

                  <div className="flex flex-col">
                    <Text typo="body-2-medium" color="sub">
                      이번 달 푼 퀴즈
                    </Text>
                    <Text typo="subtitle-1-bold">{user?.monthlySolvedQuizCount} 문제</Text>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    trackEvent('my_analysis_click')
                    router.push('/account/quiz-analysis')
                  }}
                  size={'sm'}
                  variant={'tertiary'}
                >
                  분석 보기
                </Button>
              </div>

              <div className="flex flex-col gap-[21px] border border-outline rounded-[12px] p-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4px]">
                    <ImgStar width={24} height={24} />
                    <Text typo="subtitle-2-bold">나의 별</Text>
                    <Disclaimer>
                      <DisclaimerTrigger asChild className="cursor-pointer">
                        <IcDisclaimer className="size-[16px] text-icon-sub" />
                      </DisclaimerTrigger>
                      <DisclaimerContent side="bottom" sideOffset={7} align="start" alignOffset={-7}>
                        퀴즈를 생성하기 위해 필요한 재화로, 매일 <br /> 데일리에서 10문제 이상 풀거나 이벤트에 <br />{' '}
                        참여하면 받을 수 있어요
                      </DisclaimerContent>
                    </Disclaimer>
                  </div>

                  <Link
                    to="/account/my-star"
                    type="button"
                    className="flex items-center gap-[4px]"
                    onClick={() => {
                      trackEvent('my_star_click')
                    }}
                  >
                    <Text typo="subtitle-2-bold">{user?.star}개</Text>
                    <IcChevronRight className="size-[16px] text-icon-sub" />
                  </Link>
                </div>

                <InviteDrawer
                  triggerComponent={
                    <div
                      className="bg-accent rounded-[8px] py-[16px] px-[24px] flex items-center gap-[16px]"
                      onClick={() => {
                        trackEvent('invite_view', { location: '마이 페이지' })
                      }}
                    >
                      <div className="flex-1 flex flex-col gap-[4px]">
                        <Text typo="body-1-medium" color="secondary">
                          픽토스 초대장 보내기
                        </Text>
                        <Text typo="subtitle-1-bold">
                          초대할 때마다{' '}
                          <Text as={'span'} typo="subtitle-1-bold" color="accent">
                            별 50개!
                          </Text>
                        </Text>
                      </div>

                      <ImgInviteStar width={56} height={56} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-[8px] w-full bg-base-2"></div>

        <div className="py-[24px] px-[16px] flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[16px]">
            <Text typo="body-1-medium" color="caption">
              설정
            </Text>
            <div className="flex flex-col gap-[20px]">
              <Link to="/account/info" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">계정 정보</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <div className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">푸시 알림</Text>
                <Switch size="md" checked={notificationEnabled} onCheckedChange={handleNotification} />
              </div>
            </div>
          </div>

          <div className="border-t border-divider pt-[16px] flex flex-col gap-[16px]">
            <Text typo="body-1-medium" color="caption">
              도움말 & 지원
            </Text>
            <div className="flex flex-col gap-[20px]">
              <Link to="/account/feedback" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">문의하기</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <a
                href="https://picktoss.notion.site/1209d818f5608088a977c9ee5f70061f"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <Text typo="subtitle-2-medium">이용 가이드</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </a>

              <Link to="/account/notice" className="flex items-center justify-between">
                <Text typo="subtitle-2-medium">공지사항</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </Link>

              <a
                href="https://picktoss.framer.website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <Text typo="subtitle-2-medium">서비스 소개</Text>
                <IcChevronRight className="size-[16px] text-icon-sub" />
              </a>
            </div>
          </div>
        </div>

        <footer className="bg-surface-2 pt-[24px] px-[16px] pb-[40px] flex flex-col gap-[20px]">
          <div className="flex items-center gap-[32px]">
            <a
              href="https://picktoss.notion.site/1209d818f56080fbb469e82def758e9c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text typo="body-1-medium" color="sub">
                개인정보 처리방침
              </Text>
            </a>
            <a
              href="https://picktoss.notion.site/1209d818f560809aad11c5b64020d735"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text typo="body-1-medium" color="sub">
                서비스 이용약관
              </Text>
            </a>
          </div>

          <div className="flex flex-col gap-[16px]">
            <Text typo="body-2-medium" color="caption">
              사업자등록번호 120-20-02237 | 070-7954-1774 | 대표자명 : 이유민 <br /> 서울특별시 서대문구 연희로41가길 5,
              B1층 D72호(홍은동)
            </Text>
            <Text typo="body-2-medium" color="caption">
              ⓒ 2024. picktoss all rights reserved
            </Text>
          </div>
        </footer>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(AccountPage, {
  backgroundClassName: 'bg-surface-1',
})
