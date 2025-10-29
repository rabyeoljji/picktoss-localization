import { format } from 'date-fns'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useGetQuizzesRecords } from '@/entities/quiz/api/hooks'

import { IcDaily } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { Link } from '@/shared/lib/router'
import { SUPPORTED_LOCALE } from '@/shared/locales/i18n'
import { useTranslation } from '@/shared/locales/use-translation'

type CombinedRecord =
  | {
      type: 'quizSet'
      solvedDateTime: string
      quizSetId: number
      quizSetName: string
      emoji: string
      totalQuizCount: number
      correctAnswerCount: number
    }
  | {
      type: 'daily'
      solvedDateTime: string
      dailyQuizRecordId: number
      totalQuizCount: number
    }

const QuizRecordPage = () => {
  const { data: recordData } = useGetQuizzesRecords()
  const { t, currentLanguage } = useTranslation()

  const isEmpty = recordData?.quizRecords.length === 0

  return (
    <>
      <Header className="bg-surface-2" left={<BackButton />} title={t('profile.quiz_record_page.quiz_record')} />

      <HeaderOffsetLayout className="px-[16px] h-full overflow-y-auto">
        {isEmpty ? (
          <div className="size-full pb-[108px] flex-center flex-col gap-[8px]">
            <Text typo="subtitle-1-bold">{t('profile.quiz_record_page.no_solved_quiz')}</Text>
            <Text typo="body-1-medium" color="sub">
              {t('profile.quiz_record_page.record_description')}
            </Text>
          </div>
        ) : (
          <div className="pt-[28px] flex flex-col gap-[40px]">
            {recordData?.quizRecords.map((record) => {
              const date = new Date(record.solvedDate)
              const formattedDate = format(date, currentLanguage === SUPPORTED_LOCALE.KO ? 'M월 d일' : 'MMMM do')

              // record.quizSets과 record.dailyQuizRecords를 CombinedRecord 타입으로 변환
              const combinedRecords: CombinedRecord[] = [
                ...record.dailyQuizRecords.map((dailyRecord) => ({
                  type: 'daily' as const,
                  ...dailyRecord,
                })),
                ...record.quizSets.map((quizSetRecord) => ({
                  type: 'quizSet' as const,
                  ...quizSetRecord,
                })),
              ].sort((a, b) => new Date(b.solvedDateTime).getTime() - new Date(a.solvedDateTime).getTime())

              return (
                <div key={record.solvedDate} className="flex flex-col gap-[15px]">
                  <Text typo="body-2-bold" color="sub">
                    {formattedDate}
                  </Text>

                  <div className="flex flex-col">
                    {/* 타입에 맞게 map으로 렌더링 */}
                    {combinedRecords.map((item, idx) => (
                      <>
                        <div
                          key={item.type === 'daily' ? `daily-${item.dailyQuizRecordId}` : `quizSet-${item.quizSetId}`}
                          className="flex items-center gap-[16px]"
                        >
                          {item.type === 'daily' ? (
                            <DailyRecordItem
                              dailyRecordId={item.dailyQuizRecordId}
                              solvedDate={format(date, 'yyyy.M.d')}
                              quizCount={item.totalQuizCount}
                            />
                          ) : (
                            <QuizSetRecordItem
                              quizSetId={item.quizSetId}
                              emoji={item.emoji}
                              name={item.quizSetName}
                              totalQuizCount={item.totalQuizCount}
                              correctAnswerCount={item.correctAnswerCount}
                            />
                          )}
                          {/* 세로선은 마지막 항목 뒤에는 표시 안함 */}
                        </div>
                        {idx < combinedRecords.length - 1 && (
                          <div className="h-[32px] w-[48px] flex-center">
                            <div className="h-full w-[2px] bg-base-3"></div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(QuizRecordPage, {
  backgroundClassName: 'bg-surface-2',
})

const DailyRecordItem = ({
  dailyRecordId,
  solvedDate,
  quizCount,
}: {
  dailyRecordId: number
  solvedDate: string
  quizCount: number
}) => {
  const { t } = useTranslation()

  return (
    <Link
      to="/account/quiz-record/daily/:dailyQuizRecordId"
      params={[String(dailyRecordId)]}
      search={{ solvedDate }}
      className="w-full px-[14px] flex items-center gap-[16px]"
    >
      <IcDaily className="size-[24px] text-icon-secondary" />
      <Button size={'sm'} variant={'secondary2'} className="pointer-events-none">
        {quizCount}
        {t('profile.quiz_record_page.problem')}
      </Button>
    </Link>
  )
}

const QuizSetRecordItem = ({
  quizSetId,
  emoji,
  name,
  totalQuizCount,
  correctAnswerCount,
}: {
  quizSetId: number
  emoji: string
  name: string
  totalQuizCount: number
  correctAnswerCount: number
}) => {
  const { t } = useTranslation()

  return (
    <Link
      to="/account/quiz-record/set/:quizSetId"
      params={[String(quizSetId)]}
      className="w-full flex items-center gap-[16px]"
    >
      <div className="bg-base-3 size-[48px] rounded-full flex-center">
        <Text typo="h3">{emoji}</Text>
      </div>

      <div className="flex flex-col gap-[2px]">
        <Text typo="subtitle-2-bold">{name}</Text>

        <Text typo="body-1-medium" color="sub" className="flex items-center">
          <span>
            {totalQuizCount}
            {t('profile.quiz_record_page.problem')}
          </span>

          <div className="inline-block size-[4px] mx-[8px] bg-gray-100 rounded-full" />

          <span>
            {correctAnswerCount}/{totalQuizCount}
          </span>
        </Text>
      </div>
    </Link>
  )
}
