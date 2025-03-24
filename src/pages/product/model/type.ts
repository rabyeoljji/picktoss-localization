export type ProductCategory = 
  | 'electronics' 
  | 'clothing' 
  | 'books' 
  | 'home' 
  | 'beauty' 
  | 'sports'
  | 'toys'
  | 'automotive'

export type ProductSortOption = 
  | 'newest' 
  | 'price-low-high' 
  | 'price-high-low' 
  | 'popular' 
  | 'rating'

export type ProductReviewTab = 
  | 'all' 
  | 'positive' 
  | 'negative' 
  | 'with-images'

export type ProductOptionType = 
  | 'color' 
  | 'size' 
  | 'material' 
  | 'storage'
  | 'capacity'

export interface ProductOption {
  type: ProductOptionType
  value: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  discountedPrice?: number
  imageUrl: string
  thumbnailUrl: string
  category: ProductCategory
  rating: number
  reviewCount: number
  options: ProductOption[]
  createdAt: string
  updatedAt: string
}

// 상품 검색 필터 타입
export interface ProductFilters {
  category?: ProductCategory | ProductCategory[] | null
  minPrice?: number
  maxPrice?: number
  search?: string
  sort?: ProductSortOption
  page?: string
  inStock?: boolean
}

// 리뷰 관련 타입
export interface ProductReview {
  id: string
  productId: string
  rating: number
  title: string
  content: string
  authorName: string
  createdAt: string
  hasImages: boolean
  helpful: number
}
