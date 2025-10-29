/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { format } from 'date-fns'
import html2pdf from 'html2pdf.js'
import { toast } from 'sonner'
import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'
import NotFound from '@/app/not-found'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'

import { useDeleteDocument, useDocumentBookmarkMutation, useGetDocument } from '@/entities/document/api/hooks'
import { useDeleteQuiz, useUpdateQuizInfo } from '@/entities/quiz/api/hooks'

import {
  IcArrowUp,
  IcBookmark,
  IcBookmarkFilled,
  IcDelete,
  IcDownload,
  IcEdit,
  IcKebab,
  IcReview,
} from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { QuestionCard } from '@/shared/components/cards/question-card'
import { AlertDrawer } from '@/shared/components/drawers/alert-drawer'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/shared/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Input } from '@/shared/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Switch } from '@/shared/components/ui/switch'
import { Tag } from '@/shared/components/ui/tag'
import { Text } from '@/shared/components/ui/text'
import { TextButton } from '@/shared/components/ui/text-button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

const NoteDetailPage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()
  const { t } = useTranslation()

  const token = useStore(useAuthStore, (state) => state.token)

  const { noteId } = useParams()
  const [showMultipleChoice, setShowMultipleChoice] = useState(false)
  const [showMixUp, setShowMixUp] = useState(false)
  const [showAnswer, setShowAnswer] = useQueryParam('/quiz-detail/:noteId/list', 'showAnswer')
  const { data: document, isLoading: isDocumentLoading } = useGetDocument(Number(noteId))

  const createdDate = useMemo(() => new Date(document?.createdAt ?? ''), [document])

  const [deleteTargetQuizId, setDeleteTargetQuizId] = useState<number | null>(null)
  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false)
  const { mutate: deleteDocument } = useDeleteDocument()

  const [contentDrawerOpen, setContentDrawerOpen] = useState(false)
  const [reviewPickOpen, setReviewPickOpen] = useState(false)

  const [editTargetQuizId, setEditTargetQuizId] = useState<number | null>(null)

  const { mutate: deleteSingleQuiz } = useDeleteQuiz()

  const [explanationOpenStates, setExplanationOpenStates] = useState<{ [key: number]: boolean }>({})

  // 스크롤 가능 여부 상태
  const [canScroll, setCanScroll] = useState(false)

  // 스크롤 컨테이너 ref
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // 최상단 여부 상태 (스크롤이 내려갔을 때만 버튼 보이게)
  const [isScrolled, setIsScrolled] = useState(false)

  // 북마크 안내 툴팁 자동 노출 상태
  const [showSaveTip, setShowSaveTip] = useState(false)

  // 스크롤 가능 여부 체크 함수
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const checkScrollable = () => {
      setCanScroll(el.scrollHeight > el.clientHeight)
    }

    const handleScroll = () => {
      setIsScrolled(el.scrollTop > 0)
    }

    // 초기 체크
    checkScrollable()
    handleScroll()

    // 컨테이너 사이즈/콘텐츠 변경 감지
    const ro = new ResizeObserver(() => checkScrollable())
    ro.observe(el)

    // 윈도우 리사이즈 시에도 재체크
    const onResize = () => checkScrollable()
    window.addEventListener('resize', onResize)

    // 스크롤 이벤트 리스너
    el.addEventListener('scroll', handleScroll)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      el.removeEventListener('scroll', handleScroll)
    }
  }, [document, showMultipleChoice, showMixUp])

  // 스크롤 다운 시 툴팁 1회 노출 후 5초 뒤 자동 숨김
  useEffect(() => {
    if (isScrolled && !document?.isOwner) {
      setShowSaveTip(true)
      const t = setTimeout(() => setShowSaveTip(false), 5000)
      return () => clearTimeout(t)
    }
  }, [isScrolled, document?.isOwner])

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
      if (!showMultipleChoice && !showMixUp) {
        quizTypeText = '전체'
      } else if (showMultipleChoice && showMixUp) {
        quizTypeText = '전체'
      } else if (showMultipleChoice) {
        quizTypeText = '객관식'
      } else if (showMixUp) {
        quizTypeText = 'OX'
      } else {
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
          toast(t('quizDetail.toast.create_pdf_success'))
          trackEvent('library_detail_download_click')
        })
        .catch((err: Error) => {
          console.error('PDF 생성 오류:', err)
          toast(t('quizDetail.toast.create_pdf_error'))
          setShowAnswer(originalShowAnswer)
        })
    }, 500) // 렌더링에 시간 주기
  }

  const quizzes = document?.quizzes.filter((quiz) => {
    if (!showMultipleChoice && !showMixUp) {
      // 둘 다 꺼져있으면 전체 표시
      return true
    }
    if (showMultipleChoice && showMixUp) {
      return true
    }
    if (showMultipleChoice) {
      return quiz.quizType === 'MULTIPLE_CHOICE'
    }
    if (showMixUp) {
      return quiz.quizType === 'MIX_UP'
    }
    return false
  })

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (!document) return
    setIsBookmarked(document.isBookmarked)
  }, [document])

  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false)

  const { mutate: bookmark } = useDocumentBookmarkMutation(Number(noteId))

  const handleBookmark = () => {
    if (!document) return

    if (!token) {
      setIsLoginOpen(true)
      return
    }

    if (!document || isBookmarkProcessing) return

    setIsBookmarkProcessing(true)

    const optimisticIsBookmarked = !document.isBookmarked

    // 즉시 UI 업데이트
    setIsBookmarked(optimisticIsBookmarked)

    bookmark(
      {
        documentId: Number(noteId),
        isBookmarked: document.isBookmarked || false,
      },
      {
        onSuccess: () => {
          trackEvent('explore_bookmark_click', {
            location: '상세 페이지',
            state: optimisticIsBookmarked ? '추가' : '해제',
          })

          if (optimisticIsBookmarked) {
            toast(t('quizDetail.toast.bookmark_success'), {
              icon: <IcBookmarkFilled className="size-4" />,
              action: {
                label: t('quizDetail.quiz_detail_page.view_button'),
                onClick: () => router.push(`/library`, { search: { tab: 'BOOKMARK' } }),
              },
            })
          } else {
            toast(t('quizDetail.toast.bookmark_removed'))
          }
        },
        onError: () => {
          // 실패시 ui 롤백
          setIsBookmarked(document.isBookmarked)
        },
        onSettled: () => setIsBookmarkProcessing(false),
      },
    )
  }

  if (!isDocumentLoading && !document?.isPublic && !document?.isOwner) {
    return <NotFound />
  }

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton />}
        content={
          <div className={cn('flex items-center w-full pr-4 justify-between')}>
            <div className="center flex flex-col items-center">
              <Text typo="subtitle-2-medium" className="text-ellipsis overflow-hidden whitespace-nowrap">
                {document?.name}
              </Text>
              <Text typo="body-2-medium" color="sub">
                {document?.quizzes.length}
                {t('quizDetail.quiz_detail_list_page.question_label')}
              </Text>
            </div>
            <div className="ml-auto flex items-center gap-[2px]">
              <Tooltip open={showSaveTip} onOpenChange={setShowSaveTip}>
                <TooltipTrigger asChild>
                  {!document?.isOwner && (
                    <button className="p-2" onClick={handleBookmark}>
                      {isBookmarked ? (
                        <IcBookmarkFilled className="size-6 text-icon-primary" />
                      ) : (
                        <IcBookmark className="size-6 text-icon-secondary" />
                      )}
                    </button>
                  )}
                </TooltipTrigger>
                <TooltipContent align="end" side="bottom" color="inverse">
                  {t('quizDetail.quiz_detail_list_page.daily_available_message')}
                </TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2" asChild>
                  <button className="p-2">
                    <IcKebab className="size-[24px] text-icon-secondary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="-translate-y-2">
                  {document?.isOwner && (
                    <DropdownMenuItem
                      right={<IcEdit />}
                      onClick={() =>
                        router.push('/quiz-detail/:noteId/edit', {
                          params: [String(document.id)],
                        })
                      }
                    >
                      {t('quizDetail.quiz_detail_list_page.edit_quiz_info_button')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem right={<IcDownload />} onClick={handleDownloadQuizAsPdf}>
                    {t('quizDetail.quiz_detail_list_page.download_questions_button')}
                  </DropdownMenuItem>
                  {document?.isOwner && (
                    <>
                      {/* <DropdownMenuItem right={<IcNote />} onClick={() => setContentDrawerOpen(true)}>
                    {t('quizDetail.quiz_detail_list_page.original_document_button')}
                  </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="text-red-500"
                        right={<IcDelete className="text-icon-critical" />}
                        onClick={() => {
                          trackEvent('library_detail_delete_click')
                          setDeleteDocumentDialogOpen(true)
                        }}
                      >
                        {t('quizDetail.quiz_detail_list_page.delete_quiz_button')}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        }
      />

      {/* 2. 스크롤 가능한 메인 영역 (헤더 높이만큼 패딩 처리) */}
      <HeaderOffsetLayout ref={scrollRef} className="flex-1 overflow-auto pt-[54px] relative scrollbar-hide">
        {(document?.reviewNeededQuizzes?.length ?? 0) > 0 && (
          <button
            className="px-4 py-3 bg-surface-2 flex items-center gap-2 w-full"
            onClick={() => setReviewPickOpen(true)}
          >
            <IcReview className="size-5" />
            <Text typo="body-1-bold" color="secondary">
              {t('quizDetail.quiz_detail_list_page.review_questions_count')}{' '}
              <span className="text-accent">
                {t('quizDetail.quiz_detail_list_page.review_questions_count_unit', {
                  count: document?.reviewNeededQuizzes?.length ?? 0,
                })}
              </span>{' '}
              {t('quizDetail.quiz_detail_list_page.check_button')}
            </Text>
          </button>
        )}
        <div className="pt-[16px] sticky top-0 z-[1] bg-base-1 pb-[12px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className={cn(
                'border rounded-full px-[10px] py-2 typo-button-4 border-outline text-secondary',
                showMultipleChoice && 'border-accent text-accent',
              )}
              onClick={() => setShowMultipleChoice(!showMultipleChoice)}
            >
              {t('common.multiple_choice')}
            </button>
            <button
              className={cn(
                'border rounded-full px-[10px] py-2 typo-button-4 border-outline text-secondary',
                showMixUp && 'border-accent text-accent',
              )}
              onClick={() => setShowMixUp(!showMixUp)}
            >
              {t('quizDetail.quiz_detail_list_page.ox_label')}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Text typo="body-2-bold" color="sub">
              {t('quizDetail.quiz_detail_list_page.show_answer_button')}
            </Text>
            <Switch
              checked={showAnswer}
              onCheckedChange={(checked) => {
                setShowAnswer(checked)
                trackEvent('library_detail_answer_click', { value: checked })
              }}
            />
          </div>
        </div>

        {/* 4. 문제 리스트 */}
        <div id="quiz-container" className="px-4 pt-1 pb-[113px] min-h-[100svh]">
          <div className="grid gap-2">
            {isDocumentLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="rounded-[12px] h-[250px] border border-outline" />
              ))}

            {quizzes?.map((quiz, index) => (
              <QuestionCard key={quiz.id} className="border border-outline">
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
                          {t('quizDetail.quiz_detail_list_page.edit_button')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          right={<IcDelete className="text-icon-critical" />}
                          onClick={() => setDeleteTargetQuizId(quiz.id)}
                        >
                          {t('common.delete')}
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
      {isScrolled && (
        <button
          onClick={() => {
            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={!canScroll}
          className={cn(
            'shadow-md border border-outline bg-base-1 text-icon-secondary rounded-full size-[40px] absolute z-50 flex-center right-[20px] bottom-[65px]',
            !canScroll && 'opacity-50 pointer-events-none',
          )}
        >
          <IcArrowUp className="size-5" />
        </button>
      )}

      {/* 문제 수정 drawer */}
      <AlertDrawer
        open={editTargetQuizId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditTargetQuizId(null)
          }
        }}
        hasClose={false}
        title={t('quizDetail.quiz_detail_list_page.edit_question_title')}
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
                    toast(t('quizDetail.toast.edit_failed'))
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
                      {isUpdating
                        ? t('quizDetail.quiz_detail_list_page.save_button')
                        : t('quizDetail.quiz_detail_list_page.complete_button')}
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
                        label={t('quizDetail.quiz_detail_list_page.question_label')}
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
                        helperText={
                          errors.question ? t('quizDetail.quiz_detail_list_page.question_required_error') : ''
                        }
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
                                  helperText={
                                    errors.options[index]
                                      ? t('quizDetail.quiz_detail_list_page.option_required_error')
                                      : ''
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-5">
                        <Textarea
                          label={t('quizDetail.quiz_detail_list_page.explanation_label')}
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
                          helperText={
                            errors.explanation ? t('quizDetail.quiz_detail_list_page.explanation_required_error') : ''
                          }
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
            <DrawerTitle>{t('quizDetail.quiz_detail_list_page.review_pick_title')}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-scroll mt-[20px] flex flex-col gap-2">
            {document?.reviewNeededQuizzes.map((quiz) => (
              <div key={quiz.id}>
                <QuestionCard key={quiz.id} className="border border-outline">
                  <QuestionCard.Header
                    right={
                      <Tag size="md" color="red">
                        {t('common.incorrect')}
                      </Tag>
                    }
                  />
                  <QuestionCard.Question>{quiz.question}</QuestionCard.Question>
                  {quiz.quizType === 'MIX_UP' ? (
                    <QuestionCard.OX answerIndex={quiz.answer === 'correct' ? 0 : 1} showAnswer={true} />
                  ) : (
                    <QuestionCard.Multiple
                      options={quiz.options}
                      answerIndex={quiz.options.indexOf(quiz.answer)}
                      showAnswer={true}
                    />
                  )}
                  <QuestionCard.Explanation hideToggle open={true}>
                    {quiz.explanation}
                  </QuestionCard.Explanation>
                </QuestionCard>
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
            <DrawerTitle>{t('quizDetail.quiz_detail_list_page.original_note_title')}</DrawerTitle>
            <DrawerDescription>
              {format(createdDate, 'yyyy.MM.dd')} {t('quizDetail.quiz_detail_list_page.registered_date')} /{' '}
              {document?.content?.length}
              {t('quizDetail.quiz_detail_list_page.characters')}
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
            <DialogTitle className="typo-subtitle-2-bold text-center">
              {t('quizDetail.quiz_detail_list_page.delete_question_confirm_title')}
            </DialogTitle>
            <DialogDescription className="typo-body-1-medium text-sub text-center mt-1">
              {t('quizDetail.quiz_detail_list_page.delete_question_confirm_message')}
            </DialogDescription>
            <div className="flex gap-2.5 mt-[20px]">
              <DialogClose asChild>
                <button className="h-[48px] flex-1 text-sub">{t('common.cancel')}</button>
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
                {t('common.delete')}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 문서 삭제 confirm 모달 */}
      <SystemDialog
        open={deleteDocumentDialogOpen}
        onOpenChange={setDeleteDocumentDialogOpen}
        title={t('quizDetail.quiz_detail_list_page.delete_quiz_confirm_title')}
        content={
          <Text typo="body-1-medium" color="sub" className="break-normal whitespace-pre-line">
            {t('quizDetail.quiz_detail_list_page.delete_quiz_confirm_message')}{' '}
            <Text as="span" typo="body-1-medium" color="incorrect">
              {t('quizDetail.quiz_detail_list_page.delete_quiz_confirm_count', { count: document?.quizzes.length })}
            </Text>
            {t('quizDetail.quiz_detail_list_page.delete_quiz_confirm_warning')}
          </Text>
        }
        variant="critical"
        confirmLabel={t('common.delete')}
        onConfirm={() => {
          deleteDocument({ documentIds: [Number(noteId)] })
          router.replace('/library')
          toast(t('quizDetail.toast.delete_quiz_success'))
        }}
      />

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  )
}

export default withHOC(NoteDetailPage, {})
