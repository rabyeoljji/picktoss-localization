import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { AnimatePresence, motion } from 'framer-motion'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { calculateStar } from '@/features/note/lib'

import {
  useAddQuizzes,
  useGetSingleDocument,
  useUpdateDocumentEmoji,
  useUpdateDocumentName,
} from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import {
  IcArrange,
  IcChange,
  IcChevronDown,
  IcChevronUp,
  IcDelete,
  IcDownload,
  IcKebab,
  IcNote,
  IcPlay,
  IcReview,
  IcSparkle,
  IcUpload,
} from '@/shared/assets/icon'
import { ImgMultiple, ImgOx, ImgStar } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import { Header } from '@/shared/components/header'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogCTA, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Slider } from '@/shared/components/ui/slider'
import { Spinner } from '@/shared/components/ui/spinner'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const NoteDetailPage = () => {
  const router = useRouter()

  const { noteId } = useParams()
  const [quizType, setQuizType] = useQueryParam('/library/:noteId', 'quizType')
  const [showAnswer, setShowAnswer] = useQueryParam('/library/:noteId', 'showAnswer')
  const { data: document } = useGetSingleDocument(Number(noteId))
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  console.log(document)
  const [detailInfoOpen, setDetailInfoOpen] = useState(false)
  const [contentDrawerOpen, setContentDrawerOpen] = useState(false)

  const { mutate: updateDocumentName } = useUpdateDocumentName()
  const { mutate: updateDocumentEmoji } = useUpdateDocumentEmoji()

  const [selectedQuizCount, setSelectedQuizCount] = useState(0)
  useEffect(() => {
    if (!document) return

    setSelectedQuizCount(document.quizzes.length)
  }, [document])

  const [explanationOpenStates, setExplanationOpenStates] = useState<{ [key: number]: boolean }>({})

  // 제목 엘리먼트의 가시성을 감지하기 위한 state와 ref
  const [showTitleInHeader, setShowTitleInHeader] = useState(false)
  const titleRef = useRef(null)

  const { mutate: createQuizSet, isPending: isCreatingQuizSet } = useCreateQuizSet(Number(noteId))

  const { mutate: addQuizzes } = useAddQuizzes()

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

  useEffect(() => {
    if (!document) return

    const hasMultipleChoiceQuiz = document.quizzes.some((quiz) => quiz.quizType === 'MULTIPLE_CHOICE')
    const hasMixUpQuiz = document.quizzes.some((quiz) => quiz.quizType === 'MIX_UP')

    if (hasMultipleChoiceQuiz && hasMixUpQuiz) {
      setQuizType('ALL')
    } else if (hasMultipleChoiceQuiz) {
      setQuizType('MULTIPLE_CHOICE')
    } else if (hasMixUpQuiz) {
      setQuizType('MIX_UP')
    }
  }, [document])

  const handlePlay = (quizCount: number) => {
    createQuizSet(
      {
        quizCount,
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

  const hasMultipleChoiceQuiz = document?.quizzes.some((quiz) => quiz.quizType === 'MULTIPLE_CHOICE')
  const hasMixUpQuiz = document?.quizzes.some((quiz) => quiz.quizType === 'MIX_UP')

  const quizzes =
    quizType === 'ALL' ? document?.quizzes : document?.quizzes?.filter((quiz) => quiz.quizType === quizType)

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <div className={cn('flex items-center w-full pr-4', showTitleInHeader ? 'justify-between' : 'justify-end')}>
            {showTitleInHeader && (
              <Text typo="subtitle-2-medium" className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap">
                {document?.name}
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
              {document?.emoji}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full bg-base-1 z-50 left-0 mt-1">
                <EmojiPicker
                  onEmojiClick={(data) => {
                    setShowEmojiPicker(false)
                    updateDocumentEmoji({
                      documentId: Number(noteId),
                      data: { emoji: data.emoji },
                    })
                  }}
                  theme={Theme.LIGHT}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
          {/* 제목 요소에 ref 추가 */}
          <div className="flex justify-between items-center">
            <Text
              ref={titleRef}
              typo="h3"
              className="mt-3 outline-none"
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                updateDocumentName({
                  documentId: Number(noteId),
                  data: { name: (e.target as unknown as HTMLDivElement).innerText.trim() || document?.name || '' },
                })
              }}
            >
              {document?.name ?? 'Loading...'}
            </Text>
            <button onClick={() => setDetailInfoOpen((prev) => !prev)} className="p-1">
              {detailInfoOpen ? (
                <IcChevronUp className="text-icon-secondary" />
              ) : (
                <IcChevronDown className="text-icon-secondary" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {detailInfoOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Text typo="body-1-bold" color="sub" className="mt-3">
                  카테고리
                </Text>
                <div className="flex items-center gap-2 mt-2">
                  <Text typo="subtitle-2-bold" color="secondary">
                    {document?.category}
                  </Text>
                  <button className="p-1">
                    <IcChange className="size-[12px]" />
                  </button>
                </div>

                <Text typo="body-1-bold" color="sub" className="mt-4">
                  원본문서
                </Text>
                <div className="relative">
                  <Text typo="body-1-regular" color="gray-600" className="mt-2 line-clamp-3">
                    {document?.content}
                  </Text>
                  <button
                    className="typo-body-1-regular w-[120px] bg-base-1 absolute bottom-0 right-0 text-start"
                    onClick={() => setContentDrawerOpen(true)}
                  >
                    ...<span className="text-blue-500">더보기</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-2">
            <Text typo="body-1-medium" color="sub">
              {document?.createdAt.split('T')[0].split('-').join('.')} · {document?.quizzes?.length}문제 · 공개됨
            </Text>
          </div>
        </div>

        {/* 3. 탭 바 - sticky로 상단에 고정 */}
        <div className="sticky top-0 z-40 bg-white flex pl-2 pr-5 pt-[10px] pb-[6px] justify-between">
          <div>
            {hasMultipleChoiceQuiz && hasMixUpQuiz && (
              <TextButton
                className={cn('px-3 h-[32px]', quizType === 'ALL' ? 'text-primary' : 'text-sub')}
                onClick={() => setQuizType('ALL')}
              >
                전체
              </TextButton>
            )}
            {hasMultipleChoiceQuiz && (
              <TextButton
                className={cn('px-3 h-[32px]', quizType === 'MULTIPLE_CHOICE' ? 'text-primary' : 'text-sub')}
                onClick={() => setQuizType('MULTIPLE_CHOICE')}
              >
                객관식
              </TextButton>
            )}
            {hasMixUpQuiz && (
              <TextButton
                className={cn('px-3 h-[32px]', quizType === 'MIX_UP' ? 'text-primary' : 'text-sub')}
                onClick={() => setQuizType('MIX_UP')}
              >
                O/X
              </TextButton>
            )}
          </div>
          <button className="p-2">
            <IcArrange className="size-4 text-icon-secondary" />
          </button>
        </div>

        {/* 4. 문제 리스트 */}
        <div className="px-4 pt-4 pb-[113px] bg-base-2">
          {!hasMixUpQuiz ||
            (!hasMultipleChoiceQuiz && (
              <div className="mb-2.5 rounded-[12px] bg-base-1 py-3 px-4 flex items-center gap-2">
                <IcSparkle className="text-icon-accent size-4" />
                <Text typo="body-1-bold">
                  {quizType === 'MIX_UP' ? (
                    <span className="text-accent">객관식</span>
                  ) : (
                    <span className="text-accent">O/X</span>
                  )}{' '}
                  퀴즈도 풀어보고 싶다면?
                </Text>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="xs" variant="secondary1" className="ml-auto">
                      생성하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex-center flex-col text-center gap-4 mb-[32px]">
                      <div className="h-[120px] flex-center">
                        {quizType === 'MIX_UP' ? (
                          <ImgMultiple className="w-[99px]" />
                        ) : (
                          <ImgOx className="w-[106.6px]" />
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Text typo="h4" color="primary">
                          {quizType === 'MIX_UP' ? '객관식' : 'O/X'}
                        </Text>
                        <Text typo="subtitle-2-medium" color="sub">
                          이 유형의 문제를 생성할까요?
                        </Text>
                      </div>
                    </div>

                    <DialogCTA
                      customButton={
                        <Button
                          variant="special"
                          right={
                            <div className="flex-center size-[fit] rounded-full bg-[#D3DCE4]/[0.2] px-[8px]">
                              <ImgStar className="size-[16px] mr-[4px]" />
                              <Text typo="body-1-medium">{calculateStar(document?.content.length || 0)}</Text>
                            </div>
                          }
                          onClick={() =>
                            addQuizzes({
                              documentId: Number(noteId),
                              data: {
                                star: calculateStar(document?.content.length || 0),
                                quizType: quizType === 'MIX_UP' ? 'MULTIPLE_CHOICE' : 'MIX_UP',
                              },
                            })
                          }
                        >
                          생성하기
                        </Button>
                      }
                      hasClose
                      closeLabel="취소"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}

          <div className="grid gap-2">
            {quizzes?.map((quiz, index) =>
              quiz.quizType === 'MIX_UP' ? (
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
              ) : (
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
              ),
            )}
          </div>
        </div>

        {/* TODO: Markdown Viewer */}
        {/* 6. 원본 노트 drawer */}
        <Drawer open={contentDrawerOpen} onOpenChange={setContentDrawerOpen}>
          <DrawerContent height="full">
            <DrawerHeader>
              <DrawerTitle>원본 노트</DrawerTitle>
              <DrawerDescription>
                {document?.createdAt.split('T')[0].split('-').join('.')} 등록 / {document?.content?.length}자
              </DrawerDescription>
            </DrawerHeader>
            <div className="mt-5 flex-1 overflow-y-scroll pb-10">
              <p>{document?.content}</p>
            </div>
          </DrawerContent>
        </Drawer>
      </HeaderOffsetLayout>

      {/* 5. 하단 툴바 */}
      <div className="fixed bottom-[60px] bg-white right-1/2 translate-1/2 py-2 px-4 shadow-md flex items-center rounded-[16px]">
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
          <Drawer>
            <DrawerTrigger asChild>
              <button className="p-2">
                <IcPlay className="size-6" />
              </button>
            </DrawerTrigger>
            <DrawerContent height="sm">
              <div className="py-[20px]">
                <Text typo="body-1-medium" color="sub" className="text-center">
                  풀 문제 수
                </Text>
                <Text typo="h2" color="accent" className="mt-1 text-center">
                  {selectedQuizCount} 문제
                </Text>
                {document && (
                  <div className="mt-[32px]">
                    <Slider
                      min={1}
                      max={document.quizzes.length}
                      step={1}
                      defaultValue={[document.quizzes.length]}
                      value={[selectedQuizCount]}
                      onValueChange={(value) => setSelectedQuizCount(value[0])}
                    />
                    <div className="mt-[12px] flex items-center justify-between">
                      <Text typo="body-2-medium" color="sub">
                        1 문제
                      </Text>
                      <Text typo="body-2-medium" color="sub">
                        {document.quizzes.length} 문제
                      </Text>
                    </div>
                  </div>
                )}
              </div>

              <DrawerFooter className="h-[114px]">
                <Button
                  onClick={() => handlePlay(selectedQuizCount)}
                  className="mt-[14px]"
                  disabled={isCreatingQuizSet}
                >
                  {isCreatingQuizSet ? <Spinner className="size-6" /> : '퀴즈 시작하기'}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <button className="p-2">
            <IcReview className="size-6" />
          </button>
          <button className="p-2" onClick={() => setContentDrawerOpen(true)}>
            <IcNote className="size-6" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2">
              <IcKebab className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="-translate-y-2">
              <DropdownMenuItem right={<IcDownload />}>문제 다운로드</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" right={<IcDelete className="text-icon-critical" />}>
                문서 전체 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* <QuizLoadingDrawer /> */}
    </div>
  )
}

export default withHOC(NoteDetailPage, {})
