import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { format } from 'date-fns'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useGetSingleQuizSetRecord } from '@/entities/quiz/api/hooks'

import { IcArrowUp } from '@/shared/assets/icon'
import { ImgCheckbadge, ImgSpeechbubble, ImgStopwatch } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import QuestionCard from '@/shared/components/cards/question-card'
import { Header } from '@/shared/components/header'
import { ButtonSolidIcon } from '@/shared/components/ui/button-solid-icon'
import Loading from '@/shared/components/ui/loading'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { useTranslation } from '@/shared/locales/use-translation'

const QuizRecordSetDetailPage = () => {
  const { t } = useTranslation()
  const params = useParams()
  const dailyQuizRecordId = Number(params.quizSetId)

  const { data: quizSetRecordData, isLoading } = useGetSingleQuizSetRecord(dailyQuizRecordId)

  const todayString = new Date().toISOString()
  const date = new Date(quizSetRecordData?.createdAt || todayString)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const quizContainerRef = useRef<HTMLDivElement | null>(null)
  const [showScrollTopButton, setShowScrollTopButton] = useState(false)

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    return [
      hours && `${hours}${t('profile.quiz_record_set_detail.time_hours')}`,
      minutes && `${minutes}${t('profile.quiz_record_set_detail.time_minutes')}`,
      seconds && `${seconds}${t('profile.quiz_record_set_detail.time_seconds')}`,
    ]
      .filter((value) => value)
      .join(' ')
  }

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
    if (!quizSetRecordData) return

    requestAnimationFrame(() => {
      if (!quizContainerRef.current) return
      const rect = quizContainerRef.current.getBoundingClientRect()
      setThreshold(rect.top + getSafeAreaTop())
    })
  }, [quizSetRecordData])

  // 스크롤 컨테이너의 크기가 변경될 때마다 임계값 업데이트
  useEffect(() => {
    if (!quizSetRecordData) return

    const updateThreshold = () => {
      if (!quizContainerRef.current) return
      const rect = quizContainerRef.current.getBoundingClientRect()
      setThreshold(rect.top + getSafeAreaTop())
    }

    requestAnimationFrame(updateThreshold)

    window.addEventListener('resize', updateThreshold)
    return () => window.removeEventListener('resize', updateThreshold)
  }, [quizSetRecordData])

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
        <div className="flex-center flex-col gap-[40px] p-[16px]">
          <div className="flex-center flex-col gap-[16px]">
            <Text typo="h1" className="!text-[64px]">
              {quizSetRecordData?.emoji}
            </Text>

            <div className="flex-center flex-col gap-[8px]">
              <Text typo="h4" className="max-w-[300px] truncate">
                {quizSetRecordData?.name}
              </Text>
              <Text typo="subtitle-2-medium" color="sub">
                {format(date, 'yyyy.M.d')}
              </Text>
            </div>
          </div>

          <div className="flex">
            <div className="flex-center flex-col px-[30px]">
              <div className="flex-center mb-[6px] size-[40px]">
                <ImgSpeechbubble className="size-[32px]" />
              </div>
              <Text typo="subtitle-2-bold" className="mb-[2px]">
                {t('profile.quiz_record_set_detail.question_count', { count: quizSetRecordData?.totalQuizCount })}
              </Text>
              <Text typo="body-2-medium" color="sub">
                {t('profile.quiz_record_set_detail.question_count_text')}
              </Text>
            </div>
            <div className="flex-center flex-col border-x border-divider px-[30px]">
              <div className="flex-center mb-[6px] size-[40px]">
                <ImgStopwatch className="size-[32px]" />
              </div>
              <Text typo="subtitle-2-bold" className="mb-[2px]">
                {formatDuration(quizSetRecordData?.totalElapsedTimeMs || 0)}
              </Text>
              <Text typo="body-2-medium" color="sub">
                {t('profile.quiz_record_set_detail.time_spent')}
              </Text>
            </div>
            <div className="flex-center flex-col px-[30px]">
              <div className="flex-center mb-[6px] size-[40px]">
                <ImgCheckbadge className="size-[32px]" />
              </div>
              <Text typo="subtitle-2-bold" className="mb-[2px]">
                {Math.round(quizSetRecordData?.averageCorrectAnswerRate ?? 0)}%
              </Text>
              <Text typo="body-2-medium" color="sub">
                {t('profile.quiz_record_set_detail.accuracy_rate')}
              </Text>
            </div>
          </div>
        </div>

        <div ref={quizContainerRef} className="flex flex-col pt-[20px] pb-[118px] px-[16px] gap-[12px]">
          {quizSetRecordData?.quizzes.map((question) => {
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

export default withHOC(QuizRecordSetDetailPage, {
  backgroundClassName: 'bg-surface-2',
})
