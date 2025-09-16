import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useGetSingleDailyQuizRecord } from '@/entities/quiz/api/hooks'

import { IcArrowUp } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import QuestionCard from '@/shared/components/cards/question-card'
import { Header } from '@/shared/components/header'
import { ButtonSolidIcon } from '@/shared/components/ui/button-solid-icon'
import Loading from '@/shared/components/ui/loading'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useTranslation } from '@/shared/locales/use-translation'

const QuizRecordDailyDetailPage = () => {
  const { t } = useTranslation()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const solvedDate = searchParams.get('solvedDate') || ''
  const dailyQuizRecordId = Number(params.dailyQuizRecordId)

  const { data: DailyRecordData, isLoading } = useGetSingleDailyQuizRecord(dailyQuizRecordId)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const quizContainerRef = useRef<HTMLDivElement | null>(null)
  const [showScrollTopButton, setShowScrollTopButton] = useState(false)

  const handleScrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const getSafeAreaTop = () => {
    const root = document.documentElement
    const computed = getComputedStyle(root)
    const value = computed.getPropertyValue('--safe-area-inset-top') || '0px'
    return parseFloat(value)
  }

  const [threshold, setThreshold] = useState(0)

  // 최초 렌더링 시 퀴즈 컨테이너의 위치를 기준으로 스크롤 임계값 설정
  useEffect(() => {
    if (!DailyRecordData) return

    requestAnimationFrame(() => {
      if (!quizContainerRef.current) return
      const rect = quizContainerRef.current.getBoundingClientRect()
      setThreshold(rect.top + getSafeAreaTop())
    })
  }, [DailyRecordData])

  // 스크롤 컨테이너의 크기가 변경될 때마다 임계값 업데이트
  useEffect(() => {
    if (!DailyRecordData) return

    const updateThreshold = () => {
      if (!quizContainerRef.current) return
      const rect = quizContainerRef.current.getBoundingClientRect()
      setThreshold(rect.top + getSafeAreaTop())
    }

    requestAnimationFrame(updateThreshold)

    window.addEventListener('resize', updateThreshold)
    return () => window.removeEventListener('resize', updateThreshold)
  }, [DailyRecordData])

  // 스크롤 이벤트 핸들러 설정
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTopButton(container.scrollTop > threshold)
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener('scroll', handleScroll)

    // 최초 진입 시에도 상태 설정
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [threshold])

  if (isLoading) {
    return <Loading center />
  }

  return (
    <>
      <Header className="bg-surface-2" left={<BackButton />} />

      <HeaderOffsetLayout ref={scrollContainerRef} className="h-full overflow-y-auto">
        <div className="p-[16px] flex flex-col items-center gap-[8px]">
          <Text typo="h4">{t('profile.quiz_record_daily_detail.daily_quiz_title')}</Text>
          <Text typo="subtitle-2-medium" color="sub">
            {solvedDate}
          </Text>
        </div>

        <div ref={quizContainerRef} className="flex flex-col pt-[20px] pb-[118px] px-[16px] gap-[12px]">
          {DailyRecordData?.quizzes.map((question) => {
            return (
              <QuestionCard key={question.id}>
                <QuestionCard.Header
                  order={1}
                  right={
                    question.isAnswer ? (
                      <Tag size="md" color="green">
                        {t('common.correct')}
                      </Tag>
                    ) : (
                      <Tag size="md" color="red">
                        {t('common.incorrect')}
                      </Tag>
                    )
                  }
                />
                <QuestionCard.Question>{question.question}</QuestionCard.Question>
                {question.quizType === 'MIX_UP' ? (
                  <QuestionCard.OX answerIndex={question.answer === 'correct' ? 0 : 1} showIndexs={[0, 1]} />
                ) : (
                  <QuestionCard.Multiple
                    answerIndex={question.options.findIndex((option) => option === question.answer)}
                    showIndexs={[
                      question.options.findIndex((option) => option === question.answer),
                      question.options.findIndex((option) => option === question.choseAnswer),
                    ]}
                    options={question.options}
                  />
                )}
                <QuestionCard.Explanation>{question.explanation}</QuestionCard.Explanation>
              </QuestionCard>
            )
          })}
        </div>

        {showScrollTopButton && (
          <ButtonSolidIcon
            size={'md'}
            variant={'tertiary'}
            className="absolute bottom-[64px] right-[20px] shadow-[var(--shadow-md)]"
            onClick={handleScrollToTop}
          >
            <IcArrowUp className="size-[20px] text-icon-sub" />
          </ButtonSolidIcon>
        )}
      </HeaderOffsetLayout>
    </>
  )
}

export default withHOC(QuizRecordDailyDetailPage, {
  backgroundClassName: 'bg-surface-2',
})
