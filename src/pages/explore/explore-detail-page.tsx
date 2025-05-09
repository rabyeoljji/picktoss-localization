import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { format } from 'date-fns'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import {
  useCreateDocumentBookmark,
  useDeleteDocumentBookmark,
  useGetPublicSingleDocument,
  useUpdateDocumentIsPublic,
} from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import { IcArrange, IcBookmark, IcBookmarkFilled, IcKebab, IcPlayFilled, IcUpload } from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import FixedBottom from '@/shared/components/fixed-bottom'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from '@/shared/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Slider } from '@/shared/components/ui/slider'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { useSessionStorage } from '@/shared/lib/storage'
import { cn } from '@/shared/lib/utils'

const ExploreDetailPage = () => {
  const defaultDateString = new Date().toISOString()
  const router = useRouter()

  const { noteId } = useParams()
  const [quizType, setQuizType] = useQueryParam('/explore/detail/:noteId', 'quizType')

  const { mutate: updatePublic } = useUpdateDocumentIsPublic(Number(noteId))
  const { mutate: bookmarkDocument } = useCreateDocumentBookmark(Number(noteId))
  const { mutate: deleteBookmark } = useDeleteDocumentBookmark(Number(noteId))

  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false)

  const { data: document } = useGetPublicSingleDocument(Number(noteId))
  const existQuizTypes = Array.from(new Set(document?.quizzes.map((quiz) => quiz.quizType)))

  // 북마크 정보 업데이트를 위한 세션 스토리지 설정
  const [, setStorageBookmark] = useSessionStorage('bookmarkUpdate', null)
  useEffect(() => {
    setStorageBookmark({ id: Number(noteId) })
  }, [noteId])

  // 풀 문제 수 설정
  const [selectedQuizCount, setSelectedQuizCount] = useState(0)
  useEffect(() => {
    if (!document) return

    setSelectedQuizCount(document.quizzes.length)

    if (existQuizTypes.length === 1) {
      setQuizType(existQuizTypes[0])
    }
  }, [document])

  const [explanationOpenStates, setExplanationOpenStates] = useState<{ [key: number]: boolean }>({})

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

  const cancelRelease = () => {
    updatePublic(
      { isPublic: false },
      {
        onSuccess: () => {
          router.replace('/explore')
        },
      },
    )
  }

  // 북마크 핸들러
  const handleBookmark = () => {
    if (!document || isBookmarkProcessing) return

    setIsBookmarkProcessing(true)

    // 낙관적 UI 업데이트를 위한 북마크 상태와 카운트 계산
    const optimisticIsBookmarked = !document.isBookmarked
    const optimisticBookmarkCount = document.bookmarkCount + (optimisticIsBookmarked ? 1 : -1)

    const previousDocument = { ...document }

    // UI 반영
    document.isBookmarked = optimisticIsBookmarked
    document.bookmarkCount = optimisticBookmarkCount

    const rollback = () => {
      // 롤백: 원래 상태 복원
      document.isBookmarked = previousDocument.isBookmarked
      document.bookmarkCount = previousDocument.bookmarkCount
    }

    const onSettled = async () => {
      setIsBookmarkProcessing(false)
    }

    const onSuccess = () => {
      setStorageBookmark({
        id: document.id,
        isBookmarked: optimisticIsBookmarked,
        bookmarkCount: optimisticBookmarkCount,
        isUpdated: true,
      })
    }

    const mutationOptions = {
      onSuccess,
      onError: rollback,
      onSettled,
    }

    if (optimisticIsBookmarked) {
      bookmarkDocument(undefined, mutationOptions)
    } else {
      deleteBookmark(undefined, mutationOptions)
    }
  }

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

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <div className={cn('flex items-center w-full', showTitleInHeader ? 'justify-between' : 'justify-end')}>
            {showTitleInHeader && (
              <Text typo="subtitle-2-medium" className="text-ellipsis overflow-hidden whitespace-nowrap">
                {document?.name}
              </Text>
            )}
            <div className="flex items-center text-icon-secondary">
              <button className="size-[40px] flex-center">
                <IcUpload className="size-[24px]" />
              </button>
              {!document?.isOwner && (
                <button
                  onClick={handleBookmark}
                  className="size-[40px] flex-center disabled:pointer-events-none"
                  disabled={isBookmarkProcessing}
                >
                  {document?.isBookmarked ? (
                    <IcBookmarkFilled className="size-[24px]" />
                  ) : (
                    <IcBookmark className="size-[24px]" />
                  )}
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-[40px] flex-center">
                    <IcKebab className="size-[24px]" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {document?.isOwner ? (
                    <>
                      <SystemDialog
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                            공개 취소
                          </DropdownMenuItem>
                        }
                        title="공개 취소"
                        content={
                          <>
                            퀴즈가 비공개 처리되며, 다른 사람들의 <br /> 풀이 및 저장 정보가 삭제돼요
                          </>
                        }
                        confirmLabel="확인"
                        onConfirm={cancelRelease}
                      />
                      <DropdownMenuItem
                        onClick={() => router.push('/library/:noteId', { params: [String(noteId)] })}
                        className="cursor-pointer"
                      >
                        퀴즈 수정
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        router.push('/explore/complain/:noteId', {
                          params: [String(noteId)],
                          search: { name: document?.name },
                        })
                      }
                      className="cursor-pointer"
                    >
                      퀴즈 신고
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        }
      />

      {/* 2. 스크롤 가능한 메인 영역 (헤더 높이만큼 패딩 처리) */}
      <HeaderOffsetLayout className="flex-1 overflow-auto pt-[var(--header-height-safe)] scrollbar-hide">
        <div className="px-4 pb-6 flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[12px]">
            <Text typo="h1" className="flex-center size-[48px]">
              {document?.emoji}
            </Text>

            {/* 제목 요소에 ref 추가 */}
            <Text ref={titleRef} typo="h3" className="outline-none">
              {document?.name ?? 'Loading...'}
            </Text>

            <Text typo="body-1-medium" color="sub" className="flex items-center">
              <div className="inline-flex justify-start items-center gap-[2px]">
                <span>{document?.category}</span>
              </div>

              <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />

              <div className="inline-flex justify-start items-center gap-[2px]">
                <IcPlayFilled className="size-[12px] text-icon-sub" />
                <span>{document?.tryCount}</span>
              </div>

              <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />

              <div className="inline-flex justify-start items-center gap-[2px]">
                <IcBookmarkFilled className="size-[12px] text-icon-sub" />
                <span>{document?.bookmarkCount}</span>
              </div>
            </Text>
          </div>

          <Text typo="body-1-medium" color="sub" className="flex items-center">
            {format(new Date(document?.createdAt ?? defaultDateString), 'yyyy.M.d')} 작성
            <div className="inline-block size-[4px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />{' '}
            {document?.quizzes?.length} 문제
          </Text>
        </div>

        {/* 3. 탭 바 - sticky로 상단에 고정 */}
        <div className="sticky top-0 z-40 bg-white flex items-center justify-between border-b border-divider pt-[10px] pb-[6px] px-[20px]">
          <div className="flex items-center gap-[24px]">
            {existQuizTypes.find((type) => type === 'MULTIPLE_CHOICE') &&
              existQuizTypes.find((type) => type === 'MIX_UP') && (
                <TextButton
                  size={'lg'}
                  variant={quizType === 'ALL' ? 'secondary' : 'sub'}
                  onClick={() => setQuizType('ALL')}
                >
                  전체
                </TextButton>
              )}
            {existQuizTypes.find((type) => type === 'MULTIPLE_CHOICE') && (
              <TextButton
                size={'lg'}
                variant={quizType === 'MULTIPLE_CHOICE' ? 'secondary' : 'sub'}
                onClick={() => setQuizType('MULTIPLE_CHOICE')}
              >
                객관식
              </TextButton>
            )}
            {existQuizTypes.find((type) => type === 'MIX_UP') && (
              <TextButton
                size={'lg'}
                variant={quizType === 'MIX_UP' ? 'secondary' : 'sub'}
                onClick={() => setQuizType('MIX_UP')}
              >
                O/X
              </TextButton>
            )}
          </div>

          {/* 정렬 버튼 */}
          <button className="size-[32px] flex-center">
            <IcArrange className="size-[20px] text-icon-secondary" />
          </button>
        </div>

        {/* 4. 문제 리스트 */}
        <div className="px-4 pt-4 pb-[113px] bg-base-2 flex flex-col gap-2">
          {quizType === 'MIX_UP' || quizType === 'ALL' ? (
            <div className="grid gap-2">
              {document?.quizzes
                ?.filter((quiz) => quiz.quizType === 'MIX_UP')
                .map((quiz, index) => (
                  <QuestionCard key={quiz.id}>
                    <QuestionCard.Header order={index + 1} />
                    <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                    <QuestionCard.OX answerIndex={quiz.answer === 'correct' ? 0 : 1} />
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
            (quizType === 'MULTIPLE_CHOICE' || quizType === 'ALL') && (
              <div className="grid gap-2">
                {document?.quizzes
                  ?.filter((quiz) => quiz.quizType === 'MULTIPLE_CHOICE')
                  .map((quiz, index) => (
                    <QuestionCard key={quiz.id}>
                      <QuestionCard.Header order={index + 1} />
                      <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                      <QuestionCard.Multiple options={quiz.options} answerIndex={quiz.options.indexOf(quiz.answer)} />
                      <QuestionCard.Explanation
                        open={!!explanationOpenStates[quiz.id]}
                        onOpenChange={(open) => setExplanationOpenStates((prev) => ({ ...prev, [quiz.id]: open }))}
                      >
                        {quiz.explanation}
                      </QuestionCard.Explanation>
                    </QuestionCard>
                  ))}
              </div>
            )
          )}
        </div>

        {/* 5. 하단 퀴즈 시작하기 버튼 */}
        <FixedBottom className="bg-[linear-gradient(to_top,#ffffff_85%,rgba(255,255,255,0)_100%)]">
          <Drawer>
            <DrawerTrigger asChild>
              <Button>퀴즈 시작하기</Button>
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
                  data-state={isCreatingQuizSet && 'loading'}
                >
                  퀴즈 시작하기
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </FixedBottom>
      </HeaderOffsetLayout>
    </div>
  )
}

export default withHOC(ExploreDetailPage, {})
