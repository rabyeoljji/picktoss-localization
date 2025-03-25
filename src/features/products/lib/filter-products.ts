import { Product } from '../model/product'

/**
 * 상품 필터링 및 정렬 함수
 * useQueryParam에서 가져온 파라미터를 기반으로 상품을 필터링하고 정렬합니다
 */
export const filterProducts = (
  products: Product[],
  filters: {
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: 'latest' | 'price-asc' | 'price-desc' | 'popular'
    search?: string
    brand?: string
    isOnSale?: string
    inStock?: string
    rating?: string
  }
): Product[] => {
  // 초기 상품 목록으로 시작
  let filteredProducts = [...products]

  // 카테고리별 필터링
  if (filters.category && filters.category !== '') {
    filteredProducts = filteredProducts.filter(product => product.category === filters.category)
  }

  // 최소 가격 필터링
  if (filters.minPrice && filters.minPrice !== '') {
    const minPrice = parseInt(filters.minPrice, 10)
    if (!isNaN(minPrice)) {
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice)
    }
  }

  // 최대 가격 필터링
  if (filters.maxPrice && filters.maxPrice !== '') {
    const maxPrice = parseInt(filters.maxPrice, 10)
    if (!isNaN(maxPrice)) {
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice)
    }
  }

  // 검색어 필터링
  if (filters.search && filters.search !== '') {
    const searchLower = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
    )
  }

  // 브랜드 필터링
  if (filters.brand && filters.brand !== '') {
    filteredProducts = filteredProducts.filter(product => product.brand === filters.brand)
  }

  // 세일 상품 필터링
  if (filters.isOnSale === 'true') {
    filteredProducts = filteredProducts.filter(product => product.isOnSale)
  } else if (filters.isOnSale === 'false') {
    filteredProducts = filteredProducts.filter(product => !product.isOnSale)
  }

  // 재고 있음 필터링
  if (filters.inStock === 'true') {
    filteredProducts = filteredProducts.filter(product => product.inStock)
  } else if (filters.inStock === 'false') {
    filteredProducts = filteredProducts.filter(product => !product.inStock)
  }

  // 평점 필터링
  if (filters.rating && filters.rating !== '') {
    const ratingValue = parseInt(filters.rating, 10)
    if (!isNaN(ratingValue)) {
      filteredProducts = filteredProducts.filter(product => Math.floor(product.rating) >= ratingValue)
    }
  }

  // 정렬
  if (filters.sort) {
    switch (filters.sort) {
      case 'latest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filteredProducts.sort((a, b) => b.popularity - a.popularity)
        break
    }
  }

  return filteredProducts
}

/**
 * 페이지네이션 함수
 */
export const paginateProducts = (
  products: Product[],
  page: number,
  pageSize: number = 6
): { 
  paginatedProducts: Product[], 
  totalPages: number 
} => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProducts = products.slice(startIndex, endIndex)
  const totalPages = Math.ceil(products.length / pageSize)

  return { paginatedProducts, totalPages }
}

/**
 * 사용 가능한 모든 브랜드 목록 추출
 */
export const extractBrands = (products: Product[]): string[] => {
  const brands = new Set<string>()
  products.forEach(product => brands.add(product.brand))
  return Array.from(brands).sort()
}

/**
 * 가격 형식화 유틸리티 함수
 */
export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
}
