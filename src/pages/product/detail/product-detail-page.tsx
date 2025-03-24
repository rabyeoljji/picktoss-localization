import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import { useQueryParam } from '../../../shared/lib/query-param'
import { Product, ProductOptionType, ProductReview, ProductReviewTab } from '../model/type'
import { ProductImageGallery } from './ui/product-image-gallery'
import { ProductInfo } from './ui/product-info'
import { ProductOptions } from './ui/product-options'
import { ProductReviews } from './ui/product-reviews'

// 목업 제품 상세 정보
const getProductDetail = (id: string): Product => {
  const idx = parseInt(id.split('-')[1]) || 1
  return {
    id,
    name: `고급 제품 ${idx}`,
    description: `이 제품은 최고급 품질로 제작되었으며, 내구성과 성능이 뛰어납니다. 다양한 용도로 활용할 수 있으며, 만족스러운 사용 경험을 제공합니다. 우수한 디자인과 품질로 많은 고객들에게 사랑받고 있는 제품입니다.`,
    price: Math.floor(Math.random() * 10000) * 100 + 10000,
    discountedPrice: Math.random() > 0.3 ? Math.floor(Math.random() * 8000) * 100 + 8000 : undefined,
    imageUrl: `https://picsum.photos/seed/product-${idx}/800/600`,
    thumbnailUrl: `https://picsum.photos/seed/product-${idx}/300/200`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports'][Math.floor(Math.random() * 6)] as any,
    rating: Math.floor(Math.random() * 50) / 10 + 1,
    reviewCount: Math.floor(Math.random() * 200),
    options: [
      {
        type: 'color',
        value: ['블랙', '화이트', '블루', '레드'][Math.floor(Math.random() * 4)],
      },
      {
        type: 'size',
        value: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
      },
      {
        type: 'material',
        value: ['면', '실크', '폴리에스터', '나일론'][Math.floor(Math.random() * 4)],
      },
    ],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// 목업 리뷰 데이터
const generateMockReviews = (productId: string, count: number): ProductReview[] => {
  return Array.from({ length: count }, (_, idx) => {
    const rating = Math.floor(Math.random() * 5) + 1
    const isPositive = rating >= 4
    const hasImages = Math.random() > 0.7

    return {
      id: `review-${productId}-${idx}`,
      productId,
      rating,
      title: isPositive ? '정말 만족스러운 제품입니다' : '아쉬운 점이 있네요',
      content: isPositive
        ? '배송도 빠르고 제품 품질도 좋습니다. 다음에도 구매하고 싶어요. 주변 사람들에게도 추천하고 싶은 제품입니다.'
        : '생각했던 것보다 크기가 작고, 배송이 조금 지연되었습니다. 품질은 가격 대비 괜찮은 편입니다.',
      authorName: `사용자${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      hasImages,
      helpful: Math.floor(Math.random() * 50),
    }
  })
}

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 쿼리 파라미터로 선택된 옵션 관리
  const { value: selectedColor, setValue: setSelectedColor } = useQueryParam<string>('color', '')
  const { value: selectedSize, setValue: setSelectedSize } = useQueryParam<string>('size', '')
  const { value: selectedMaterial, setValue: setSelectedMaterial } = useQueryParam<string>('material', '')

  // 리뷰 탭 상태 관리
  const { value: reviewTab, setValue: setReviewTab } = useQueryParam<ProductReviewTab>('reviewTab', 'all')

  // 검색에서 온 경우 해당 검색어 저장
  const { value: fromSearch } = useQueryParam<string>('fromSearch', '')

  // 제품 상세 정보 로드
  useEffect(() => {
    if (!productId) return

    setIsLoading(true)

    // API 호출 시뮬레이션
    setTimeout(() => {
      const productDetail = getProductDetail(productId)
      setProduct(productDetail)

      // 리뷰 데이터 로드
      const reviewsData = generateMockReviews(productId, productDetail.reviewCount || 20)
      setReviews(reviewsData)

      // 기본 옵션값 설정 (선택된 값이 없는 경우)
      if (!selectedColor) {
        const colorOption = productDetail.options.find((opt) => opt.type === 'color')
        if (colorOption) setSelectedColor(colorOption.value)
      }

      if (!selectedSize) {
        const sizeOption = productDetail.options.find((opt) => opt.type === 'size')
        if (sizeOption) setSelectedSize(sizeOption.value)
      }

      if (!selectedMaterial) {
        const materialOption = productDetail.options.find((opt) => opt.type === 'material')
        if (materialOption) setSelectedMaterial(materialOption.value)
      }

      setIsLoading(false)
    }, 800)
  }, [productId, selectedColor, selectedSize, selectedMaterial, setSelectedColor, setSelectedSize, setSelectedMaterial])

  // 옵션 변경 핸들러
  const handleOptionChange = (type: ProductOptionType, value: string) => {
    switch (type) {
      case 'color':
        setSelectedColor(value)
        break
      case 'size':
        setSelectedSize(value)
        break
      case 'material':
        setSelectedMaterial(value)
        break
    }
  }

  // 리뷰 필터링
  const filteredReviews = reviews.filter((review) => {
    switch (reviewTab) {
      case 'positive':
        return review.rating >= 4
      case 'negative':
        return review.rating <= 2
      case 'with-images':
        return review.hasImages
      case 'all':
      default:
        return true
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
        <Link to="/product/list" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          상품 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* 이전 검색으로 돌아가기 버튼 */}
      {fromSearch && (
        <div className="mb-4">
          <Link
            to={`/product/list?search=${fromSearch}`}
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <span className="mr-1">←</span> "{fromSearch}" 검색 결과로 돌아가기
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* 상품 이미지 갤러리 */}
        <div className="md:w-1/2">
          <ProductImageGallery imageUrl={product.imageUrl} productName={product.name} />
        </div>

        {/* 상품 정보 및 옵션 */}
        <div className="md:w-1/2">
          <ProductInfo product={product} />

          <div className="my-6">
            <ProductOptions
              options={product.options}
              selectedOptions={{
                color: selectedColor,
                size: selectedSize,
                material: selectedMaterial,
              }}
              onOptionChange={handleOptionChange}
            />
          </div>

          {/* 구매 버튼 */}
          <div className="mt-8">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">
              구매하기
            </button>
            <div className="flex gap-4 mt-4">
              <button className="flex-1 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition">
                장바구니
              </button>
              <button className="flex-1 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition">
                찜하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 상세 설명 */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">상품 상세</h2>
        <div className="prose max-w-none">
          <p>{product.description}</p>
          <div className="my-8">
            <img
              src={`https://picsum.photos/seed/detail-${product.id}/1200/800`}
              alt="제품 상세 이미지"
              className="w-full max-w-3xl mx-auto rounded-lg"
            />
          </div>
          <p>
            본 제품은 고객의 다양한 요구를 충족시키기 위해 꼼꼼하게 설계되었습니다. 최상의 소재와 기술을 사용하여
            만들어진 이 제품은 오랜 기간 변함없는 품질을 제공합니다. 환경 친화적인 생산 방식을 채택하여 환경 보호에도
            기여하고 있으며, 사용자 편의성을 최우선으로 생각한 디자인으로 누구나 쉽게 사용할 수 있습니다.
          </p>
          <p>
            다양한 사용자 테스트를 거쳐 개선된 이 제품은 시장에서 높은 평가를 받고 있습니다. 지속적인 연구 개발을 통해
            앞으로도 더 나은 제품을 제공하기 위해 노력하겠습니다.
          </p>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-12 border-t pt-8">
        <ProductReviews
          reviews={filteredReviews}
          totalReviews={reviews.length}
          productRating={product.rating}
          activeTab={reviewTab}
          onTabChange={setReviewTab}
        />
      </div>
    </div>
  )
}

export default ProductDetailPage
