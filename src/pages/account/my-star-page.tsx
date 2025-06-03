import { useState } from 'react'
import { useMemo } from 'react'

import { format } from 'date-fns'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import InviteDrawer from '@/features/invite/ui/invite-drawer'

import { useUser } from '@/entities/member/api/hooks'
import { useGetConsecutiveSolvedDailyQuiz, useGetConsecutiveSolvedQuizSetDates } from '@/entities/quiz/api/hooks'

import { IcChevronRight, IcList } from '@/shared/assets/icon'
import { ImgInviteStar, ImgStar, ImgStreakChecked, ImgStreakMono1 } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Calendar } from '@/shared/components/calendar'
import { Header } from '@/shared/components/header'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { Link } from '@/shared/lib/router'

const MyStarPage = () => {
  const { trackEvent } = useAmplitude()
  const today = useMemo(() => new Date(), [])

  const [currentMonth, setCurrentMonth] = useState(today)

  const { data: user, isLoading: userIsLoading } = useUser()
  const { data: consecutiveDailyQuiz, isLoading: consecutiveLoading } = useGetConsecutiveSolvedDailyQuiz()
  const { data: consecutiveArrayData, isLoading } = useGetConsecutiveSolvedQuizSetDates(
    format(currentMonth, 'yyyy-MM-dd'),
  )

  const checkRewardConsecutive = !consecutiveDailyQuiz
    ? 0
    : consecutiveDailyQuiz % 5 === 0
      ? 5
      : consecutiveDailyQuiz % 5

  if (userIsLoading || consecutiveLoading) {
    return <Loading center />
  }

  return (
    <>
      <Header left={<BackButton />} title={'나의 별'} className="bg-surface-2" />

      <HeaderOffsetLayout className="h-full overflow-y-auto pb-[100px]">
        <div className="pt-[20px] px-[16px]">
          <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[4px]">
                  <Text typo="h1" color="accent">
                    {consecutiveDailyQuiz}일
                  </Text>
                  <Text typo="subtitle-2-bold" color="secondary">
                    연속으로 별 획득 중
                  </Text>
                </div>
                <ImgStar width={80} height={80} />
              </div>

              <Text typo="body-1-medium" color="sub">
                매일 데일리 퀴즈를 10문제 풀면 별을 5개 받아요 <br />
                5일 연속 완료할 때마다 20개!
              </Text>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div className="py-[10.5px] px-[16px] bg-surface-3 text-secondary rounded-[12px] flex items-center justify-between">
                <div className="flex items-center gap-[4px]">
                  <ImgStar width={20} height={20} />
                  <Text typo="body-1-bold">현재 사용 가능한 별</Text>
                </div>
                <Text typo="subtitle-2-bold">{user?.star}개</Text>
              </div>

              <div className="flex-center flex-col gap-[24px]">
                {/* 달력 */}
                <Calendar
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  dates={consecutiveArrayData?.solvedDailyQuizDateRecords}
                  isLoading={isLoading}
                  className="bg-surface-1 rounded-[16px] pb-[24px] pt-[20px] px-[18px]"
                  noSelectMode
                />

                <div className="w-full bg-surface-1 rounded-[16px] py-[16px] flex-center flex-col gap-[16px]">
                  <Text typo="subtitle-1-bold" color="secondary">
                    보너스 보상까지{' '}
                    <Text as={'span'} typo="subtitle-1-bold" color="accent">
                      {5 - (checkRewardConsecutive === 5 ? 0 : checkRewardConsecutive)}일
                    </Text>
                  </Text>

                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div className="flex-center flex-col gap-[4px]">
                        {index + 1 <= checkRewardConsecutive ? (
                          <ImgStreakChecked width={40} height={40} />
                        ) : (
                          <ImgStreakMono1 width={40} height={40} />
                        )}
                        <Text typo="body-1-bold" color="sub">
                          {index === 4 ? '20개' : '5개'}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <InviteDrawer
                triggerComponent={
                  <div
                    className="bg-accent rounded-[12px] py-[16px] px-[24px] flex items-center justify-between"
                    onClick={() => {
                      trackEvent('invite_view', { location: '마이 페이지' })
                    }}
                  >
                    <div className="flex flex-col gap-[4px]">
                      <Text typo="body-1-medium" color="secondary">
                        픽토스 초대장 보내기
                      </Text>
                      <Text typo="subtitle-1-bold">
                        초대할 때마다{' '}
                        <Text as={'span'} typo="subtitle-1-bold" color="accent">
                          별 50개
                        </Text>{' '}
                        받아요!
                      </Text>
                    </div>
                    <ImgInviteStar width={56} height={56} />
                  </div>
                }
              />
            </div>
          </div>
        </div>

        {/* 별 내역 버튼 */}
        <Link to="/account/star-history" className="w-full p-[16px] mt-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <IcList className="size-[20px]" />
            <Text typo="subtitle-2-medium">별 내역</Text>
          </div>
          <IcChevronRight className="size-[16px]" />
        </Link>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(MyStarPage, {
  backgroundClassName: 'bg-surface-2',
})
