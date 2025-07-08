import { useMemo } from 'react'

import { addMonths, format, subMonths } from 'date-fns'
import { Pie, PieChart } from 'recharts'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import MonthGraphContainer from '@/features/analysis/ui/month-graph-container'

import { useGetQuizMonthlyAnalysis } from '@/entities/quiz/api/hooks'

import { IcDateNext, IcDatePrevious } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { ChartConfig, ChartContainer } from '@/shared/components/ui/chart'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const QuizAnalysisPage = () => {
  const router = useRouter()

  const today = useMemo(() => new Date(), [])

  const [month, setMonth] = useQueryParam('/account/quiz-analysis', 'month')
  const dateMonth = new Date(month)
  const isPrevMonth = format(today, 'yyyy-MM') !== month

  const requestMonth = useMemo(() => format(new Date(month), 'yyyy-MM-dd'), [month])
  const { data: monthlyAnalysisData, isLoading } = useGetQuizMonthlyAnalysis(requestMonth)

  const totalQuizCount = monthlyAnalysisData?.monthlyTotalQuizCount ?? 0

  const maxCategory = useMemo(
    () =>
      monthlyAnalysisData &&
      monthlyAnalysisData.categories.length > 0 &&
      monthlyAnalysisData.categories.reduce((max, current) =>
        current.totalQuizCount > max.totalQuizCount ? current : max,
      ),
    [monthlyAnalysisData],
  )

  const chartConfig = {
    multiple: {
      label: '객관식',
      color: 'var(--color-orange-400)',
    },
    mixup: {
      label: 'O/X',
      color: 'var(--color-orange-200)',
    },
  } satisfies ChartConfig

  const chartData = [
    {
      type: 'multiple',
      count: monthlyAnalysisData?.quizTypes.multipleChoiceQuizCount,
      fill: 'var(--color-orange-400)',
    },
    { type: 'mixup', count: monthlyAnalysisData?.quizTypes.mixUpQuizCount, fill: 'var(--color-orange-200)' },
  ]

  const superiorQuizType =
    (monthlyAnalysisData?.quizTypes.mixUpQuizCount ?? 0) > (monthlyAnalysisData?.quizTypes.multipleChoiceQuizCount ?? 0)
      ? 'O/X'
      : '객관식'

  return (
    <>
      <Header
        className="bg-surface-2"
        left={<BackButton type="close" />}
        content={
          <div className="center flex items-center gap-[8px]">
            <button onClick={() => setMonth(format(subMonths(dateMonth, 1), 'yyyy-MM'))}>
              <IcDatePrevious className="size-[16px]" />
            </button>
            <Text typo="h4" className="w-[44px] text-center">
              {Number(month.split('-')[1])}월
            </Text>
            <button
              onClick={() => setMonth(format(addMonths(dateMonth, 1), 'yyyy-MM'))}
              className="disabled:text-icon-disabled disabled:pointer-events-none"
              disabled={month === format(today, 'yyyy-MM')}
            >
              <IcDateNext className="size-[16px]" />
            </button>
          </div>
        }
      />

      <HeaderOffsetLayout className="h-full overflow-y-auto">
        <div className="p-[16px] pb-[124px]">
          <div className="flex flex-col gap-[4px] mb-[32px]">
            <div className="flex items-baseline gap-1.5">
              <Text typo="h1">{totalQuizCount}</Text>
              <Text typo="h4" color="sub">
                문제
              </Text>
            </div>
            <Text typo="subtitle-2-medium" color="sub" className="px-1">
              {totalQuizCount === 0 ? '푼 퀴즈가 없어요' : '내가 푼 퀴즈에 대한 분석을 확인해보세요'}
            </Text>
          </div>

          <div className="flex flex-col gap-[20px]">
            {!isLoading && !isPrevMonth && totalQuizCount === 0 && (
              <div className="bg-base-1 rounded-[16px] px-[16px] py-[32px] flex-center flex-col gap-[32px]">
                <div className="flex flex-col gap-[8px]">
                  <Text typo="subtitle-1-bold">픽토스의 다양한 퀴즈를 풀어보세요!</Text>
                  <Text typo="body-1-medium" color="sub" className="text-center">
                    픽토스에서 퀴즈를 풀고 나면 <br />내 학습에 대한 분석을 확인할 수 있어요
                  </Text>
                </div>

                <Button size={'md'} className="w-[142px]" onClick={() => router.push('/explore')}>
                  퀴즈 탐험하러 가기
                </Button>
              </div>
            )}

            <div className="bg-base-1 rounded-[16px] p-[16px] pb-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <Text typo="body-1-bold" color="sub">
                  학습량
                </Text>
                {totalQuizCount === 0 ? (
                  <Text typo="h4" color="caption">
                    분석할 문제가 없어요
                  </Text>
                ) : (
                  <Text typo="h4">
                    하루에 {monthlyAnalysisData?.averageDailyQuizCount}문제 정도{' '}
                    {isPrevMonth ? '풀었어요' : '풀고 있어요'}
                  </Text>
                )}
              </div>

              <div className="flex-center flex-col gap-[12px]">
                {/* 그래프 */}
                <MonthGraphContainer today={today} quizDataList={monthlyAnalysisData?.quizzes} />

                <div className="w-full bg-surface-2 rounded-[12px] py-[12px] flex items-center">
                  <div className="flex-1/2 border-r border-divider flex-center flex-col gap-[2px]">
                    <Text typo="body-2-medium" color="sub">
                      가장 많이 푼 날
                    </Text>
                    {totalQuizCount === 0 ? (
                      <Text typo="subtitle-2-bold" color="sub">
                        ?
                      </Text>
                    ) : (
                      <Text typo="subtitle-2-bold">{monthlyAnalysisData?.maxSolvedQuizCount} 문제</Text>
                    )}
                  </div>
                  <div className="flex-1/2 flex-center flex-col gap-[2px]">
                    <Text typo="body-2-medium" color="sub">
                      평균 정답률
                    </Text>
                    {totalQuizCount === 0 ? (
                      <Text typo="subtitle-2-bold" color="sub">
                        ?
                      </Text>
                    ) : (
                      <Text typo="subtitle-2-bold">
                        {Math.round(monthlyAnalysisData?.averageCorrectAnswerRate ?? 0)}%
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-1 rounded-[16px] px-[16px] pt-[20px] pb-[32px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <Text typo="body-1-bold" color="sub">
                  카테고리
                </Text>
                {totalQuizCount === 0 ? (
                  <Text typo="h4" color="caption">
                    분석할 문제가 없어요
                  </Text>
                ) : (
                  <Text typo="h4">
                    <Text as={'span'} typo="h4" style={{ color: '#' + (maxCategory && maxCategory.categoryColor) }}>
                      {maxCategory && maxCategory.categoryName}
                    </Text>
                    에 가장 {isPrevMonth ? '집중했어요' : '집중하고 있어요'}
                  </Text>
                )}
              </div>

              {totalQuizCount === 0 ? (
                <div className="flex h-[24px] w-full bg-disabled rounded-[8px]" />
              ) : (
                <div className="flex flex-col gap-[32px]">
                  <div className="flex h-[24px] w-full overflow-hidden rounded-[8px] bg-disabled">
                    {monthlyAnalysisData?.categories.map(
                      ({ categoryName, categoryColor, totalQuizCount: quizCount }, index) => {
                        const width = Math.round((quizCount / totalQuizCount) * 100)

                        if (quizCount === 0) return null

                        return (
                          <div
                            key={'bar-' + categoryName}
                            className={cn(
                              'h-full border-r-[2px] border-white',
                              index === monthlyAnalysisData?.categories.length - 1 && 'border-none',
                            )}
                            style={{ width: `${width}%`, backgroundColor: '#' + categoryColor }}
                          />
                        )
                      },
                    )}
                  </div>

                  <div className="mx-auto grid grid-cols-2 gap-x-[48px] gap-y-[16px]">
                    {monthlyAnalysisData?.categories.map(
                      ({ categoryName, categoryColor, totalQuizCount: quizCount }) => {
                        if (quizCount === 0) return null

                        return (
                          <div key={'label-' + categoryName} className="flex items-center gap-[4px]">
                            <div className="flex items-center">
                              <div
                                className="mr-[8px] size-[12px] rounded-[4px]"
                                style={{ backgroundColor: '#' + categoryColor }}
                              />
                              <Text typo="body-1-bold" className="w-[72px]">
                                {categoryName}
                              </Text>
                            </div>

                            <Text typo="body-1-medium" color="sub" className="w-[32px] text-right">
                              {quizCount}
                            </Text>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-base-1 rounded-[16px] px-[16px] pt-[20px] pb-[32px] flex-center flex-col gap-[24px]">
              <div className="w-full flex flex-col gap-[4px]">
                <Text typo="body-1-bold" color="sub">
                  유형
                </Text>
                {totalQuizCount === 0 ? (
                  <Text typo="h4" color="caption">
                    분석할 문제가 없어요
                  </Text>
                ) : (
                  <Text typo="h4">
                    {superiorQuizType} 문제 위주로 {isPrevMonth ? '풀었어요' : '푸는 편이에요'}
                  </Text>
                )}
              </div>

              <div className="flex items-center gap-[32px]">
                <div className="flex flex-col gap-[12px]">
                  <div className="flex items-center gap-[4px]">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          'mr-[8px] size-[12px] rounded-[4px] bg-orange',
                          totalQuizCount === 0 && 'bg-disabled',
                        )}
                      />
                      <Text
                        typo="body-1-bold"
                        color={totalQuizCount === 0 ? 'caption' : 'secondary'}
                        className="w-[72px]"
                      >
                        객관식
                      </Text>
                    </div>

                    <Text typo="body-1-medium" color="sub" className="w-[32px] text-right">
                      {monthlyAnalysisData?.quizTypes.multipleChoiceQuizCount}
                    </Text>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          'mr-[8px] size-[12px] rounded-[4px] bg-orange-weak',
                          totalQuizCount === 0 && 'bg-disabled',
                        )}
                      />
                      <Text
                        typo="body-1-bold"
                        color={totalQuizCount === 0 ? 'caption' : 'secondary'}
                        className="w-[72px]"
                      >
                        O/X
                      </Text>
                    </div>

                    <Text typo="body-1-medium" color="sub" className="w-[32px] text-right">
                      {monthlyAnalysisData?.quizTypes.mixUpQuizCount}
                    </Text>
                  </div>
                </div>

                <ChartContainer config={chartConfig} className="aspect-square h-[120px]">
                  {totalQuizCount === 0 ? (
                    <PieChart width={120} height={120}>
                      <Pie
                        data={[{ name: 'empty', count: 1, fill: 'var(--color-gray-50)' }]} // 회색으로 표시
                        dataKey="count"
                        nameKey="name"
                        innerRadius={30}
                        outerRadius={60}
                        isAnimationActive={false}
                      />
                    </PieChart>
                  ) : (
                    <PieChart width={120} height={120}>
                      <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={30} outerRadius={60} />
                    </PieChart>
                  )}
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(QuizAnalysisPage, {
  backgroundClassName: 'bg-surface-2',
})
