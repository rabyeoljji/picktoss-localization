import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { toast } from 'sonner'
import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'
import NotFound from '@/app/not-found'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'

import {
  useDeleteDocument,
  useDocumentBookmarkMutation,
  useGetDocument,
  useUpdateDocumentIsPublic,
} from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import {
  IcBookmark,
  IcBookmarkFilled,
  IcCheck,
  IcChevronDown,
  IcDelete,
  IcEdit,
  IcKebab,
  IcList,
  IcPlayFilled,
  IcUpload,
  IcWarning,
} from '@/shared/assets/icon'
import { BackButton } from '@/shared/components/buttons/back-button'
import { Header } from '@/shared/components/header'
import { SystemDialog } from '@/shared/components/system-dialog'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogCTA,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useRouter } from '@/shared/lib/router'
import { StorageKey, useLocalStorage, useSessionStorage } from '@/shared/lib/storage'
import { useTranslation } from '@/shared/locales/use-translation'

const QuizDetailPage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()

  const [_, setRedirectUrl] = useLocalStorage(StorageKey.redirectUrl, '')
  const { t } = useTranslation()

  const { noteId } = useParams()

  const { data: document, isLoading: isDocumentLoading, refetch: refetchDocument } = useGetDocument(Number(noteId))

  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false)
  const { mutate: deleteDocument } = useDeleteDocument()

  const [selectedQuizCount, setSelectedQuizCount] = useState(20)

  // 문제 수 기본값 설정 - 기본값은 20문제, 전체 문제가 20보다 적으면 최대값
  useEffect(() => {
    if (!document) return

    const totalQuizCount = document.quizzes.length
    const defaultCount = totalQuizCount < 20 ? totalQuizCount : 20
    setSelectedQuizCount(defaultCount)
  }, [document])

  const { mutate: createQuizSet, isPending: isCreatingQuizSet } = useCreateQuizSet(Number(noteId))

  const token = useStore(useAuthStore, (state) => state.token)

  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false)

  // 북마크 정보 업데이트를 위한 세션 스토리지 설정
  const [, setStorageBookmark] = useSessionStorage('bookmarkUpdate', null)
  useEffect(() => {
    setStorageBookmark({ id: Number(noteId) })
  }, [noteId])

  const { mutate: bookmark } = useDocumentBookmarkMutation(Number(noteId))

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)

  useEffect(() => {
    if (!document) return
    setIsBookmarked(document.isBookmarked)
    setBookmarkCount(document.bookmarkCount)
  }, [document])

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleBookmark = () => {
    if (!document) return

    if (!token) {
      setIsLoginOpen(true)
      return
    }

    if (!document || isBookmarkProcessing) return

    setIsBookmarkProcessing(true)

    const optimisticIsBookmarked = !document.isBookmarked
    const optimisticBookmarkCount = document.bookmarkCount + (optimisticIsBookmarked ? 1 : -1)

    // 즉시 UI 업데이트
    setIsBookmarked(optimisticIsBookmarked)
    setBookmarkCount(optimisticBookmarkCount)

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

          // 뒤로가기 시 탐험 카드에서의 북마크 업데이트를 위한 상태 스토리지 저장
          setStorageBookmark({
            id: document.id,
            isBookmarked: optimisticIsBookmarked,
            bookmarkCount: optimisticBookmarkCount,
            isUpdated: true,
          })

          if (optimisticIsBookmarked) {
            toast(t('quizDetail.quiz_detail_page.bookmark_success_message'), {
              icon: <IcBookmarkFilled className="size-4" />,
              action: {
                label: t('quizDetail.quiz_detail_page.view_button'),
                onClick: () => router.push(`/library`, { search: { tab: 'BOOKMARK' } }),
              },
            })
          } else {
            toast(t('quizDetail.quiz_detail_page.bookmark_removed_message'))
          }
        },
        onError: () => {
          // 실패시 ui 롤백
          setIsBookmarked(document.isBookmarked)
          setBookmarkCount(document.bookmarkCount)
        },
        onSettled: () => {
          setIsBookmarkProcessing(false)
        },
      },
    )
  }

  const { mutate: updateDocumentIsPublic, isPending: isUpdatingDocumentIsPublic } = useUpdateDocumentIsPublic(
    Number(noteId),
  )

  const handleShare = async () => {
    trackEvent('explore_share_click', { location: '상세 페이지' })

    if (document && navigator.share) {
      try {
        await navigator.share({
          title: document.name,
          url: `${window.location.origin}/quiz-detail/${noteId}`,
        })
        console.log('공유 성공')
      } catch (error) {
        console.error('공유 실패', error)
      }
    } else {
      alert(t('quizDetail.quiz_detail_page.share_not_supported_message'))
    }
  }

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const handleComplain = () => {
    if (!token) {
      setIsLoginOpen(true)
      return
    }

    router.push('/explore/complain/:noteId', {
      params: [String(noteId)],
      search: { name: document?.name },
    })
  }

  if (isDocumentLoading) return <Loading center />

  if (!isDocumentLoading && !document?.isPublic && !document?.isOwner) {
    return <NotFound />
  }

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton type="close" />}
        content={
          <div className="w-fit ml-auto">
            {document?.isOwner ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2" asChild>
                  <button>
                    <IcKebab className="size-6" />
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
                      {t('quizDetail.quiz_detail_page.edit_quiz_info_button')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-red-500"
                    right={<IcDelete className="text-icon-critical size-[20px]" />}
                    onClick={() => {
                      trackEvent('library_detail_delete_click')
                      setDeleteDocumentDialogOpen(true)
                    }}
                  >
                    {t('quizDetail.quiz_detail_page.delete_quiz_button')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2" asChild>
                  <button>
                    <IcKebab className="size-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="-translate-y-2">
                  <DropdownMenuItem
                    className="text-red-500"
                    right={<IcWarning className="text-icon-critical size-[20px]" />}
                    onClick={handleComplain}
                  >
                    {t('quizDetail.quiz_detail_page.report_quiz_button')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        }
      />

      {/* 2. 스크롤 가능한 메인 영역 (헤더 높이만큼 패딩 처리) */}
      <HeaderOffsetLayout className="flex-1 overflow-auto pt-[54px]">
        <div className="mt-[21px] mb-[48px] flex-center">
          <div className="flex flex-col justify-start items-center gap-10">
            <div className="flex flex-col justify-start items-center gap-4">
              <div className="size-[88px] flex-center bg-base-1 rounded-full border border-outline">
                <span className="text-[56px]">{document?.emoji}</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-2">
                <Text typo="body-2-medium" color="sub">
                  {document?.creator}
                </Text>
                <Text typo="h3" color="primary">
                  {document?.name}
                </Text>
                <div className="self-stretch inline-flex justify-center items-center gap-28">
                  <div className="flex justify-start items-center gap-1">
                    <Text typo="body-1-medium" color="sub">
                      {document?.category}
                    </Text>
                    <div className="size-[4px] bg-gray-100 rounded-full" />
                    <div className="flex justify-start items-center gap-0.5">
                      <IcPlayFilled className="size-[12px] text-icon-sub" />
                      <Text typo="body-1-medium" color="sub">
                        {document?.tryCount}
                      </Text>
                    </div>
                    <div className="size-[4px] bg-gray-100 rounded-full" />
                    <div className="flex justify-start items-center gap-0.5">
                      <IcBookmarkFilled className="size-[12px] text-icon-sub" />
                      <Text typo="body-1-medium" color="sub">
                        {bookmarkCount}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-center px-[20px]">
          <div className="px-[43px] py-5 bg-base-2 rounded-xl w-full inline-flex flex-col justify-center items-center gap-3">
            <div className="flex flex-col justify-start items-center gap-3">
              <div className="w-56 flex flex-col justify-start items-center gap-3">
                <Text typo="body-1-bold" color="secondary">
                  {t('quizDetail.quiz_detail_page.questions_to_solve')}
                </Text>
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="h-[48px] w-[231px] px-4 py-[15px] bg-base-1 rounded-lg border border-outline">
                      <div className="flex-1 flex justify-between items-center">
                        <Text typo="button-2" className="text-gray-800">
                          {t('quizDetail.quiz_detail_page.question_count', { count: selectedQuizCount })}
                        </Text>
                        <IcChevronDown className="size-[16px] text-icon-secondary" />
                      </div>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="px-[20px]!">
                    <DrawerTitle>{t('quizDetail.quiz_detail_page.select_question_count_title')}</DrawerTitle>
                    <div className="mt-[22px]">
                      <div className="flex flex-col">
                        {[5, 10, 20, 30, 50, 100].map((count) => {
                          const totalQuizCount = document?.quizzes?.length || 0
                          const isAvailable = count <= totalQuizCount

                          if (count === totalQuizCount) return null
                          if (!isAvailable) return null

                          return (
                            <DrawerClose asChild>
                              <button
                                key={count}
                                onClick={() => {
                                  setSelectedQuizCount(count)
                                }}
                                className="py-[10px] flex items-center justify-between"
                              >
                                <Text
                                  typo="subtitle-2-medium"
                                  color={selectedQuizCount === count ? 'accent' : 'primary'}
                                >
                                  {t('quizDetail.quiz_detail_page.question_count', { count: count })}
                                </Text>
                                {selectedQuizCount === count && <IcCheck className="size-[24px] text-icon-accent" />}
                              </button>
                            </DrawerClose>
                          )
                        })}

                        {/* 최대 옵션 */}
                        <DrawerClose asChild>
                          <button
                            onClick={() => {
                              setSelectedQuizCount(document?.quizzes?.length || 0)
                            }}
                            className="py-[10px] flex items-center justify-between"
                          >
                            <Text
                              typo="subtitle-2-medium"
                              color={selectedQuizCount === (document?.quizzes?.length || 0) ? 'accent' : 'primary'}
                            >
                              {t('quizDetail.quiz_detail_page.maximum')}
                            </Text>
                            {selectedQuizCount === (document?.quizzes?.length || 0) && (
                              <IcCheck className="size-[24px] text-icon-accent" />
                            )}
                          </button>
                        </DrawerClose>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
              {document?.quizzes.length === selectedQuizCount ? (
                <Text typo="body-1-medium" color="sub">
                  {t('quizDetail.quiz_detail_page.all_questions_will_be_asked')}
                </Text>
              ) : (
                <Text typo="body-1-medium" color="sub">
                  {t('quizDetail.quiz_detail_page.total_questions')} {document?.quizzes.length}
                  {t('quizDetail.quiz_detail_page.selected_questions')} {selectedQuizCount}
                  {t('quizDetail.quiz_detail_page.random_questions_will_be_asked')}
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 mt-5 flex-center">
          <Button
            size="lg"
            left={<IcPlayFilled className="size-[20px]" />}
            className="max-w-[400px]"
            disabled={isCreatingQuizSet}
            onClick={() => {
              if (!token) {
                setIsLoginOpen(true)
                return
              }
              createQuizSet(
                {
                  quizCount: selectedQuizCount,
                  quizType: 'ALL',
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
            }}
          >
            {t('quizDetail.quiz_detail_page.start_quiz_button')}
          </Button>
        </div>

        <div className="mt-[40px] mx-auto w-fit flex items-center justify-between">
          <button
            className="flex flex-col items-center gap-2 px-5"
            onClick={() => {
              router.push('/quiz-detail/:noteId/list', {
                params: [String(noteId)],
              })
            }}
          >
            <IcList className="size-6" />
            <Text typo="body-2-bold" color="sub">
              {t('quizDetail.quiz_detail_page.view_questions_button')}
            </Text>
          </button>
          <div className="w-px h-[48px] bg-gray-100" />
          {!document?.isPublic ? (
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger
                asChild
                onClick={() => {
                  trackEvent('library_share_click')
                }}
              >
                <button className="flex flex-col items-center gap-2 px-5">
                  <IcUpload className="size-6" />
                  <Text typo="body-2-bold" color="sub">
                    {t('quizDetail.quiz_detail_page.share_button')}
                  </Text>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="typo-h4">{t('quizDetail.quiz_detail_page.public_confirm_title')}</DialogHeader>
                <DialogDescription className="text-center mt-2 text-sub">
                  {t('quizDetail.quiz_detail_page.public_confirm_message')}
                  <br />
                  {t('quizDetail.quiz_detail_page.public_confirm_action')}
                </DialogDescription>
                <DialogCTA
                  label={t('quizDetail.quiz_detail_page.make_public_button')}
                  onClick={() =>
                    updateDocumentIsPublic(
                      { isPublic: true },
                      {
                        onSuccess: async () => {
                          toast(t('quizDetail.quiz_detail_page.public_success_message'))
                          await refetchDocument()
                          setIsShareDialogOpen(false)
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
          ) : (
            <button className="flex flex-col items-center gap-2 px-5" onClick={() => handleShare()}>
              <IcUpload className="size-6" />
              <Text typo="body-2-bold" color="sub">
                {t('quizDetail.quiz_detail_page.share_button')}
              </Text>
            </button>
          )}
          {!document?.isOwner && (
            <>
              <div className="w-px h-[48px] bg-gray-100" />
              <button className="flex flex-col items-center gap-2 px-5" onClick={handleBookmark}>
                {isBookmarked ? <IcBookmarkFilled className="size-6" /> : <IcBookmark className="size-6" />}
                <Text typo="body-2-bold" color="sub">
                  {t('quizDetail.quiz_detail_page.save_button')}
                </Text>
              </button>
            </>
          )}
        </div>
      </HeaderOffsetLayout>

      {/* 문서 삭제 confirm 모달 */}
      <SystemDialog
        open={deleteDocumentDialogOpen}
        onOpenChange={setDeleteDocumentDialogOpen}
        title={t('quizDetail.quiz_detail_page.delete_confirm_title')}
        content={
          <Text typo="body-1-medium" color="sub">
            {t('quizDetail.quiz_detail_page.delete_confirm_message')}{' '}
            <Text as="span" typo="body-1-medium" color="incorrect">
              {t('quizDetail.quiz_detail_page.delete_confirm_count', { count: document?.quizzes.length })}
            </Text>
            {t('quizDetail.quiz_detail_page.delete_confirm_warning')}
          </Text>
        }
        variant="critical"
        confirmLabel={t('common.delete')}
        onConfirm={() => {
          deleteDocument({ documentIds: [Number(noteId)] })
          router.replace('/library')
          toast(t('quizDetail.quiz_detail_page.delete_success_message'))
        }}
      />

      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onClickLogin={() => {
          if (!token) {
            setRedirectUrl(window.location.pathname + window.location.search)
          }
          router.push('/login')
        }}
      />
    </div>
  )
}

export default withHOC(QuizDetailPage, {})
