import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useQueryParam } from '../../../shared/lib/query-param'
import { Product, ProductCategory, ProductFilters, ProductSortOption } from '../model/type'
import { ProductFilterBar } from './ui/product-filter-bar'
import { ProductListItem } from './ui/product-list-item'
import { ProductPagination } from './ui/product-pagination'
import { ProductSort } from './ui/product-sort'

// 목업 데이터
const MOCK_PRODUCTS: Product[] = Array.from({ length: 20 }, (_, idx) => ({
  id: `product-${idx + 1}`,
  name: `제품 ${idx + 1}`,
  description: '제품 상세 설명입니다.',
  price: Math.floor(Math.random() * 10000) * 100 + 10000,
  discountedPrice: Math.random() > 0.3 ? Math.floor(Math.random() * 8000) * 100 + 8000 : undefined,
  imageUrl: `https://picsum.photos/seed/product-${idx + 1}/600/400`,
  thumbnailUrl: `https://picsum.photos/seed/product-${idx + 1}/300/200`,
  category: ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports'][
    Math.floor(Math.random() * 6)
  ] as ProductCategory,
  rating: Math.floor(Math.random() * 50) / 10 + 1,
  reviewCount: Math.floor(Math.random() * 200),
  options: [
    { type: 'color', value: ['Black', 'White', 'Blue', 'Red'][Math.floor(Math.random() * 4)] },
    { type: 'size', value: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)] },
  ],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date().toISOString(),
}))

export const ProductListPage: React.FC = () => {
  // 쿼리 파라미터 상태 관리
  const { value: searchQuery, setValue: setSearchQuery } = useQueryParam<string>('search', '')
  const { value: categoryFilter, setValue: setCategoryFilter } = useQueryParam<
    ProductCategory | ProductCategory[] | null
  >('category', null)
  const { value: sortOption, setValue: setSortOption } = useQueryParam<ProductSortOption>('sort', 'newest')
  const { value: pageParam, setValue: setPageParam } = useQueryParam<string>('page', '1')
  const { value: minPriceParam, setValue: setMinPriceParam } = useQueryParam<string | null>('minPrice', null)
  const { value: maxPriceParam, setValue: setMaxPriceParam } = useQueryParam<string | null>('maxPrice', null)
  const { value: inStockParam, setValue: setInStockParam } = useQueryParam<string | null>('inStock', '')

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)
  // 상품 목록
  const [products, setProducts] = useState<Product[]>([])
  // 총 상품 수
  const [totalProducts, setTotalProducts] = useState(0)

  // 페이지 번호는 숫자로 변환
  const currentPage = Number(pageParam) || 1
  const minPrice = minPriceParam ? Number(minPriceParam) : undefined
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined
  const inStock = inStockParam === 'true'

  // 상품 필터링 및 정렬
  useEffect(() => {
    // 실제로는 API 호출을 통해 서버에서 필터링된 결과를 가져옴
    // 여기서는 클라이언트 사이드에서 필터링 시뮬레이션
    setIsLoading(true)

    // 현재 필터 조건을 기반으로 API 호출 파라미터 구성
    const filters: ProductFilters = {
      category: categoryFilter,
      search: searchQuery,
      sort: sortOption,
      page: pageParam,
      minPrice,
      maxPrice,
      inStock: inStockParam === 'true',
    }

    console.log('Applied filters:', filters)

    // API 호출 시뮬레이션
    setTimeout(() => {
      // 카테고리 필터링
      let filteredProducts = [...MOCK_PRODUCTS]

      // 검색어 필터링
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // 카테고리 필터링
      if (categoryFilter) {
        if (Array.isArray(categoryFilter)) {
          filteredProducts = filteredProducts.filter((p) => categoryFilter.includes(p.category))
        } else {
          filteredProducts = filteredProducts.filter((p) => p.category === categoryFilter)
        }
      }

      // 가격 범위 필터링
      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => (p.discountedPrice || p.price) >= minPrice)
      }

      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((p) => (p.discountedPrice || p.price) <= maxPrice)
      }

      // 정렬
      switch (sortOption) {
        case 'price-low-high':
          filteredProducts.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price))
          break
        case 'price-high-low':
          filteredProducts.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price))
          break
        case 'popular':
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
        default:
          filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      // 페이지네이션
      const PAGE_SIZE = 8
      const totalCount = filteredProducts.length
      const startIndex = (currentPage - 1) * PAGE_SIZE
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE)

      setProducts(paginatedProducts)
      setTotalProducts(totalCount)
      setIsLoading(false)
    }, 500) // 0.5초 지연으로 로딩 시뮬레이션
  }, [categoryFilter, searchQuery, sortOption, pageParam, minPrice, maxPrice, inStock, inStockParam, currentPage])

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // 검색 시 첫 페이지로 이동
    setPageParam('1')
  }

  // 카테고리 필터 핸들러
  const handleCategoryChange = (category: ProductCategory | ProductCategory[] | null) => {
    setCategoryFilter(category)
    setPageParam('1')
  }

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sort: ProductSortOption) => {
    setSortOption(sort)
  }

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setPageParam(page.toString())
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 가격 범위 필터 핸들러
  const handlePriceRangeChange = (min: number | undefined, max: number | undefined) => {
    if (min !== undefined) {
      setMinPriceParam(min.toString())
    } else {
      setMinPriceParam(null)
    }

    if (max !== undefined) {
      setMaxPriceParam(max.toString())
    } else {
      setMaxPriceParam(null)
    }

    setPageParam('1')
  }

  // 재고 필터 핸들러
  const handleInStockChange = (checked: boolean) => {
    setInStockParam(checked ? 'true' : null)
    setPageParam('1')
  }

  // 모든 필터 초기화
  const handleClearFilters = () => {
    setSearchQuery('')
    setCategoryFilter(null)
    setSortOption('newest')
    setPageParam('1')
    setMinPriceParam(null)
    setMaxPriceParam(null)
    setInStockParam(null)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">제품 목록</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 필터 사이드바 */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilterBar
            categoryFilter={categoryFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStock={inStock}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onInStockChange={handleInStockChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* 상품 목록 */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* 검색창 */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="제품 검색..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
              </div>
            </div>

            {/* 정렬 옵션 */}
            <ProductSort value={sortOption} onChange={handleSortChange} />
          </div>

          {/* 현재 적용된 필터 표시 */}
          {(searchQuery || categoryFilter || minPrice || maxPrice || inStock) && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">적용된 필터:</span>

              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 flex items-center">
                  검색: {searchQuery}
                  <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => setSearchQuery('')}>
                    ×
                  </button>
                </span>
              )}

              {categoryFilter && (
                <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 flex items-center">
                  카테고리: {Array.isArray(categoryFilter) ? categoryFilter.join(', ') : categoryFilter}
                  <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => setCategoryFilter(null)}>
                    ×
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 flex items-center">
                  가격: {minPrice ? `${minPrice.toLocaleString()}원` : '0원'} ~
                  {maxPrice ? `${maxPrice.toLocaleString()}원` : '무제한'}
                  <button
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setMinPriceParam(null)
                      setMaxPriceParam(null)
                    }}
                  >
                    ×
                  </button>
                </span>
              )}

              {inStock && (
                <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 flex items-center">
                  재고 있음
                  <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => setInStockParam(null)}>
                    ×
                  </button>
                </span>
              )}

              <button className="text-sm text-red-600 hover:text-red-800 ml-auto" onClick={handleClearFilters}>
                필터 초기화
              </button>
            </div>
          )}

          {/* 상품 수 표시 */}
          <p className="text-sm text-gray-500 mb-4">
            총 {totalProducts}개 제품 중 {products.length}개 표시 (페이지 {currentPage})
          </p>

          {isLoading ? (
            // 로딩 상태
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="border rounded-lg p-4 h-80 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2 w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-4 w-1/2"></div>
                  <div className="bg-gray-200 h-6 rounded-md w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            // 검색 결과 없음
            <div className="text-center py-12 border rounded-lg">
              <p className="text-xl text-gray-500 mb-4">검색 결과가 없습니다.</p>
              <p className="text-gray-400">다른 검색어나 필터 조건을 시도해보세요.</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleClearFilters}
              >
                필터 초기화
              </button>
            </div>
          ) : (
            // 상품 목록
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link key={product.id} to={`/product/detail/${product.id}?fromSearch=${searchQuery || ''}`}>
                    <ProductListItem product={product} />
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalProducts > 0 && (
                <div className="mt-8">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalProducts / 8)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
