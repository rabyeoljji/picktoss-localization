import { useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'
import SwiperCore from 'swiper'
import { Mousewheel, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { GetPublicDocumentsDto } from '@/entities/document/api'
import {
  useCreateDocumentBookmark,
  useDeleteDocumentBookmark,
  useGetPublicDocuments,
} from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import { IcBookmarkFilled } from '@/shared/assets/icon'
import { ExploreQuizCard } from '@/shared/components/cards/explore-quiz-card'
import { useQueryParam, useRouter } from '@/shared/lib/router'

const QuizVerticalSwipe = () => {
  const DATA_PER_PAGE = 10

  const [categoryId] = useQueryParam('/explore', 'category')

  const [fetchParams, setFetchParams] = useState({ categoryId, page: 0 })
  const [documents, setDocuments] = useState<GetPublicDocumentsDto[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const lastRequestedPageRef = useRef<number>(-1)

  const [activeIndex, setActiveIndex] = useState(0)

  const [safeAreaInsetTop, setSafeAreaInsetTop] = useState(0)
  const [isTopReached, setIsTopReached] = useState(false)

  const swiperRef = useRef<SwiperCore>(null)
  const swiperContainerRef = useRef<HTMLDivElement>(null)

  const shouldFetch = categoryId !== undefined && fetchParams.page >= 0
  const { data: publicData, isFetched } = useGetPublicDocuments({
    ...fetchParams,
    pageSize: DATA_PER_PAGE,
    enabled: shouldFetch,
  })

  // 카테고리 변경 시 데이터 초기화
  useEffect(() => {
    setFetchParams({ categoryId, page: 0 })
    setDocuments([])
    setHasMore(true)
    setIsFetching(true)
    lastRequestedPageRef.current = -1
  }, [categoryId])

  // 초기 로딩 또는 page 변경 시 데이터 추가
  useEffect(() => {
    if (!isFetched) return

    if (publicData?.documents?.length) {
      setDocuments((prev) => [...prev, ...publicData.documents.filter((doc) => !prev.find((d) => d.id === doc.id))])

      if (publicData.documents.length < DATA_PER_PAGE) {
        setHasMore(false)
      }
    }

    setIsFetching(false)
  }, [publicData, isFetched])

  // activeIndex가 마지막에서 2번째 카드에 도달했을 때 다음 페이지 가져오기
  useEffect(() => {
    const nextPage = fetchParams.page + 1

    const shouldFetchNext =
      documents.length > 0 &&
      activeIndex === documents.length - 2 &&
      !isFetching &&
      documents.length < (publicData?.totalDocuments ?? Infinity) && // 서버 데이터를 이용한 마지막 페이지 감지
      hasMore && // 프론트 측 마지막 페이지 감지 도구
      lastRequestedPageRef.current < nextPage // 중복된 페이지 요청 방지

    if (shouldFetchNext) {
      setIsFetching(true)
      lastRequestedPageRef.current = nextPage
      setFetchParams((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }, [activeIndex, documents.length, isFetching, publicData])

  // root요소 스크롤 제어 + HOC에서 safe-area-inset-top을 계산하기 위해서 사용
  useEffect(() => {
    const root = document.getElementById('root')
    const hocElement = document.getElementById('hoc')
    if (!root || !hocElement) return

    root.classList.add('overscroll-none')

    const computedStyle = window.getComputedStyle(hocElement)
    const paddingTopValue = computedStyle.getPropertyValue('padding-top')

    const safeAreaInsetTop = parseFloat(paddingTopValue) || 0
    setSafeAreaInsetTop(safeAreaInsetTop)

    return () => {
      root.classList.remove('overscroll-none')
    }
  }, [])

  // 퀴즈 카드 스와이프 영역 스크롤 제어
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (!swiperContainerRef.current || !swiperRef.current) return

      const topOffset = swiperContainerRef.current.getBoundingClientRect().top

      setIsTopReached(topOffset <= 110 + safeAreaInsetTop)
    }

    const root = document.getElementById('root')

    if (!root) return

    handleScrollOrResize()
    root.addEventListener('scroll', handleScrollOrResize)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      root.removeEventListener('scroll', handleScrollOrResize)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [safeAreaInsetTop])

  return (
    <div
      ref={swiperContainerRef}
      style={{
        height: 'calc(100vh - env(safe-area-inset-top) - 184px)',
        touchAction: 'pan-y',
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      className="relative w-full p-[16px] pt-[48px] flex flex-col items-center gap-[10px] overflow-hidden bg-base-2"
    >
      {!isTopReached && (
        <div className="absolute inset-0 z-30" style={{ background: 'transparent', pointerEvents: 'all' }} />
      )}

      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0.01}
        mousewheel={{ forceToAxis: true, enabled: true }}
        allowTouchMove={true}
        cssMode={false}
        simulateTouch={true}
        touchStartPreventDefault={false}
        modules={[Mousewheel, Virtual]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          if (swiper.activeIndex !== activeIndex) {
            setActiveIndex(swiper.activeIndex)
          }
        }}
        style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {documents.map((document, index) => (
          <SwiperSlide key={document.id} virtualIndex={index}>
            <ExploreSwipeCard index={index} activeIndex={activeIndex} document={document} setDocuments={setDocuments} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const ExploreSwipeCard = ({
  index,
  activeIndex,
  document,
  setDocuments,
}: {
  index: number
  activeIndex: number
  document: GetPublicDocumentsDto
  setDocuments: React.Dispatch<React.SetStateAction<GetPublicDocumentsDto[]>>
}) => {
  const {
    id,
    creator,
    isBookmarked,
    isOwner,
    name,
    emoji,
    category,
    tryCount,
    bookmarkCount,
    quizzes,
    totalQuizCount,
  } = document

  const router = useRouter()

  const { mutate: documentBookmark } = useCreateDocumentBookmark(id)
  const { mutate: deleteDocumentBookmark } = useDeleteDocumentBookmark(id)
  const { mutate: createQuizSet, isPending: isCreatingQuizSet } = useCreateQuizSet(id)

  const handleBookmark = () => {
    // 낙관적 UI 업데이트
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === document.id ? { ...doc, isBookmarked: !doc.isBookmarked } : doc)),
    )

    const isCurrentlyBookmarked = document.isBookmarked

    const onError = () => {
      // 실패 시 롤백
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === document.id ? { ...doc, isBookmarked: isCurrentlyBookmarked } : doc)),
      )
      toast.error('북마크에 실패했어요')
    }

    const onSuccess = () => {
      if (!isCurrentlyBookmarked) {
        toast('퀴즈가 도서관에 저장되었어요', {
          icon: <IcBookmarkFilled className="size-4" />,
          action: {
            label: '보러가기',
            onClick: () => router.push(`/library`, { search: { tab: 'BOOKMARK' } }),
          },
        })
      }
    }

    if (isCurrentlyBookmarked) {
      deleteDocumentBookmark(undefined, { onSuccess, onError })
    } else {
      documentBookmark(undefined, { onSuccess, onError })
    }
  }

  const handleQuizStart = () => {
    createQuizSet(
      {
        quizCount: totalQuizCount,
      },
      {
        onSuccess: (data) => {
          router.push('/progress-quiz/:quizSetId', {
            params: [String(data.quizSetId)],
            search: {
              documentId: id,
            },
          })
        },
      },
    )
  }

  return (
    <ExploreQuizCard
      index={index}
      activeIndex={activeIndex}
      header={
        <ExploreQuizCard.Header
          creator={creator}
          isOwner={isOwner}
          isBookmarked={isBookmarked}
          onClickShare={() => {
            alert('공유하기 클릭')
          }}
          onClickBookmark={handleBookmark}
        />
      }
      content={
        <ExploreQuizCard.Content
          emoji={emoji}
          title={name}
          category={category}
          playedCount={tryCount}
          bookmarkCount={bookmarkCount}
        />
      }
      quizzes={
        <ExploreQuizCard.Quizzes
          quizzes={quizzes}
          totalQuizCount={quizzes.length}
          onClickViewAllBtn={() => router.push('/explore/detail/:noteId', { params: [String(id)] })}
        />
      }
      footer={<ExploreQuizCard.Footer onClickStartQuiz={handleQuizStart} isLoading={isCreatingQuizSet} />}
    />
  )
}

export default QuizVerticalSwipe
