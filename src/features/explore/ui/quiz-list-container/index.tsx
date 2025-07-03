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
import { useSessionStorage } from '@/shared/lib/storage'
import { cn } from '@/shared/lib/utils'

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

  // const containerRef = useRef<HTMLDivElement>(null)
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
  const { documents, isFetching, isInitialFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetPublicDocuments({
      categoryId,
      pageSize: DATA_PER_PAGE,
    })

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
        const showShareCard = index === 2
        const showAd = index % 3 === 2
        const adIndex = Math.floor(index / 3)

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

        if (showAd) {
          acc.push(
            <div key={`ad-${adIndex + 1}`} id={`ad-${adIndex + 1}`}>
              광고
            </div>,
          )
        }

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
  const token = useStore(useAuthStore, (state) => state.token)

  const { trackEvent } = useAmplitude()

  const { id, creator, isBookmarked, isOwner, name, emoji, tryCount, bookmarkCount, quizzes } = document

  const router = useRouter()

  const { mutate: handleBookmarkMutate } = useDocumentBookmarkMutation(id)

  const [isBookmarkPending, setIsBookmarkPending] = useState(false)
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked)
  const [localBookmarkCount, setLocalBookmarkCount] = useState(bookmarkCount)
  const [bookmarkUpdate, setBookmarkUpdate] = useSessionStorage('bookmarkUpdate', null)

  useEffect(() => {
    if (
      bookmarkUpdate?.id === id &&
      bookmarkUpdate?.isUpdated &&
      bookmarkUpdate.bookmarkCount !== undefined &&
      bookmarkUpdate.isBookmarked !== undefined
    ) {
      setLocalBookmarkCount(bookmarkUpdate.bookmarkCount)
      setLocalBookmarked(bookmarkUpdate.isBookmarked)

      // 상태 초기화 (중복 반영 방지)
      setBookmarkUpdate(null)
    }
  }, [bookmarkUpdate])

  const [isLoginOpen, setIsLoginOpen] = useState(false)

  // 공유하기 핸들러
  const handleShare = async () => {
    trackEvent('explore_share_click', { location: '미리보기 페이지' })

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          url: `${window.location.origin}/explore/detail/${id}`,
        })
        console.log('공유 성공')
      } catch (error) {
        console.error('공유 실패', error)
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.')
    }
  }

  // 북마크 핸들러
  const handleBookmark = () => {
    if (!token) {
      setIsLoginOpen(true)
      return
    }

    if (isBookmarkPending) return // 중복 방지

    setIsBookmarkPending(true)

    const isCurrentlyBookmarked = document.isBookmarked

    // 미리 로컬 상태로 반영 (낙관적 UI)
    setLocalBookmarked((prev) => !prev)
    setLocalBookmarkCount((prev) => (isCurrentlyBookmarked ? prev - 1 : prev + 1))

    const rollback = () => {
      // 실패했을 때 복구
      setLocalBookmarked(isCurrentlyBookmarked)
      setLocalBookmarkCount(bookmarkCount)
    }

    const finish = () => setIsBookmarkPending(false)

    const onError = () => {
      rollback()
      finish()
    }

    const onSuccess = () => {
      trackEvent('explore_bookmark_click', {
        location: '미리보기 페이지',
        state: isCurrentlyBookmarked ? '추가' : '해제',
      })

      if (!isCurrentlyBookmarked) {
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
      finish()
    }

    handleBookmarkMutate(
      { documentId: id, isBookmarked: isCurrentlyBookmarked },
      {
        onSuccess,
        onError,
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

    router.push('/explore/detail/:noteId', { params: [String(id)] })
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
      <ExploreQuizCard>
        <ExploreQuizCard.Content>
          <ExploreQuizCard.Header emoji={emoji} title={name} creator={creator} />
          <ExploreQuizCard.Quizzes
            onClickMoveToDetailPageBtn={handleClickMoveToDetailPageBtn}
            quizzes={quizzes}
            isFetching={isFetching}
          />
        </ExploreQuizCard.Content>
        <ExploreQuizCard.Footer
          totalQuizCount={quizzes.length}
          playedCount={tryCount}
          bookmarkCount={localBookmarkCount}
          isOwner={isOwner}
          isBookmarked={localBookmarked}
          onClickShare={handleShare}
          onClickBookmark={handleBookmark}
        />
      </ExploreQuizCard>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}

// 비공개 문서가 있을 경우 노출 될 공개 권유 카드
const ShareCard = ({ notPublicCount }: { notPublicCount: number }) => {
  const router = useRouter()

  return (
    <div className={cn('w-full relative flex-center flex-col gap-[16px] bg-base-1 px-[52px] py-[20px]')}>
      <IcLibrary className="size-[56px] text-icon-accent" />

      <div className="flex-center flex-col">
        <Text typo="h4" className="text-center">
          사람들과 나의 지식을 공유해보세요
        </Text>

        <Text typo="subtitle-2-medium" color="secondary" className="">
          공개할 수 있는 퀴즈가{' '}
          <Text as={'span'} typo="body-1-medium" color="accent">
            {notPublicCount}개
          </Text>{' '}
          있어요
        </Text>
      </div>

      <Button
        onClick={() => router.push('/explore/release')}
        size={'md'}
        variant={'tertiary'}
        className="max-w-[140px] h-fit px-[31.5px] py-[15px]"
      >
        확인하기
      </Button>
    </div>
  )
}

export default QuizListContainer
