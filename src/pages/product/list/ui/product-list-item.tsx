import React from 'react'

import { Product } from '../../model/type'

interface ProductListItemProps {
  product: Product
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
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

  // 할인율 계산
  const calculateDiscount = () => {
    if (!product.discountedPrice) return null
    const discount = Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    return discount
  }

  const discountPercentage = calculateDiscount()

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      {/* 상품 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={product.thumbnailUrl} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% 할인
          </div>
        )}
      </div>
      
      {/* 상품 정보 */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2 text-sm">
            <div className="flex mr-1">{renderRating(product.rating)}</div>
            <span className="text-gray-500">({product.reviewCount})</span>
          </div>
        </div>
        
        <div>
          {/* 가격 정보 */}
          <div className="mt-2">
            {product.discountedPrice ? (
              <div>
                <p className="line-through text-gray-400 text-sm">
                  {product.price.toLocaleString()}원
                </p>
                <p className="font-bold text-red-600">
                  {product.discountedPrice.toLocaleString()}원
                </p>
              </div>
            ) : (
              <p className="font-bold text-gray-800">
                {product.price.toLocaleString()}원
              </p>
            )}
          </div>
          
          {/* 카테고리 태그 */}
          <div className="mt-2">
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {getCategoryDisplayName(product.category)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
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
