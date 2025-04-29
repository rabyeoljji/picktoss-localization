import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import EmojiPicker, { Theme } from 'emoji-picker-react'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useGetSingleDocument } from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import { IcDelete, IcDownload, IcKebab, IcNote, IcPlay, IcReview, IcUpload } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/shared/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Spinner } from '@/shared/components/ui/spinner'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const NoteDetailPage = () => {
  const router = useRouter()

  const { noteId } = useParams()
  const [quizType, setQuizType] = useQueryParam('/library/:noteId', 'quizType')
  const [showAnswer, setShowAnswer] = useQueryParam('/library/:noteId', 'showAnswer')
  const { data } = useGetSingleDocument(noteId ? Number(noteId) : -1)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [emoji, setEmoji] = useState('😍')

  const [explanationOpenStates, setExplanationOpenStates] = useState<{ [key: number]: boolean }>({})

  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false)

  // 제목 엘리먼트의 가시성을 감지하기 위한 state와 ref
  const [showTitleInHeader, setShowTitleInHeader] = useState(false)
  const titleRef = useRef(null)

  const { mutate: createQuizSet, isPending: isCreatingQuizSet } = useCreateQuizSet(Number(noteId))

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

  const handlePlay = () => {
    createQuizSet(
      {
        quizCount: 3,
      },
      {
        onSuccess: (data) => {
          router.push('/progress-quiz/:quizSetId', {
            params: [String(data.quizSetId)],
            search: {
              documentId: Number(noteId ?? 0),
            },
          })
        },
      },
    )
  }

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <div className={cn('flex items-center w-full', showTitleInHeader ? 'justify-between' : 'justify-end')}>
            {showTitleInHeader && (
              <Text typo="subtitle-2-medium" className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap">
                {data?.name}
              </Text>
            )}
            <Button size="sm" left={<IcUpload />}>
              공유하기
            </Button>
          </div>
        }
      />

      {/* 2. 스크롤 가능한 메인 영역 (헤더 높이만큼 패딩 처리) */}
      <HeaderOffsetLayout className="flex-1 overflow-auto pt-[var(--header-height-safe)]">
        <div className="px-4 pb-6">
          <div ref={emojiPickerRef} className="relative">
            <button
              type="button"
              // 모바일에서 키보드가 올라오지 않도록 기본 포커스 동작을 방지
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="typo-h1 flex-center size-[48px]"
            >
              {emoji}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full bg-base-1 z-50 left-0 mt-1">
                <EmojiPicker
                  onEmojiClick={(data) => {
                    setEmoji(data.emoji)
                    setShowEmojiPicker(false)
                  }}
                  theme={Theme.LIGHT}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
          {/* 제목 요소에 ref 추가 */}
          <Text ref={titleRef} typo="h3" className="mt-3">
            {data?.name ?? 'Loading...'}
          </Text>
          <div className="mt-2">
            <Text typo="body-1-medium" color="sub">
              2025.05.28 · {data?.quizzes?.length}문제 · 공개됨
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
                    <QuestionCard.OX answerIndex={quiz.answer === 'correct' ? 0 : 1} showAnswer={showAnswer} />
                    <QuestionCard.Explanation
                      open={!!explanationOpenStates[quiz.id]}
                      onOpenChange={(open) => setExplanationOpenStates((prev) => ({ ...prev, [quiz.id]: open }))}
                    >
                      {quiz.explanation}
                    </QuestionCard.Explanation>
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
                    <QuestionCard.Multiple
                      options={quiz.options}
                      answerIndex={quiz.options.indexOf(quiz.answer)}
                      showAnswer={showAnswer}
                    />
                    <QuestionCard.Explanation
                      open={!!explanationOpenStates[quiz.id]}
                      onOpenChange={(open) => setExplanationOpenStates((prev) => ({ ...prev, [quiz.id]: open }))}
                    >
                      {quiz.explanation}
                    </QuestionCard.Explanation>
                  </QuestionCard>
                ))}
            </div>
          )}
        </div>

        {/* 5. 하단 툴바 */}
        <div className="absolute bottom-[60px] bg-white right-1/2 translate-1/2 py-2 px-4 shadow-md flex items-center rounded-[16px]">
          <div className="flex items-center gap-2 shrink-0">
            <Text typo="body-2-bold" color="sub">
              정답
            </Text>
            <Switch
              checked={showAnswer}
              onCheckedChange={(checked) => {
                setShowAnswer(checked)
              }}
            />
          </div>

          <div className="h-[24px] w-px bg-gray-100 mx-[16px] shrink-0" />

          <div className="flex items-center text-icon-secondary">
            <button className="p-2" onClick={handlePlay}>
              {isCreatingQuizSet ? <Spinner className="size-6" /> : <IcPlay className="size-6" />}
            </button>
            <button className="p-2">
              <IcReview className="size-6" />
            </button>
            <button className="p-2">
              <IcNote className="size-6" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2">
                <IcKebab className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="-translate-y-2">
                <DropdownMenuItem right={<IcDownload />}>문제 다운로드</DropdownMenuItem>
                <DropdownMenuItem right={<IcNote />} onClick={() => setIsContentDrawerOpen(true)}>
                  원본 노트 보기
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" right={<IcDelete className="text-icon-critical" />}>
                  문서 전체 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 6. 원본 노트 drawer */}
        <Drawer open={isContentDrawerOpen} onOpenChange={setIsContentDrawerOpen}>
          <DrawerContent height="full">
            <DrawerHeader>
              <DrawerTitle>원본 노트</DrawerTitle>
              <DrawerDescription>2025.03.28 등록 / {data?.content?.length}자</DrawerDescription>
            </DrawerHeader>
            <div className="mt-5 flex-1 overflow-y-scroll pb-10">
              <p>{data?.content}</p>
            </div>
          </DrawerContent>
        </Drawer>
      </HeaderOffsetLayout>
    </div>
  )
}

export default withHOC(NoteDetailPage, {})
