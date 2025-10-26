import { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useInView } from 'react-intersection-observer'

import { toast } from 'sonner'
import { useStore } from 'zustand'

import { useAuthStore } from '@/features/auth'
import LoginDialog from '@/features/explore/ui/login-dialog'

import { GetPublicDocumentsDto } from '@/entities/document/api'
import {
  useDocumentBookmarkMutation,
  useGetIsNotPublicDocuments,
  useGetPublicDocuments,
} from '@/entities/document/api/hooks'

import { IcBookmarkFilled, IcLibrary } from '@/shared/assets/icon'
import { ExploreQuizCard } from '@/shared/components/cards/explore-quiz-card'
import { Button } from '@/shared/components/ui/button'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
import { usePWA } from '@/shared/hooks/use-pwa'
import { useQueryParam, useRouter } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

type ShareCard = {
  id: 'SHARE'
  name: string
  emoji: string
  previewContent: string
  category: string
  creator: null
  isBookmarked: false
  isOwner: false
  tryCount: 0
  bookmarkCount: 0
  quizzes: []
  totalQuizCount: 0
}

const QuizListContainer = ({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) => {
  const { isPWA } = usePWA()
  const token = useStore(useAuthStore, (state) => state.token)

  const DATA_PER_PAGE = 20

  const [categoryId] = useQueryParam('/explore', 'category')

  const prevCategoryId = useRef(categoryId)
  useEffect(() => {
    if (prevCategoryId.current !== categoryId) {
      // 카테고리 변경 감지 → 스크롤 최상단
      scrollRef.current?.scrollTo(0, 0)
      prevCategoryId.current = categoryId
    }
  }, [categoryId])

  // 데이터 페칭 관련
  const { documents, isFetching, isInitialFetching, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useGetPublicDocuments({
      categoryId,
      pageSize: DATA_PER_PAGE,
    })

  useEffect(() => {
    if (token) {
      refetch()
    }
  }, [token])

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  // 비공개 문서 개수 가져오기
  const { data: notPublicDocumentsData } = useGetIsNotPublicDocuments({ enabled: !!token })
  const notPublicCount = notPublicDocumentsData?.documents.length ?? 0

  if (isInitialFetching) {
    return (
      <div
        style={{ height: 'calc(100vh - env(safe-area-inset-top) - 184px)' }}
        className="relative w-full p-[16px] pt-[28px] flex-center overflow-hidden bg-base-2"
      >
        <Loading />
      </div>
    )
  }

  const accessMobileWeb = !isPWA && isMobile

  return (
    <div
      style={{
        height: `calc(100vh - var(--safe-area-inset-top)${accessMobileWeb ? '' : ' - 186px'})`,
        overscrollBehaviorY: 'none',
      }}
      className="relative w-full pt-[8px] flex flex-col items-center bg-base-2"
    >
      {documents.reduce<React.ReactNode[]>((acc, document, index) => {
        const isTarget = index === documents.length - 5
        const showShareCard = index === 2 && notPublicCount > 0
        // const showAd = index % 3 === 2
        // const adIndex = Math.floor(index / 3)

        acc.push(
          <div
            key={document.id}
            ref={(_ref) => {
              if (isTarget) {
                ref(_ref)
              }
            }}
            className="w-full"
          >
            <ExploreCard scrollRef={scrollRef} document={document} isFetching={isFetching} />
          </div>,
        )

        if (showShareCard) {
          acc.push(<ShareCard key="share-card" notPublicCount={notPublicCount} />)
        }

        // if (showAd) {
        //   acc.push(<div />)
        // }

        return acc
      }, [])}
    </div>
  )
}

// 공개 문서 카드
const ExploreCard = ({
  scrollRef,
  document,
  isFetching,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>
  document: GetPublicDocumentsDto
  isFetching: boolean
}) => {
  const { t } = useTranslation()

  const token = useStore(useAuthStore, (state) => state.token)

  const { trackEvent } = useAmplitude()

  const { id, isBookmarked, isOwner, name, emoji, tryCount, bookmarkCount, quizzes } = document

  const router = useRouter()

  const { mutate: handleBookmarkMutate, isPending: isBookmarkPending } = useDocumentBookmarkMutation(id)

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  // 공유하기 핸들러
  // const handleShare = async () => {
  //   trackEvent('explore_share_click', { location: '미리보기 페이지' })

  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: name,
  //         url: `${window.location.origin}/quiz-detail/${id}`,
  //       })
  //       console.log('공유 성공')
  //     } catch (error) {
  //       console.error('공유 실패', error)
  //     }
  //   } else {
  //     alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.')
  //   }
  // }

  // 북마크 핸들러
  const handleBookmark = () => {
    if (!token) {
      setIsLoginOpen(true)
      return
    }

    if (isBookmarkPending) return // 중복 방지

    const isCurrentlyBookmarked = document.isBookmarked

    handleBookmarkMutate(
      { documentId: id, isBookmarked },
      {
        onSuccess: () => {
          trackEvent('explore_bookmark_click', {
            location: '미리보기 페이지',
            state: isCurrentlyBookmarked ? '추가' : '해제',
          })

          if (!isCurrentlyBookmarked) {
            toast(t('explore.toast.bookmark_success'), {
              icon: <IcBookmarkFilled className="size-4" />,
              action: {
                label: t('explore.quiz_list_container.view_button'),
                onClick: () => router.push(`/library`, { search: { tab: 'BOOKMARK' } }),
              },
            })
          } else {
            toast(t('explore.toast.bookmark_removed'))
          }
        },
      },
    )
  }

  // 상세 페이지로 이동 버튼 클릭 핸들러
  const handleClickMoveToDetailPageBtn = () => {
    trackEvent('explore_detail_click')

    const container = scrollRef.current
    if (container) {
      sessionStorage.setItem('scrollY', String(container.scrollTop))
    }

    if (document.isOwner) {
      router.push('/quiz-detail/:noteId', { params: [String(id)] })
    } else {
      router.push('/quiz-detail/:noteId', { params: [String(id)] })
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    const savedScrollY = sessionStorage.getItem('scrollY')
    if (container && savedScrollY) {
      container.scrollTo(0, parseInt(savedScrollY))
    }
    sessionStorage.removeItem('scrollY')
  }, [])

  return (
    <>
      <ExploreQuizCard onClick={handleClickMoveToDetailPageBtn}>
        <ExploreQuizCard.Content>
          <ExploreQuizCard.Header
            emoji={emoji}
            title={name}
            totalQuizCount={quizzes.length}
            playedCount={tryCount}
            bookmarkCount={bookmarkCount}
            isOwner={isOwner}
            isBookmarked={isBookmarked}
            onClickBookmark={handleBookmark}
          />
          <ExploreQuizCard.Quizzes
            onClickMoveToDetailPageBtn={handleClickMoveToDetailPageBtn}
            quizzes={quizzes}
            isFetching={isFetching}
          />
        </ExploreQuizCard.Content>
      </ExploreQuizCard>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}

// 비공개 문서가 있을 경우 노출 될 공개 권유 카드
const ShareCard = ({ notPublicCount }: { notPublicCount: number }) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'w-full relative flex-center flex-col gap-[16px] bg-base-1 border-b border-divider px-[52px] py-[20px]',
      )}
    >
      <IcLibrary className="size-[56px] text-icon-accent" />

      <div className="flex-center flex-col">
        <Text typo="h4" className="text-center">
          {t('explore.quiz_list_container.share_knowledge_message')}
        </Text>

        <Text typo="subtitle-2-medium" color="secondary" className="">
          {t('explore.quiz_list_container.available_quizzes_message')}{' '}
          <Text as={'span'} typo="body-1-medium" color="accent">
            {t('explore.quiz_list_container.available_quizzes_count', { count: notPublicCount })}
          </Text>{' '}
          {t('explore.quiz_list_container.exists_message')}
        </Text>
      </div>

      <Button
        onClick={() => router.push('/explore/release')}
        size={'md'}
        variant={'tertiary'}
        className="max-w-[140px] h-fit px-[31.5px] py-[15px]"
      >
        {t('explore.quiz_list_container.check_button')}
      </Button>
    </div>
  )
}

export default QuizListContainer
