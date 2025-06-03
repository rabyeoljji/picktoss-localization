import { useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'
import SwiperCore from 'swiper'
import { Mousewheel, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { GetPublicDocumentsDto } from '@/entities/document/api'
import {
  useCreateDocumentBookmark,
  useDeleteDocumentBookmark,
  useGetIsNotPublicDocuments,
  useGetPublicDocuments,
} from '@/entities/document/api/hooks'
import { useCreateQuizSet } from '@/entities/quiz/api/hooks'

import { IcBookmarkFilled, IcLibrary } from '@/shared/assets/icon'
import { ExploreQuizCard } from '@/shared/components/cards/explore-quiz-card'
import { Button } from '@/shared/components/ui/button'
import Loading from '@/shared/components/ui/loading'
import { Text } from '@/shared/components/ui/text'
import { useAmplitude } from '@/shared/hooks/use-amplitude-context'
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

type PublicDocumentsDto = GetPublicDocumentsDto | ShareCard

const QuizVerticalSwipe = () => {
  const DATA_PER_PAGE = 10

  const [categoryId] = useQueryParam('/explore', 'category')

  // 스와이프 관련
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperCore>(null)
  const swiperContainerRef = useRef<HTMLDivElement>(null)

  // 데이터 페칭 관련
  const [fetchParams, setFetchParams] = useState({ categoryId, page: 0 })
  const [documents, setDocuments] = useState<PublicDocumentsDto[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const lastRequestedPageRef = useRef<number>(-1)

  const shouldFetch = categoryId !== undefined && fetchParams.page >= 0
  const { data: publicData, isFetched } = useGetPublicDocuments({
    ...fetchParams,
    pageSize: DATA_PER_PAGE,
    enabled: shouldFetch,
  })

  // 비공개 문서 개수 가져오기
  const { data: notPublicDocumentsData } = useGetIsNotPublicDocuments()
  const notPublicCount = notPublicDocumentsData?.documents.length ?? 0

  // 디테일 페이지에서 변경된 북마크 정보 카드 리스트에 업데이트
  const [updatedBookmarkInfo, , removeBookmarkInfo] = useSessionStorage('bookmarkUpdate', null)
  useEffect(() => {
    if (!updatedBookmarkInfo || !updatedBookmarkInfo.id || documents.length === 0) return

    const targetIndex = documents.findIndex((doc) => doc.id === updatedBookmarkInfo.id)

    if (targetIndex !== -1) {
      // 원래 위치로 돌아가기
      // 1. Swiper 슬라이드 이동
      swiperRef.current?.slideTo(targetIndex)

      if (updatedBookmarkInfo.isUpdated) {
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === updatedBookmarkInfo.id
              ? {
                  ...doc,
                  quizzes: doc.quizzes,
                  isBookmarked: updatedBookmarkInfo.isBookmarked ?? false,
                  bookmarkCount: updatedBookmarkInfo.bookmarkCount ?? 0,
                }
              : doc,
          ),
        )
      }

      removeBookmarkInfo()
    }
  }, [updatedBookmarkInfo, removeBookmarkInfo, documents])

  // 카테고리 변경 시 데이터 초기화
  useEffect(() => {
    setActiveIndex(0)
    swiperRef.current?.slideTo(0)
    setFetchParams({ categoryId, page: 0 })
    setDocuments([])
    setHasMore(true)
    setIsFetching(true)
    lastRequestedPageRef.current = -1
  }, [categoryId])

  useEffect(() => {
    if (!isFetched) return

    if (publicData?.documents?.length) {
      const merged = [
        ...documents,
        ...publicData.documents.filter((doc) => !documents.find((d) => d.id === doc.id)),
      ] as PublicDocumentsDto[]

      const shareCardDoc = {
        id: 'SHARE',
        name: '',
        emoji: '',
        previewContent: '',
        category: '',
        creator: null,
        isBookmarked: false,
        isOwner: false,
        tryCount: 0,
        bookmarkCount: 0,
        quizzes: [],
        totalQuizCount: 0,
      } as ShareCard

      const alreadyHasPlaceholder = merged.find((d) => d.id === 'SHARE')
      if (!alreadyHasPlaceholder && notPublicCount > 0) {
        // 비공개 문서가 있을 때 공개 권유 카드 추가
        if (merged.length < 2) {
          merged.push(shareCardDoc)
        } else {
          merged.splice(2, 0, shareCardDoc)
        }
      }

      setDocuments(merged)

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

  if (isFetching && documents.length === 0) {
    return (
      <div
        style={{ height: 'calc(100vh - env(safe-area-inset-top) - 184px)' }}
        className="relative w-full p-[16px] pt-[28px] flex-center overflow-hidden bg-base-2"
      >
        <Loading />
      </div>
    )
  }

  return (
    <div
      ref={swiperContainerRef}
      style={{
        height: 'calc(100vh - env(safe-area-inset-top) - 184px)',
        touchAction: 'pan-y',
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      className="relative w-full p-[16px] pt-[28px] flex flex-col items-center gap-[10px] overflow-hidden bg-base-2"
    >
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
        {documents.map((document, index) =>
          document.id === 'SHARE' ? (
            <SwiperSlide key={document.id} virtualIndex={index}>
              <ShareCard index={index} activeIndex={activeIndex} notPublicCount={notPublicCount} />
            </SwiperSlide>
          ) : (
            <SwiperSlide key={document.id} virtualIndex={index}>
              <ExploreSwipeCard
                index={index}
                activeIndex={activeIndex}
                document={document}
                setDocuments={setDocuments}
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>
    </div>
  )
}

// 공개 문서 카드
const ExploreSwipeCard = ({
  index,
  activeIndex,
  document,
  setDocuments,
}: {
  index: number
  activeIndex: number
  document: GetPublicDocumentsDto
  setDocuments: React.Dispatch<React.SetStateAction<PublicDocumentsDto[]>>
}) => {
  const { trackEvent } = useAmplitude()

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

  const [isBookmarkPending, setIsBookmarkPending] = useState(false)

  // 공유하기 핸들러
  const handleShare = async () => {
    trackEvent('explore_share_click', { location: '미리보기 페이지' })

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Q. ${quizzes[0].question} 외 ${totalQuizCount - 1}문제`,
          url: `${window.location.origin}explore/detail/${id}`, // 추후 picktoss.com으로 변경
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
    if (isBookmarkPending) return // 중복 방지

    setIsBookmarkPending(true)

    // 낙관적 UI 업데이트
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === document.id
          ? {
              ...doc,
              isBookmarked: !doc.isBookmarked,
              bookmarkCount: doc.isBookmarked ? doc.bookmarkCount - 1 : doc.bookmarkCount + 1,
            }
          : doc,
      ),
    )

    const isCurrentlyBookmarked = document.isBookmarked

    const rollback = () => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === document.id
            ? {
                ...doc,
                isBookmarked: isCurrentlyBookmarked,
                bookmarkCount: isCurrentlyBookmarked ? doc.bookmarkCount + 1 : doc.bookmarkCount - 1,
              }
            : doc,
        ),
      )
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

    if (isCurrentlyBookmarked) {
      deleteDocumentBookmark(undefined, { onSuccess, onError })
    } else {
      documentBookmark(undefined, { onSuccess, onError })
    }
  }

  const handleQuizStart = () => {
    createQuizSet(
      {
        quizType: 'ALL',
        quizCount: totalQuizCount,
      },
      {
        onSuccess: (data) => {
          trackEvent('quiz_start_click', { location: '탐험 메인' })
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
          onClickShare={handleShare}
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
          onClickViewAllBtn={() => {
            trackEvent('explore_detail_click')
            router.push('/explore/detail/:noteId', { params: [String(id)] })
          }}
        />
      }
      footer={<ExploreQuizCard.Footer onClickStartQuiz={handleQuizStart} isLoading={isCreatingQuizSet} />}
    />
  )
}

// 비공개 문서가 있을 경우 노출 될 공개 권유 카드
const ShareCard = ({
  index,
  activeIndex,
  notPublicCount,
}: {
  index: number
  activeIndex: number
  notPublicCount: number
}) => {
  const router = useRouter()

  return (
    <div
      className={cn(
        'w-[343px] h-[500px] relative flex-center flex-col gap-[32px] bg-base-1 rounded-[20px] shadow-[0px_4px_28px_0px_rgba(0,0,0,0.10)] overflow-hidden transition-transform duration-300',
        activeIndex !== index && 'scale-90 pointer-events-none',
      )}
    >
      <IcLibrary className="size-[96px] text-icon-accent" />

      <div className="flex-center flex-col gap-[12px]">
        <Text typo="h3" className="text-center">
          내가 만든 퀴즈도 <br />
          사람들과 공유해보세요
        </Text>

        <Text typo="subtitle-2-medium" color="secondary" className="">
          공개할 수 있는 퀴즈가{' '}
          <Text as={'span'} typo="subtitle-2-medium" color="accent">
            {notPublicCount}개
          </Text>{' '}
          있어요
        </Text>
      </div>

      <Button
        onClick={() => router.push('/explore/release')}
        size={'md'}
        variant={'tertiary'}
        className="size-fit px-[31.5px] py-[15px]"
      >
        확인하기
      </Button>
    </div>
  )
}

export default QuizVerticalSwipe
