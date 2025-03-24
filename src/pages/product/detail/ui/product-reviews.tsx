import React from 'react'

import { ProductReview, ProductReviewTab } from '../../model/type'

interface ProductReviewsProps {
  reviews: ProductReview[]
  totalReviews: number
  productRating: number
  activeTab: ProductReviewTab
  onTabChange: (tab: ProductReviewTab) => void
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  totalReviews,
  productRating,
  activeTab,
  onTabChange,
}) => {
  // 별점 분포 계산
  const calculateRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // 5,4,3,2,1점 개수
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating] += 1
      }
    })
    
    return distribution
  }
  
  const ratingDistribution = calculateRatingDistribution()
  
  // 리뷰 탭 정보
  const tabs: { id: ProductReviewTab; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'positive', label: '좋은 평가' },
    { id: 'negative', label: '나쁜 평가' },
    { id: 'with-images', label: '사진 포함' },
  ]

  // 별점 표시 헬퍼 함수
  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // 꽉 찬 별
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>)
    }

    // 반 별
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>)
    }

    // 빈 별
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>)
    }

    return stars
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center">
        리뷰
        <span className="ml-2 text-sm font-normal text-gray-500">
          총 {totalReviews}개
        </span>
      </h2>

      {/* 상품 평점 요약 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* 평균 평점 */}
          <div className="mb-6 md:mb-0 md:mr-10">
            <div className="text-3xl font-bold text-center">{productRating.toFixed(1)}</div>
            <div className="flex justify-center mt-2">
              {renderRating(productRating)}
            </div>
            <div className="text-sm text-gray-500 text-center mt-1">
              {totalReviews}개 리뷰 기준
            </div>
          </div>
          
          {/* 별점 분포 */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[5 - star]
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              
              return (
                <div key={star} className="flex items-center mb-1">
                  <div className="flex items-center w-16">
                    <span className="text-sm mr-1">{star}</span>
                    <span className="text-yellow-400 text-sm">★</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm text-gray-500">
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 리뷰 탭 */}
      <div className="border-b mb-6">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent hover:text-gray-700'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label} {tab.id === 'all' ? `(${totalReviews})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex mb-1">
                    {renderRating(review.rating)}
                  </div>
                  <h3 className="font-medium">{review.title}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">
                {review.content}
              </p>
              
              {/* 리뷰 이미지가 있는 경우 */}
              {review.hasImages && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[1, 2, 3].map((idx) => (
                    <img
                      key={idx}
                      src={`https://picsum.photos/seed/review-${review.id}-${idx}/150/150`}
                      alt={`리뷰 이미지 ${idx}`}
                      className="rounded-md w-full h-auto object-cover aspect-square"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{review.authorName}</span>
                </div>
                
                <button className="text-sm text-gray-500 flex items-center">
                  <span className="mr-1">👍</span>
                  도움됨 ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {reviews.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
            리뷰 더보기
          </button>
        </div>
      )}
    </div>
  )
}
