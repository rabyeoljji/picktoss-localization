import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { format, millisecondsToMinutes } from 'date-fns'

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

const QuizRecordSetDetailPage = () => {
  const params = useParams()
  const dailyQuizRecordId = Number(params.quizSetId)

  const { data: quizSetRecordData, isLoading } = useGetSingleQuizSetRecord(dailyQuizRecordId)

  const todayString = new Date().toISOString()
  const date = new Date(quizSetRecordData?.createdAt || todayString)

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

  useEffect(() => {
    if (!quizContainerRef.current) return
    const rect = quizContainerRef.current.getBoundingClientRect()
    setThreshold(rect.top + getSafeAreaTop())
  }, [quizContainerRef.current])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setShowScrollTopButton(container.scrollTop > threshold)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [threshold])

  if (isLoading) {
    return <Loading center />
  }

  return (
    <>
      <Header className="bg-surface-2" left={<BackButton />} />

      <HeaderOffsetLayout ref={scrollContainerRef} className="px-[16px] h-full overflow-y-auto">
        <div className="flex-center flex-col gap-[40px] p-[16px]">
          <div className="flex-center flex-col gap-[16px]">
            <Text typo="h1" className="!text-[64px]">
              {'🔥'}
            </Text>

            <div className="flex-center flex-col gap-[8px]">
              <Text typo="h4" className="max-w-[300px] truncate">
                이것이 최대길이 이후로는 말줄임표가 적용
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
                {quizSetRecordData?.totalQuizCount}문제
              </Text>
              <Text typo="body-2-medium" color="sub">
                문제 수
              </Text>
            </div>
            <div className="flex-center flex-col border-x border-divider px-[30px]">
              <div className="flex-center mb-[6px] size-[40px]">
                <ImgStopwatch className="size-[32px]" />
              </div>
              <Text typo="subtitle-2-bold" className="mb-[2px]">
                {millisecondsToMinutes(quizSetRecordData?.totalElapsedTimeMs || 0)}분
              </Text>
              <Text typo="body-2-medium" color="sub">
                소요시간
              </Text>
            </div>
            <div className="flex-center flex-col px-[30px]">
              <div className="flex-center mb-[6px] size-[40px]">
                <ImgCheckbadge className="size-[32px]" />
              </div>
              <Text typo="subtitle-2-bold" className="mb-[2px]">
                {quizSetRecordData?.averageCorrectAnswerRate}%
              </Text>
              <Text typo="body-2-medium" color="sub">
                정답률
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
                        정답
                      </Tag>
                    ) : (
                      <Tag size="md" color="red">
                        오답
                      </Tag>
                    )
                  }
                />
                <QuestionCard.Question>{question.question}</QuestionCard.Question>
                {question.quizType === 'MIX_UP' ? (
                  <QuestionCard.OX
                    answerIndex={question.answer === 'correct' ? 0 : 1}
                    showIndexs={question.choseAnswer === 'correct' ? [0] : [1]}
                  />
                ) : (
                  <QuestionCard.Multiple
                    answerIndex={question.options.findIndex((option) => option === question.answer)}
                    showIndexs={[question.options.findIndex((option) => option === question.choseAnswer)]}
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
