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
import { useTranslation } from '@/shared/locales/use-translation'

const MyStarPage = () => {
  const { trackEvent } = useAmplitude()
  const { t } = useTranslation()
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
      <Header left={<BackButton />} title={t('profile.나의_별')} className="bg-surface-2" />

      <HeaderOffsetLayout className="h-full overflow-y-auto pb-[100px]">
        <div className="pt-[20px] px-[16px]">
          <div className="flex flex-col gap-[32px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[4px]">
                  <Text typo="h1" color="accent">
                    {t('profile.일', { count: consecutiveDailyQuiz })}
                  </Text>
                  <Text typo="subtitle-2-bold" color="secondary">
                    {t('profile.연속으로_별_획득_중')}
                  </Text>
                </div>
                <ImgStar width={80} height={80} />
              </div>

              <Text typo="body-1-medium" color="sub">
                {t('profile.매일_데일리_퀴즈를_10문제_풀면_별을_5개_받아요')} <br />
                {t('profile.5일_연속_완료할_때마다_20개')}
              </Text>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div className="py-[10.5px] px-[16px] bg-surface-3 text-secondary rounded-[12px] flex items-center justify-between">
                <div className="flex items-center gap-[4px]">
                  <ImgStar width={20} height={20} />
                  <Text typo="body-1-bold">{t('profile.현재_사용_가능한_별')}</Text>
                </div>
                <Text typo="subtitle-2-bold">{t('profile.개', { count: user?.star })}</Text>
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
                    {t('profile.보너스_보상까지')}{' '}
                    <Text as={'span'} typo="subtitle-1-bold" color="accent">
                      {t('profile.일', { count: 5 - (checkRewardConsecutive === 5 ? 0 : checkRewardConsecutive) })}
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
                          {index === 4 ? t('profile.개', { count: 20 }) : t('profile.개', { count: 5 })}
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
                      trackEvent('invite_view', { location: '나의 별 페이지' })
                    }}
                  >
                    <div className="flex flex-col gap-[4px]">
                      <Text typo="body-1-medium" color="secondary">
                        {t('profile.픽토스_초대장_보내기')}
                      </Text>
                      <Text typo="subtitle-1-bold">
                        {t('profile.초대할_때마다')}{' '}
                        <Text as={'span'} typo="subtitle-1-bold" color="accent">
                          {t('profile.별_50개')}
                        </Text>{' '}
                        {t('profile.받아요')}
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
            <Text typo="subtitle-2-medium">{t('profile.별_내역')}</Text>
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
