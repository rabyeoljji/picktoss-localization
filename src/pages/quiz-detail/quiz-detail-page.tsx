import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { toast } from 'sonner'
import { useStore } from 'zustand'

import { withHOC } from '@/app/hoc/with-page-config'
import HeaderOffsetLayout from '@/app/layout/header-offset-layout'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'

import {
  useDeleteDocument,
  useDocumentBookmarkMutation,
  useGetPublicSingleDocument,
  useGetSingleDocument,
  useUpdateDocumentIsPublic,
} from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import {
  IcBookmark,
  IcBookmarkFilled,
  IcCheck,
  IcChevronDown,
  IcDelete,
  IcKebab,
  IcList,
  IcNote,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { useRouter } from '@/shared/lib/router'
import { useSessionStorage } from '@/shared/lib/storage'

const QuizDetailPage = () => {
  const { trackEvent } = useAmplitude()
  const router = useRouter()

  const { noteId } = useParams()
  const {
    data: document,
    isLoading: isDocumentLoading,
    refetch: refetchDocument,
  } = useGetSingleDocument(Number(noteId))
  const { data: publicDocument, isLoading: isPublicDocumentLoading } = useGetPublicSingleDocument(Number(noteId))

  const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false)
  const { mutate: deleteDocument } = useDeleteDocument()
  const [contentDrawerOpen, setContentDrawerOpen] = useState(false)

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

  const [isBookmarked, setIsBookmarked] = useState(publicDocument?.isBookmarked)
  const [bookmarkCount, setBookmarkCount] = useState(document?.bookmarkCount)

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleBookmark = () => {
    if (!publicDocument) return

    if (!token) {
      setIsLoginOpen(true)
      return
    }

    if (!document || isBookmarkProcessing) return

    setIsBookmarkProcessing(true)

    const optimisticIsBookmarked = !publicDocument.isBookmarked
    const optimisticBookmarkCount = publicDocument.bookmarkCount + (optimisticIsBookmarked ? 1 : -1)

    // 즉시 UI 업데이트
    setIsBookmarked(optimisticIsBookmarked)
    setBookmarkCount(optimisticBookmarkCount)

    bookmark(
      {
        documentId: Number(noteId),
        isBookmarked: publicDocument.isBookmarked || false,
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
            toast('퀴즈가 도서관에 저장되었어요', {
              icon: <IcBookmarkFilled className="size-4" />,
              action: {
                label: '보러가기',
                onClick: () => router.push(`/library`, { search: { tab: 'BOOKMARK' } }),
              },
            })
          } else {
            toast('북마크가 해제되었어요')
          }
        },
        onError: () => {
          // 실패시 ui 롤백
          setIsBookmarked(publicDocument.isBookmarked)
          setBookmarkCount(publicDocument.bookmarkCount)
        },
        onSettled: () => setIsBookmarkProcessing(false),
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
          url: `${window.location.origin}/explore/detail/${noteId}`,
        })
        console.log('공유 성공')
      } catch (error) {
        console.error('공유 실패', error)
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.')
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

  if (isDocumentLoading || isPublicDocumentLoading) return null

  return (
    <div className="relative flex flex-col h-screen bg-base-1">
      <Header
        left={<BackButton type="close" />}
        content={
          <div className="w-fit ml-auto">
            {publicDocument?.isOwner ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2" asChild>
                  <button>
                    <IcKebab className="size-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="-translate-y-2">
                  {/* TODO: 퀴즈 정보 수정 */}
                  {/* <DropdownMenuItem right={<IcEdit className="size-[20px]" />} onClick={() => {}}></DropdownMenuItem> */}
                  <DropdownMenuItem
                    right={<IcNote className="size-[20px]" />}
                    onClick={() => {
                      setContentDrawerOpen(true)
                      trackEvent('library_detail_note_click')
                    }}
                  >
                    원본 문서
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    right={<IcDelete className="text-icon-critical size-[20px]" />}
                    onClick={() => {
                      trackEvent('library_detail_delete_click')
                      setDeleteDocumentDialogOpen(true)
                    }}
                  >
                    퀴즈 삭제
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
                    퀴즈 신고
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
                  @picktosschang
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
                        {publicDocument?.tryCount}
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
                  풀 문제 수
                </Text>
                <Drawer>
                  <DrawerTrigger asChild>
                    <button className="h-[48px] w-[231px] px-4 py-[15px] bg-base-1 rounded-lg border border-outline">
                      <div className="flex-1 flex justify-between items-center">
                        <Text typo="button-2" className="text-gray-800">
                          {selectedQuizCount}문제
                        </Text>
                        <IcChevronDown className="size-[16px] text-icon-secondary" />
                      </div>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="px-[20px]!">
                    <DrawerTitle>문제 수 선택</DrawerTitle>
                    <div className="mt-[22px]">
                      <div className="flex flex-col">
                        {[5, 10, 20, 30, 50, 100].map((count) => {
                          const totalQuizCount = document?.quizzes?.length || 0
                          const isAvailable = count <= totalQuizCount

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
                                  {count}문제
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
                              최대
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
                  모든 문제가 출제돼요
                </Text>
              ) : (
                <Text typo="body-1-medium" color="sub">
                  총 {document?.quizzes.length}문제 중 {selectedQuizCount}문제가 무작위로 출제돼요
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 mt-5">
          <Button
            size="lg"
            left={<IcPlayFilled className="size-[20px]" />}
            disabled={isCreatingQuizSet}
            onClick={() => {
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
            퀴즈 시작
          </Button>
        </div>

        <div className="mt-[40px] mx-auto w-fit flex items-center justify-between">
          <button
            className="flex flex-col items-center gap-2 w-[96px]"
            onClick={() => {
              router.push('/account')
            }}
          >
            <IcList className="size-6" />
            <Text typo="body-2-bold" color="sub">
              문제보기
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
                <button className="flex flex-col items-center gap-2 w-[96px]">
                  <IcUpload className="size-6" />
                  <Text typo="body-2-bold" color="sub">
                    공유하기
                  </Text>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="typo-h4">퀴즈를 공개하시겠어요?</DialogHeader>
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
                        onSuccess: async () => {
                          toast('퀴즈가 공개되었어요')
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
            <button className="flex flex-col items-center gap-2 w-[96px]" onClick={() => handleShare()}>
              <IcUpload className="size-6" />
              <Text typo="body-2-bold" color="sub">
                공유하기
              </Text>
            </button>
          )}
          {!publicDocument?.isOwner && (
            <>
              <div className="w-px h-[48px] bg-gray-100" />
              <button className="flex flex-col items-center gap-2 w-[96px]" onClick={handleBookmark}>
                {isBookmarked ? <IcBookmarkFilled className="size-6" /> : <IcBookmark className="size-6" />}
                <Text typo="body-2-bold" color="sub">
                  저장하기
                </Text>
              </button>
            </>
          )}
        </div>
      </HeaderOffsetLayout>

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

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  )
}

export default withHOC(QuizDetailPage, {})
