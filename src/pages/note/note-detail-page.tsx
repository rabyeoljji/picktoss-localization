import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { useGetSingleDocument } from '@/entities/document/api/hooks'

import { IcUpload } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import { Header } from '@/shared/components/header/header'
import { Button } from '@/shared/components/ui/button'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const NoteDetailPage = () => {
  const { noteId } = useParams()
  const [quizType, setQuizType] = useQueryParam('/note/:noteId', 'quizType')
  const { data } = useGetSingleDocument(noteId ? Number(noteId) : -1)

  // 제목 엘리먼트의 가시성을 감지하기 위한 state와 ref
  const [showTitleInHeader, setShowTitleInHeader] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    const titleEl = titleRef.current
    if (!titleEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting이 false면 제목이 보이지 않으므로 Header에 표시
        setShowTitleInHeader(!entry.isIntersecting)
      },
      { threshold: 0.1 }, // 10% 이하로 보이면 false로 처리
    )

    observer.observe(titleEl)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <div className={cn('flex items-center w-full', showTitleInHeader ? 'justify-between' : 'justify-end')}>
            {showTitleInHeader && (
              <Text typo="subtitle-2-medium" className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap">
                {data?.documentName}
              </Text>
            )}
            <Button size="sm" left={<IcUpload />}>
              공유하기
            </Button>
          </div>
        }
      />

      {/* 2. 스크롤 가능한 메인 영역 (헤더 높이만큼 패딩 처리) */}
      <main className="flex-1 overflow-auto pt-[var(--header-height)]">
        {/* 상단 이미지(아이콘) + 제목 + 날짜 등 */}
        <div className="px-4 pb-6">
          <div className="w-[48px] h-[48px] bg-blue-300" />
          {/* 제목 요소에 ref 추가 */}
          <Text ref={titleRef} typo="h3" className="mt-3">
            {data?.documentName ?? '전공 필기 요약'}
          </Text>
          <div className="mt-2">
            <Text typo="body-1-medium" color="sub">
              2025.05.28 · 28문제 · 공개됨
            </Text>
          </div>
        </div>

        {/* 3. 탭 바 - sticky로 상단에 고정 */}
        <div className="sticky top-0 z-40 bg-white flex">
          <button
            onClick={() => setQuizType('MIX_UP')}
            className={cn(
              'flex-1 typo-subtitle-2-bold pt-[14px] pb-[10px] text-center',
              quizType === 'MIX_UP' ? 'text-primary border-b-2 border-[#393B3D]' : 'border-b border-divider text-sub',
            )}
          >
            객관식
          </button>
          <button
            onClick={() => setQuizType('MULTIPLE_CHOICE')}
            className={cn(
              'flex-1 typo-subtitle-2-bold pt-[14px] pb-[10px] text-center',
              quizType === 'MULTIPLE_CHOICE'
                ? 'text-primary border-b-2 border-[#393B3D]'
                : 'border-b border-divider text-sub',
            )}
          >
            O/X
          </button>
        </div>

        {/* 4. 문제 리스트 */}
        <div className="px-4 pt-4 pb-[113px]">
          {quizType === 'MIX_UP' ? (
            <div className="grid gap-2">
              {data?.quizzes
                ?.filter((quiz) => quiz.quizType === 'MIX_UP')
                .map((quiz, index) => (
                  <QuestionCard key={quiz.id}>
                    <QuestionCard.Header order={index + 1} right={<div>...</div>} />
                    <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                    <QuestionCard.OX answerIndex={quiz.answer === 'correct' ? 0 : 1} />
                    <QuestionCard.Explanation>{quiz.explanation}</QuestionCard.Explanation>
                  </QuestionCard>
                ))}
            </div>
          ) : (
            <div className="grid gap-2">
              {data?.quizzes
                ?.filter((quiz) => quiz.quizType === 'MULTIPLE_CHOICE')
                .map((quiz, index) => (
                  <QuestionCard key={quiz.id}>
                    <QuestionCard.Header order={index + 1} right={<div>...</div>} />
                    <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                    <QuestionCard.Multiple options={quiz.options} answerIndex={quiz.options.indexOf(quiz.answer)} />
                    <QuestionCard.Explanation>{quiz.explanation}</QuestionCard.Explanation>
                  </QuestionCard>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default NoteDetailPage
