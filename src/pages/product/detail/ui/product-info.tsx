import React from 'react'

import { Product } from '../../model/type'

interface ProductInfoProps {
  product: Product
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

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

  // 카테고리명 표시용 함수
  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      electronics: '전자제품',
      clothing: '의류',
      books: '도서',
      home: '홈/리빙',
      beauty: '뷰티',
      sports: '스포츠/레저',
      toys: '장난감/취미',
      automotive: '자동차용품',
    }
    return categoryNames[category] || category
  }

  // 할인율 계산
  const calculateDiscount = () => {
    if (!product.discountedPrice) return null
    const discount = Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    return discount
  }

  const discountPercentage = calculateDiscount()

  return (
    <div>
      {/* 카테고리 */}
      <div className="text-sm text-gray-500 mb-2">
        {getCategoryDisplayName(product.category)}
      </div>
      
      {/* 제품명 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
      
      {/* 평점 및 리뷰 수 */}
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {renderRating(product.rating)}
        </div>
        <span className="text-gray-600 text-sm">
          {product.rating.toFixed(1)} ({product.reviewCount} 리뷰)
        </span>
      </div>
      
      {/* 가격 정보 */}
      <div className="mb-6">
        {product.discountedPrice ? (
          <div className="flex items-center">
            <span className="line-through text-gray-400 text-lg mr-2">
              {product.price.toLocaleString()}원
            </span>
            <span className="text-2xl font-bold text-red-600">
              {product.discountedPrice.toLocaleString()}원
            </span>
            {discountPercentage && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                {discountPercentage}% 할인
              </span>
            )}
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-800">
            {product.price.toLocaleString()}원
          </span>
        )}
      </div>
      
      {/* 간단한 설명 */}
      <div className="mb-6">
        <p className="text-gray-600">
          {product.description.substring(0, 100)}...
        </p>
      </div>
      
      {/* 추가 정보 */}
      <div className="border-t border-b py-4 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500">ID</div>
          <div>{product.id}</div>
          
          <div className="text-gray-500">등록일</div>
          <div>{formatDate(product.createdAt)}</div>
          
          <div className="text-gray-500">업데이트</div>
          <div>{formatDate(product.updatedAt)}</div>
        </div>
      </div>
    </div>
  )
}
