import React, { useMemo } from 'react'
import { useQueryParam } from '@/shared/lib/router/query-param/model/use-query-param'
import { MOCK_PRODUCTS } from '../model/product'
import { extractBrands, filterProducts, formatPrice, paginateProducts } from '../lib/filter-products'

/**
 * 상품 목록 페이지
 * useQueryParam 훅을 최대한 활용하여 모든 필터링 상태를 URL에서 관리
 */
export const ProductsPage: React.FC = () => {
  // 상품 카테고리 파라미터
  const [category, setCategory] = useQueryParam('/products', 'category')
  
  // 가격 범위 파라미터
  const [minPrice, setMinPrice] = useQueryParam('/products', 'minPrice')
  const [maxPrice, setMaxPrice] = useQueryParam('/products', 'maxPrice')
  
  // 정렬 방식 파라미터
  const [sort, setSort] = useQueryParam('/products', 'sort')
  
  // 페이지네이션 파라미터
  const [page, setPage] = useQueryParam('/products', 'page')
  const currentPage = page ? parseInt(page, 10) : 1
  
  // 검색어 파라미터
  const [search, setSearch] = useQueryParam('/products', 'search')
  const [searchInput, setSearchInput] = React.useState(search || '')
  
  // 브랜드 필터 파라미터
  const [brand, setBrand] = useQueryParam('/products', 'brand')
  
  // 세일 상품 필터 파라미터
  const [isOnSale, setIsOnSale] = useQueryParam('/products', 'isOnSale')
  
  // 재고 필터 파라미터
  const [inStock, setInStock] = useQueryParam('/products', 'inStock')
  
  // 평점 필터 파라미터
  const [rating, setRating] = useQueryParam('/products', 'rating')
  
  // 뷰 모드 파라미터 (그리드/리스트)
  const [view, setView] = useQueryParam('/products', 'view')
  
  // 사용 가능한 브랜드 목록
  const brands = useMemo(() => extractBrands(MOCK_PRODUCTS), [])
  
  // 필터링된 상품 목록
  const filteredProducts = useMemo(() => {
    return filterProducts(MOCK_PRODUCTS, {
      category,
      minPrice,
      maxPrice,
      sort: sort as 'latest' | 'price-asc' | 'price-desc' | 'popular',
      search,
      brand,
      isOnSale,
      inStock,
      rating
    })
  }, [category, minPrice, maxPrice, sort, search, brand, isOnSale, inStock, rating])
  
  // 페이지네이션 적용
  const { paginatedProducts, totalPages } = useMemo(() => {
    return paginateProducts(filteredProducts, currentPage)
  }, [filteredProducts, currentPage])
  
  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }
  
  // 모든 필터 초기화
  const resetAllFilters = () => {
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('latest')
    setPage('1')
    setSearch('')
    setBrand('')
    setIsOnSale('')
    setInStock('')
    setRating('')
    setView('grid')
    setSearchInput('')
  }
  
  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage.toString())
      // 페이지 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
        
        {/* 검색 폼 */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="상품명, 설명, 브랜드 검색"
              className="flex-grow p-2 border rounded"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              검색
            </button>
          </div>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* 필터 사이드바 */}
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">필터</h2>
              <button 
                onClick={resetAllFilters}
                className="text-sm text-blue-500"
              >
                초기화
              </button>
            </div>
            
            {/* 카테고리 필터 */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">카테고리</h3>
              <select 
                className="w-full p-2 border rounded"
                value={category}
                onChange={(e) => {
                  // 타입 캐스팅을 통해 타입 안전성 확보
                  const value = e.target.value as '' | '전자제품' | '의류' | '식품' | '도서' | '생활용품'
                  setCategory(value)
                }}
              >
                <option value="">전체 카테고리</option>
                <option value="전자제품">전자제품</option>
                <option value="의류">의류</option>
                <option value="식품">식품</option>
                <option value="도서">도서</option>
                <option value="생활용품">생활용품</option>
              </select>
            </div>
            
            {/* 가격 범위 필터 */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">가격 범위</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="최소"
                  className="p-2 border rounded"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="최대"
                  className="p-2 border rounded"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            
            {/* 브랜드 필터 */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">브랜드</h3>
              <select 
                className="w-full p-2 border rounded"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">전체 브랜드</option>
                {brands.map((brandName) => (
                  <option key={brandName} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 세일 상품 필터 */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">세일 상품</h3>
              <select 
                className="w-full p-2 border rounded"
                value={isOnSale}
                onChange={(e) => {
                  // 타입 캐스팅을 통해 타입 안전성 확보
                  const value = e.target.value as '' | 'true' | 'false'
                  setIsOnSale(value)
                }}
              >
                <option value="">전체 보기</option>
                <option value="true">세일 상품만</option>
                <option value="false">일반 상품만</option>
              </select>
            </div>
            
            {/* 재고 필터 */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">재고 상태</h3>
              <select 
                className="w-full p-2 border rounded"
                value={inStock}
                onChange={(e) => {
                  // 타입 캐스팅을 통해 타입 안전성 확보
                  const value = e.target.value as '' | 'true' | 'false'
                  setInStock(value)
                }}
              >
                <option value="">전체 보기</option>
                <option value="true">재고 있음</option>
                <option value="false">품절</option>
              </select>
            </div>
            
            {/* 평점 필터 */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">최소 평점</h3>
              <select 
                className="w-full p-2 border rounded"
                value={rating}
                onChange={(e) => {
                  // 타입 캐스팅을 통해 타입 안전성 확보
                  const value = e.target.value as '' | '1' | '2' | '3' | '4' | '5'
                  setRating(value)
                }}
              >
                <option value="">전체 평점</option>
                <option value="5">★★★★★ (5점)</option>
                <option value="4">★★★★☆ (4점 이상)</option>
                <option value="3">★★★☆☆ (3점 이상)</option>
                <option value="2">★★☆☆☆ (2점 이상)</option>
                <option value="1">★☆☆☆☆ (1점 이상)</option>
              </select>
            </div>
          </div>
          
          {/* 상품 목록 */}
          <div>
            {/* 상단 정렬 및 뷰 변경 옵션 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">정렬:</span>
                <select 
                  className="p-1.5 border rounded text-sm"
                  value={sort}
                  onChange={(e) => {
                    // 타입 캐스팅을 통해 타입 안전성 확보
                    const value = e.target.value as 'latest' | 'price-asc' | 'price-desc' | 'popular'
                    setSort(value)
                  }}
                >
                  <option value="latest">최신순</option>
                  <option value="price-asc">가격 낮은순</option>
                  <option value="price-desc">가격 높은순</option>
                  <option value="popular">인기순</option>
                </select>
              </div>
              
              {/* 그리드/리스트 뷰 전환 */}
              <div className="flex gap-2">
                <button 
                  className={`p-1.5 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                  onClick={() => setView('grid')}
                >
                  그리드
                </button>
                <button 
                  className={`p-1.5 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                  onClick={() => setView('list')}
                >
                  리스트
                </button>
              </div>
            </div>
            
            {/* 상품 결과 요약 */}
            <p className="text-sm text-gray-600 mb-4">
              전체 {filteredProducts.length}개 상품 중 {paginatedProducts.length}개 표시 (페이지 {currentPage}/{totalPages})
            </p>
            
            {/* 상품이 없을 경우 */}
            {paginatedProducts.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">조건에 맞는 상품이 없습니다.</p>
                <button 
                  onClick={resetAllFilters}
                  className="mt-4 text-blue-500 underline"
                >
                  모든 필터 초기화하기
                </button>
              </div>
            )}
            
            {/* 그리드 뷰 */}
            {view === 'grid' && paginatedProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="border rounded overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{product.name}</h3>
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        {product.isOnSale && product.discount ? (
                          <div>
                            <span className="text-xs line-through text-gray-400">
                              {formatPrice(product.price)}
                            </span>
                            <p className="text-red-600 font-bold">
                              {formatPrice(Math.round(product.price * (1 - product.discount / 100)))}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold">{formatPrice(product.price)}</p>
                        )}
                        
                        <div className="flex gap-1 text-xs">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.category}
                          </span>
                          {!product.inStock && (
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                              품절
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 리스트 뷰 */}
            {view === 'list' && paginatedProducts.length > 0 && (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="border rounded overflow-hidden flex">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{product.name}</h3>
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 line-clamp-2">{product.description}</p>
                      <div className="text-xs text-gray-500 mb-1">브랜드: {product.brand}</div>
                      <div className="flex justify-between items-end">
                        {product.isOnSale && product.discount ? (
                          <div>
                            <span className="text-xs line-through text-gray-400">
                              {formatPrice(product.price)}
                            </span>
                            <p className="text-red-600 font-bold">
                              {formatPrice(Math.round(product.price * (1 - product.discount / 100)))}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold">{formatPrice(product.price)}</p>
                        )}
                        
                        <div className="flex gap-1 text-xs">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.category}
                          </span>
                          {!product.inStock && (
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                              품절
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex gap-1">
                  <button 
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-500'}`}
                  >
                    «
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-500'}`}
                  >
                    ‹
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1
                    // 5페이지 이상일 때 생략 표시
                    if (totalPages > 5) {
                      // 첫 2페이지, 마지막 2페이지, 현재 페이지 주변만 표시
                      if (
                        pageNum <= 2 ||
                        pageNum >= totalPages - 1 ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'text-blue-500'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      } else if (pageNum === 3 && currentPage > 4) {
                        return <span key="ellipsis1" className="px-2 py-1">...</span>
                      } else if (pageNum === totalPages - 2 && currentPage < totalPages - 3) {
                        return <span key="ellipsis2" className="px-2 py-1">...</span>
                      }
                      return null
                    }
                    
                    // 5페이지 이하일 때는 모든 페이지 번호 표시
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'text-blue-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-500'}`}
                  >
                    ›
                  </button>
                  <button 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-500'}`}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
