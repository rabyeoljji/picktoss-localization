/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { AnimatePresence, motion } from 'framer-motion'
import html2pdf from 'html2pdf.js'
import { toast } from 'sonner'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { calculateStar } from '@/features/note/lib'
import { NoteDetailQuizLoadingDrawer } from '@/features/note/ui/note-detail-quiz-loading-drawer'

import { useGetCategories } from '@/entities/category/api/hooks'
import {
  useAddQuizzes,
  useDeleteDocument,
  useGetSingleDocument,
  useUpdateDocumentCategory,
  useUpdateDocumentEmoji,
  useUpdateDocumentIsPublic,
  useUpdateDocumentName,
} from '@/entities/document/api/hooks'
import { useUser } from '@/entities/member/api/hooks'
import {
  useCreateQuizSet,
  useDeleteQuiz,
  useUpdateQuizInfo,
  useUpdateWrongAnswerConfirm,
} from '@/entities/quiz/api/hooks'

import {
  IcChange,
  IcChevronDown,
  IcChevronUp,
  IcDelete,
  IcDownload,
  IcEdit,
  IcKebab,
  IcNote,
  IcPagelink,
  IcPlay,
  IcReview,
  IcSparkle,
  IcUpload,
} from '@/shared/assets/icon'
import { ImgMultiple, ImgOx, ImgStar } from '@/shared/assets/images'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { LackingStarDrawer } from '@/shared/components/drawers/lacking-star-drawer'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogCTA,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
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
import { Input } from '@/shared/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Slider } from '@/shared/components/ui/slider'
import { Spinner } from '@/shared/components/ui/spinner'
import { SquareButton } from '@/shared/components/ui/square-button'
import { Switch } from '@/shared/components/ui/switch'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { Textarea } from '@/shared/components/ui/textarea'
import { useOnceEffect } from '@/shared/hooks'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { Link, useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const NoteDetailPage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()

  const { noteId } = useParams()
  const [quizType, setQuizType] = useQueryParam('/library/:noteId', 'quizType')
  const [showAnswer, setShowAnswer] = useQueryParam('/library/:noteId', 'showAnswer')
  const {
    data: document,
    isLoading: isDocumentLoading,
    refetch: refetchSingleDocument,
  } = useGetSingleDocument(Number(noteId))
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const { data: user } = useUser()

  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const [deleteTargetQuizId, setDeleteTargetQuizId] = useState<number | null>(null)
  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false)
  const { mutate: deleteDocument } = useDeleteDocument()

  const [detailInfoOpen, setDetailInfoOpen] = useState(false)
  const [contentDrawerOpen, setContentDrawerOpen] = useState(false)
  const [reviewPickOpen, setReviewPickOpen] = useState(false)
  const [createQuizDialogOpen, setCreateQuizDialogOpen] = useState(false)
  const [editTargetQuizId, setEditTargetQuizId] = useState<number | null>(null)
  const [isCreatingNewQuizzes, setIsCreatingNewQuizzes] = useState(false)

  const { data: categories } = useGetCategories()

  const { mutate: updateDocumentName } = useUpdateDocumentName()
  const { mutate: updateDocumentEmoji } = useUpdateDocumentEmoji()
  const { mutate: updateDocumentCategory, isPending: isUpdatingDocumentCategory } = useUpdateDocumentCategory(
    Number(noteId),
  )
  const { mutate: updateDocumentIsPublic, isPending: isUpdatingDocumentIsPublic } = useUpdateDocumentIsPublic(
    Number(noteId),
  )

  const { mutate: updateWrongAnswerConfirm } = useUpdateWrongAnswerConfirm()

  const { mutate: deleteSingleQuiz } = useDeleteQuiz()

  const [selectedQuizCount, setSelectedQuizCount] = useState(0)
  useEffect(() => {
    if (!document) return

    if (quizType === 'ALL') {
      setSelectedQuizCount(document.quizzes.length)
    } else if (quizType === 'MIX_UP') {
      setSelectedQuizCount(document.quizzes.filter((quiz) => quiz.quizType === 'MIX_UP').length)
    } else {
      setSelectedQuizCount(document.quizzes.filter((quiz) => quiz.quizType === 'MULTIPLE_CHOICE').length)
    }
  }, [document, quizType])

  const [explanationOpenStates, setExplanationOpenStates] = useState<{ [key: number]: boolean }>({})

  // 제목 엘리먼트의 가시성을 감지하기 위한 state와 ref
  const [_, setShowTitleInHeader] = useState(false)
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

  useOnceEffect(() => {
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
        quizType,
      },
      {
        onSuccess: (data) => {
          trackEvent('quiz_start_click', { location: '내 퀴즈 상세' })
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

  const handleDownloadQuizAsPdf = () => {
    if (!document) return

    // 기존 showAnswer 값 저장 후 강제로 true로 설정해 정답이 보이게 하기
    const originalShowAnswer = showAnswer
    setShowAnswer(true)

    setTimeout(() => {
      // 컨텐츠가 렌더링될 시간을 주고 PDF 생성
      // DOM document에서 요소 가져오기 (document 객체는 API 응답이 아닌 DOM document)
      const quizContainer = window.document.getElementById('quiz-container')
      if (!quizContainer) {
        setShowAnswer(originalShowAnswer)
        return
      }

      // quizType에 따른 파일명 설정
      let quizTypeText
      switch (quizType) {
        case 'ALL':
          quizTypeText = '전체'
          break
        case 'MULTIPLE_CHOICE':
          quizTypeText = '객관식'
          break
        case 'MIX_UP':
          quizTypeText = 'OX'
          break
        default:
          quizTypeText = ''
      }

      const docName = document.name || '퀴즈'
      const filename = `${docName}_${quizTypeText}_퀴즈.pdf`

      // html2pdf 옵션 설정
      const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      // PDF 생성
      html2pdf()
        .from(quizContainer)
        .set(options)
        .save()
        .then(() => {
          // 원래 상태로 복원
          setShowAnswer(originalShowAnswer)
          toast('퀴즈가 PDF로 저장되었습니다.')
          // @ts-expect-error - 이벤트 타입이 정의되지 않은 사용자 정의 이벤트
          trackEvent('quiz_pdf_download', { quizType, documentName: docName })
        })
        .catch((err: Error) => {
          console.error('PDF 생성 오류:', err)
          toast('PDF 생성 중 오류가 발생했습니다.')
          setShowAnswer(originalShowAnswer)
        })
    }, 500) // 렌더링에 시간 주기
  }

  const hasMultipleChoiceQuiz = document?.quizzes.some((quiz) => quiz.quizType === 'MULTIPLE_CHOICE')
  const hasMixUpQuiz = document?.quizzes.some((quiz) => quiz.quizType === 'MIX_UP')

  const quizzes =
    quizType === 'ALL' ? document?.quizzes : document?.quizzes?.filter((quiz) => quiz.quizType === quizType)

  const mixUpQuizCount = document?.quizzes.filter((quiz) => quiz.quizType === 'MIX_UP').length ?? 0

  const maxQuizCount =
    quizType === 'ALL'
      ? document?.quizzes.length
      : quizType === 'MIX_UP'
        ? document?.quizzes.filter((quiz) => quiz.quizType === 'MIX_UP').length
        : document?.quizzes.filter((quiz) => quiz.quizType === 'MULTIPLE_CHOICE').length

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <div className={cn('flex items-center w-full pr-4 justify-between')}>
            <Text typo="subtitle-2-medium" className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap">
              {document?.name}
            </Text>
            {document?.isPublic && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    left={<IcUpload />}
                    onClick={() => {
                      trackEvent('library_share_click')
                    }}
                  >
                    공유하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="typo-h4">{document?.name}</DialogHeader>
                  <div className="mt-[20px] mb-[32px]">
                    <div className="relative bg-disabled rounded-[8px]">
                      <Input
                        disabled={true}
                        value={`${window.location.origin}/explore/detail/${noteId}`}
                        className="w-[calc(100%-70px)] truncate"
                      />
                      <SquareButton
                        variant="tertiary"
                        size="sm"
                        className="absolute right-[12px] bottom-1/2 translate-y-1/2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/explore/detail/${noteId}`)
                          toast('링크가 복사되었어요.')
                        }}
                      >
                        복사
                      </SquareButton>
                    </div>
                  </div>
                  <DialogCTA
                    label="링크 공유하기"
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: document?.name || '',
                            text: `${document?.name}을 확인해보세요!`,
                            url: `${window.location.origin}/explore/detail/${noteId}`,
                          })
                          .catch((error) => {
                            if (error.name !== 'AbortError') {
                              console.error('공유하기 실패:', error)
                            }
                          })
                      } else {
                        // 공유 API를 지원하지 않는 환경에서는 클립보드에 복사
                        navigator.clipboard.writeText(`${window.location.origin}/explore/detail/${noteId}`)
                        toast('링크가 복사되었어요')
                      }
                    }}
                    hasClose
                  />
                </DialogContent>
              </Dialog>
            )}
            {!document?.isPublic && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    left={<IcUpload />}
                    onClick={() => {
                      trackEvent('library_share_click')
                    }}
                  >
                    공유하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="typo-h4">퀴즈 공개가 필요해요</DialogHeader>
                  <DialogDescription className="text-center mt-2 text-sub">
                    픽토스에 퀴즈가 공개된 상태여야
                    <br />
                    공유할 수 있어요
                  </DialogDescription>
                  <DialogCTA
                    label="퀴즈 공개하기"
                    onClick={() =>
                      updateDocumentIsPublic(
                        { isPublic: true },
                        {
                          onSuccess: () => {
                            router.push('/explore/detail/:noteId', { params: [String(noteId)] })
                            toast('퀴즈가 공개되었어요')
                          },
                        },
                      )
                    }
                    disabled={isUpdatingDocumentIsPublic}
                    hasClose
                    className="mt-[32px]"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {/* 2. 스크롤 가능한 메인 영역 (헤더 높이만큼 패딩 처리) */}
      <HeaderOffsetLayout className="flex-1 overflow-auto pt-[54px]">
        <div className="px-4 pb-6">
          <div ref={emojiPickerRef} className="relative">
            {isDocumentLoading ? (
              <div className="size-[48px]">
                <Skeleton className="size-[40px]" />
              </div>
            ) : (
              <button
                type="button"
                // 모바일에서 키보드가 올라오지 않도록 기본 포커스 동작을 방지
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="typo-h1 flex-center size-[48px] relative"
              >
                {document?.emoji}
              </button>
            )}
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
            {isDocumentLoading ? (
              <Skeleton className="w-[160px] h-[30px]" />
            ) : (
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
                {document?.name}
              </Text>
            )}
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
                  <AlertDrawer
                    trigger={
                      <button className="p-1">
                        <IcChange className="size-[12px]" />
                      </button>
                    }
                    open={categoryDrawerOpen}
                    onOpenChange={setCategoryDrawerOpen}
                    hasClose
                    title="카테고리 변경"
                    body={
                      <div className="py-[32px]">
                        <RadioGroup
                          onValueChange={(value) => setSelectedCategoryId(Number(value))}
                          value={selectedCategoryId ? String(selectedCategoryId) : undefined}
                          defaultValue={
                            document?.category
                              ? String(categories?.find((cat) => cat.name === document.category)?.id)
                              : undefined
                          }
                          className="flex flex-col"
                        >
                          {Array.isArray(categories) &&
                            categories.map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center gap-[12px] py-[10px] cursor-pointer"
                              >
                                <RadioGroupItem value={String(category.id)} />
                                <Text typo="subtitle-2-medium">
                                  {category.emoji} {category.name}
                                </Text>
                              </label>
                            ))}
                        </RadioGroup>
                      </div>
                    }
                    footer={
                      <div className="h-[114px] pt-[14px]">
                        <Button
                          onClick={() => {
                            if (selectedCategoryId) {
                              updateDocumentCategory(
                                { categoryId: selectedCategoryId },
                                {
                                  onSuccess: () => {
                                    setCategoryDrawerOpen(false)
                                    refetchSingleDocument()
                                  },
                                },
                              )
                            }
                          }}
                          disabled={!selectedCategoryId || isUpdatingDocumentCategory}
                        >
                          {isUpdatingDocumentCategory ? '저장 중...' : '저장'}
                        </Button>
                      </div>
                    }
                  />
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
            {isDocumentLoading ? (
              <Skeleton className="w-[200px] h-[22px]" />
            ) : (
              <div className="flex items-center">
                <Text typo="body-1-medium" color="sub">
                  {document?.createdAt.split('T')[0].split('-').join('.')} · {document?.quizzes?.length}문제
                </Text>
                {document?.isPublic && (
                  <div className="flex items-center">
                    <div className="w-px h-[12px] bg-gray-100 mx-2" />
                    <Link to="/explore/detail/:noteId" params={[String(noteId)]} className="flex items-center gap-1">
                      <Text typo="body-1-medium" color="caption">
                        공개됨
                      </Text>
                      <IcPagelink className="size-4 text-icon-sub" />
                    </Link>
                  </div>
                )}
              </div>
            )}
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
          {/* TODO: 정렬 버튼 */}
          {/* <button className="p-2">
            <IcArrange className="size-4 text-icon-secondary" />
          </button> */}
        </div>

        {/* 4. 문제 리스트 */}
        <div id="quiz-container" className="px-4 pt-4 pb-[113px] bg-base-2 min-h-[100svh]">
          {!isDocumentLoading && (!hasMixUpQuiz || !hasMultipleChoiceQuiz) && (
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

              {Number(user?.star) < calculateStar(document?.content.length || 0) ? (
                <LackingStarDrawer
                  trigger={
                    <Button size="xs" variant="secondary1" className="ml-auto">
                      생성하기
                    </Button>
                  }
                  needStars={calculateStar(document?.content.length || 0)}
                />
              ) : (
                <Dialog open={createQuizDialogOpen} onOpenChange={setCreateQuizDialogOpen}>
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
                          onClick={() => {
                            addQuizzes(
                              {
                                documentId: Number(noteId),
                                data: {
                                  star: calculateStar(document?.content.length || 0),
                                  quizType: mixUpQuizCount > 0 ? 'MULTIPLE_CHOICE' : 'MIX_UP',
                                },
                              },
                              {
                                onSuccess: () => {
                                  refetchSingleDocument()
                                  setCreateQuizDialogOpen(false)
                                  setIsCreatingNewQuizzes(true)
                                },
                              },
                            )
                          }}
                        >
                          생성하기
                        </Button>
                      }
                      hasClose
                      closeLabel="취소"
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}

          <div className="grid gap-2">
            {isDocumentLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="rounded-[12px] h-[250px]" />
              ))}

            {quizzes?.map((quiz, index) => (
              <QuestionCard key={quiz.id}>
                <QuestionCard.Header
                  order={index + 1}
                  right={
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <IcKebab className="size-5 text-icon-sub" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="-translate-y-2">
                        <DropdownMenuItem
                          right={<IcEdit />}
                          onClick={() => {
                            setEditTargetQuizId(quiz.id)
                            trackEvent('library_quiz_edit_click')
                          }}
                        >
                          문제 편집
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          right={<IcDelete className="text-icon-critical" />}
                          onClick={() => setDeleteTargetQuizId(quiz.id)}
                        >
                          문제 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                />
                <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                {quiz.quizType === 'MIX_UP' ? (
                  <QuestionCard.OX answerIndex={quiz.answer === 'correct' ? 0 : 1} showAnswer={showAnswer} />
                ) : (
                  <QuestionCard.Multiple
                    options={quiz.options}
                    answerIndex={quiz.options.indexOf(quiz.answer)}
                    showAnswer={showAnswer}
                  />
                )}
                <QuestionCard.Explanation
                  open={!!explanationOpenStates[quiz.id]}
                  onOpenChange={(open) => setExplanationOpenStates((prev) => ({ ...prev, [quiz.id]: open }))}
                >
                  {quiz.explanation}
                </QuestionCard.Explanation>
              </QuestionCard>
            ))}
          </div>
        </div>
      </HeaderOffsetLayout>

      {/* 하단 툴바 */}
      <div className="fixed bottom-[60px] bg-white right-1/2 translate-1/2 py-2 px-4 shadow-[var(--shadow-md)] flex items-center rounded-[16px]">
        <div className="flex items-center gap-2 shrink-0">
          <Text typo="body-2-bold" color="sub">
            정답
          </Text>
          <Switch
            checked={showAnswer}
            onCheckedChange={(checked) => {
              setShowAnswer(checked)
              trackEvent('library_detail_answer_click', { value: checked })
            }}
          />
        </div>

        <div className="h-[24px] w-px bg-gray-100 mx-[16px] shrink-0" />

        <div className="flex items-center text-icon-secondary">
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className="p-2"
                onClick={() => {
                  trackEvent('library_detail_play_click')
                }}
              >
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
                      max={maxQuizCount}
                      step={1}
                      defaultValue={[maxQuizCount ?? 0]}
                      value={[selectedQuizCount]}
                      onValueChange={(value) => setSelectedQuizCount(value[0])}
                    />
                    <div className="mt-[12px] flex items-center justify-between">
                      <Text typo="body-2-medium" color="sub">
                        1 문제
                      </Text>
                      <Text typo="body-2-medium" color="sub">
                        {maxQuizCount} 문제
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
          <button
            className="p-2"
            onClick={() => {
              setReviewPickOpen(true)
              trackEvent('library_detail_review_click')
            }}
          >
            <IcReview className="size-6" />
          </button>
          <button
            className="p-2"
            onClick={() => {
              setContentDrawerOpen(true)
              trackEvent('library_detail_note_click')
            }}
          >
            <IcNote className="size-6" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2">
              <IcKebab
                className="size-6"
                onClick={() => {
                  trackEvent('library_detail_more_click')
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="-translate-y-2">
              <DropdownMenuItem right={<IcDownload />} onClick={handleDownloadQuizAsPdf}>
                문제 다운로드
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                right={<IcDelete className="text-icon-critical" />}
                onClick={() => setDeleteDocumentDialogOpen(true)}
              >
                퀴즈 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 문제 수정 drawer */}
      <AlertDrawer
        open={editTargetQuizId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditTargetQuizId(null)
          }
        }}
        hasClose={false}
        title="문제 편집"
        height="full"
        body={
          <div>
            {(() => {
              const quiz = document?.quizzes.find((quiz) => quiz.id === editTargetQuizId)
              const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuizInfo(
                editTargetQuizId || 0,
                Number(noteId),
              )

              // 폼 상태 관리
              const [question, setQuestion] = useState(quiz?.question || '')
              const [answer, setAnswer] = useState(quiz?.answer || '')
              const [explanation, setExplanation] = useState(quiz?.explanation || '')
              const [options, setOptions] = useState<string[]>(quiz?.options || [])

              // 유효성 검사 상태
              const [errors, setErrors] = useState({
                question: false,
                answer: false,
                explanation: false,
                options: [] as boolean[],
              })

              // 초기값 설정 (quiz가 변경될 때마다 업데이트)
              useEffect(() => {
                if (quiz) {
                  setQuestion(quiz.question)
                  setAnswer(quiz.answer)
                  setExplanation(quiz.explanation)
                  setOptions([...quiz.options])
                }
              }, [quiz])

              // 옵션 업데이트 핸들러 (객관식 문제용)
              const handleOptionChange = (index: number, value: string) => {
                const newOptions = [...options]
                newOptions[index] = value
                setOptions(newOptions)
              }

              // 유효성 검사 함수
              const validateForm = () => {
                const newErrors = {
                  question: question.trim() === '',
                  answer: answer.trim() === '',
                  explanation: explanation.trim() === '',
                  options: options.map((option) => option.trim() === ''),
                }

                setErrors(newErrors)

                // 객관식 문제의 경우 최소 하나의 옵션이 있어야 함
                if (quiz?.quizType === 'MULTIPLE_CHOICE') {
                  return !newErrors.question && !newErrors.explanation && !newErrors.options.some((error) => error)
                }

                // OX 문제의 경우
                return !newErrors.question && !newErrors.explanation
              }

              // 폼 제출 핸들러
              const handleUpdateQuizSubmit = () => {
                if (!editTargetQuizId || !quiz) return

                // 유효성 검사 실행
                if (!validateForm()) {
                  return
                }

                // 변경사항 여부 확인
                const originalData = {
                  question: quiz.question,
                  answer: quiz.answer,
                  explanation: quiz.explanation,
                  options: quiz.options,
                }

                const newData = {
                  question,
                  answer,
                  explanation,
                  options,
                }

                // JSON.stringify를 통해 두 객체를 비교
                if (JSON.stringify(originalData) === JSON.stringify(newData)) {
                  // 변경사항이 없으면 API 호출 없이 드로어만 닫기
                  setEditTargetQuizId(null)
                  return
                }

                // 변경사항이 있을 경우 API 호출
                updateQuiz(newData, {
                  onError: () => {
                    toast('퀴즈 편집에 실패했습니다.')
                  },
                  onSettled: () => {
                    // 드로어 닫기
                    setEditTargetQuizId(null)
                  },
                })
              }

              return (
                <>
                  {/* 완료 버튼 */}
                  <div className="absolute w-[70px] h-[24px] text-end right-[20px] top-[30px]">
                    <TextButton
                      size="lg"
                      variant="primary"
                      className="ml-auto top-[-10px] right-0"
                      onClick={handleUpdateQuizSubmit}
                      disabled={isUpdating}
                    >
                      {isUpdating ? '저장중' : '완료'}
                    </TextButton>
                  </div>

                  <div className="h-[20px]" />

                  {quiz && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleUpdateQuizSubmit()
                      }}
                    >
                      <Input
                        label="질문"
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value)
                          // 입력 시 오류 상태 초기화
                          if (e.target.value.trim() !== '') {
                            setErrors((prev) => ({ ...prev, question: false }))
                          }
                        }}
                        className="text-secondary"
                        hasError={errors.question}
                        helperText={errors.question ? '질문을 입력해주세요' : ''}
                      />

                      {quiz.quizType === 'MIX_UP' ? (
                        <RadioGroup className="flex gap-2 mt-4" value={answer} onValueChange={setAnswer}>
                          <RadioGroupItem
                            value="correct"
                            className="flex-1 flex-center size-full rounded-[10px] aspect-[164/48] data-[state=checked]:bg-accent"
                            indicator={
                              <div data-slot="radio-group-indicator">
                                <Text
                                  typo="body-1-bold"
                                  color="secondary"
                                  className="group-data-[state=checked]:text-accent"
                                >
                                  O
                                </Text>
                              </div>
                            }
                          />
                          <RadioGroupItem
                            value="incorrect"
                            className="flex-1 flex-center size-full rounded-[10px] aspect-[164/48] data-[state=checked]:bg-accent"
                            indicator={
                              <div data-slot="radio-group-indicator">
                                <Text
                                  typo="body-1-bold"
                                  color="secondary"
                                  className="group-data-[state=checked]:text-accent"
                                >
                                  X
                                </Text>
                              </div>
                            }
                          />
                        </RadioGroup>
                      ) : (
                        <div className="mt-4">
                          <div className="flex flex-col gap-4">
                            {options.map((option, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div
                                  className="text-primary flex-center group aspect-square size-5 shrink-0 cursor-pointer rounded-full border border-gray-200 transition-[color,box-shadow] outline-none disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                                  onClick={() => setAnswer(option)}
                                >
                                  {answer === option && <div className="size-3 rounded-full bg-orange-500" />}
                                </div>
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newValue = e.target.value
                                    handleOptionChange(index, newValue)

                                    // 현재 선택된 값이 변경되는 옵션이면 answer도 업데이트
                                    if (answer === option) {
                                      setAnswer(newValue)
                                    }

                                    // 입력 시 오류 상태 초기화
                                    if (newValue.trim() !== '') {
                                      const newOptionErrors = [...errors.options]
                                      newOptionErrors[index] = false
                                      setErrors((prev) => ({ ...prev, options: newOptionErrors }))
                                    }
                                  }}
                                  className="text-secondary flex-1"
                                  hasError={errors.options[index]}
                                  helperText={errors.options[index] ? '내용을 입력해주세요' : ''}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-5">
                        <Textarea
                          label="해설"
                          value={explanation}
                          onChange={(e) => {
                            setExplanation(e.target.value)
                            // 입력 시 오류 상태 초기화
                            if (e.target.value.trim() !== '') {
                              setErrors((prev) => ({ ...prev, explanation: false }))
                            }
                          }}
                          className="text-secondary"
                          hasError={errors.explanation}
                          helperText={errors.explanation ? '해설을 입력해주세요' : ''}
                        />
                      </div>
                    </form>
                  )}
                </>
              )
            })()}
          </div>
        }
      />

      {/* TODO: 복습 픽 drawer */}
      <Drawer open={reviewPickOpen} onOpenChange={setReviewPickOpen}>
        <DrawerContent height="full" className="pb-[40px]">
          <DrawerHeader>
            <DrawerTitle>복습 Pick</DrawerTitle>
            <DrawerDescription>내가 틀렸던 문제들을 확인해보세요</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-scroll">
            {document?.quizzes
              .filter((quiz) => quiz.reviewNeeded)
              .map((quiz, index) => (
                <div key={quiz.id}>
                  <QuestionCard key={quiz.id} className="border-none">
                    <QuestionCard.Header order={index + 1} className="px-0" />
                    <QuestionCard.Question className="px-0">{quiz.question}</QuestionCard.Question>
                    {quiz.quizType === 'MIX_UP' ? (
                      <QuestionCard.OX
                        answerIndex={quiz.answer === 'correct' ? 0 : 1}
                        showAnswer={true}
                        className="px-0"
                      />
                    ) : (
                      <QuestionCard.Multiple
                        options={quiz.options}
                        answerIndex={quiz.options.indexOf(quiz.answer)}
                        showAnswer={true}
                        className="px-0"
                      />
                    )}
                    <QuestionCard.Explanation hideToggle open={true} className="px-0">
                      {quiz.explanation}
                    </QuestionCard.Explanation>
                  </QuestionCard>
                  <SquareButton
                    variant="secondary"
                    className="w-full mt-4"
                    onClick={() =>
                      updateWrongAnswerConfirm({
                        noteId: Number(noteId),
                        quizId: quiz.id,
                      })
                    }
                  >
                    이해했어요
                  </SquareButton>
                </div>
              ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* TODO: Markdown Viewer */}
      {/* 원본 노트 drawer */}
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

      {/* 단일 문제 삭제 confirm 모달 */}
      {deleteTargetQuizId !== null && (
        <Dialog
          defaultOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTargetQuizId(null)
            }
          }}
        >
          <DialogContent className="pt-[24px] px-[20px] pb-[8px] w-[280px]">
            <DialogTitle className="typo-subtitle-2-bold text-center">문제를 삭제할까요?</DialogTitle>
            <DialogDescription className="typo-body-1-medium text-sub text-center mt-1">
              삭제한 문제는 다시 복구할 수 없어요
            </DialogDescription>
            <div className="flex gap-2.5 mt-[20px]">
              <DialogClose asChild>
                <button className="h-[48px] flex-1 text-sub">취소</button>
              </DialogClose>
              <button
                className="h-[48px] flex-1 text-red-500"
                onClick={() => {
                  deleteSingleQuiz({
                    documentId: Number(noteId),
                    quizId: deleteTargetQuizId,
                  })
                  setDeleteTargetQuizId(null)
                }}
              >
                삭제
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 문서 삭제 confirm 모달 */}
      <SystemDialog
        open={deleteDocumentDialogOpen}
        onOpenChange={setDeleteDocumentDialogOpen}
        title="퀴즈를 삭제하시겠어요?"
        content={
          <Text typo="body-1-medium" color="sub">
            선택한 퀴즈와{' '}
            <Text as="span" typo="body-1-medium" color="incorrect">
              {`${document?.quizzes.length}개의 문제`}
            </Text>
            가 모두 삭제되며, 복구할 수 없어요
          </Text>
        }
        variant="critical"
        confirmLabel="삭제"
        onConfirm={() => {
          deleteDocument({ documentIds: [Number(noteId)] })
          router.replace('/library')
          toast('퀴즈가 삭제되었습니다.')
        }}
      />

      {isCreatingNewQuizzes && (
        <NoteDetailQuizLoadingDrawer
          documentName={document?.name ?? ''}
          documentId={document?.id ?? 0}
          isLoading={isCreatingNewQuizzes}
          close={() => setIsCreatingNewQuizzes(false)}
        />
      )}
    </div>
  )
}

export default withHOC(NoteDetailPage, {})
