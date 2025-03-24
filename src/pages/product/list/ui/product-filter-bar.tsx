import React, { useState } from 'react'

import { ProductCategory } from '../../model/type'

interface ProductFilterBarProps {
  categoryFilter: ProductCategory | ProductCategory[] | null
  minPrice?: number
  maxPrice?: number
  inStock: boolean
  onCategoryChange: (category: ProductCategory | ProductCategory[] | null) => void
  onPriceRangeChange: (min: number | undefined, max: number | undefined) => void
  onInStockChange: (checked: boolean) => void
  onClearFilters: () => void
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  categoryFilter,
  minPrice,
  maxPrice,
  inStock,
  onCategoryChange,
  onPriceRangeChange,
  onInStockChange,
  onClearFilters,
}) => {
  // 현재 선택된 카테고리들을 문자열로 표시
  const selectedCategories = typeof categoryFilter === 'string' 
    ? [categoryFilter] 
    : categoryFilter || []

  // 가격 필터 상태 관리
  const [minPriceInput, setMinPriceInput] = useState(minPrice?.toString() || '')
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice?.toString() || '')

  // 가격 필터 적용
  const handleApplyPriceFilter = () => {
    const min = minPriceInput ? parseInt(minPriceInput) : undefined
    const max = maxPriceInput ? parseInt(maxPriceInput) : undefined
    onPriceRangeChange(min, max)
  }

  // 카테고리 옵션들
  const categories: ProductCategory[] = [
    'electronics',
    'clothing',
    'books',
    'home',
    'beauty',
    'sports',
    'toys',
    'automotive',
  ]

  // 카테고리명 표시용 함수
  const getCategoryDisplayName = (category: ProductCategory): string => {
    const categoryNames: Record<ProductCategory, string> = {
      electronics: '전자제품',
      clothing: '의류',
      books: '도서',
      home: '홈/리빙',
      beauty: '뷰티',
      sports: '스포츠/레저',
      toys: '장난감/취미',
      automotive: '자동차용품',
    }
    return categoryNames[category]
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">필터</h3>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={onClearFilters}
        >
          초기화
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">카테고리</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onChange={() => {
                  if (selectedCategories.includes(category)) {
                    // 이미 선택된 경우 제거
                    const newCategories = selectedCategories.filter(c => c !== category)
                    if (newCategories.length === 0) {
                      onCategoryChange(null)
                    } else if (newCategories.length === 1) {
                      onCategoryChange(newCategories[0])
                    } else {
                      onCategoryChange(newCategories)
                    }
                  } else {
                    // 선택되지 않은 경우 추가
                    if (selectedCategories.length === 0) {
                      onCategoryChange(category)
                    } else {
                      onCategoryChange([...selectedCategories, category])
                    }
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={`category-${category}`} className="text-gray-700">
                {getCategoryDisplayName(category)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 가격 범위 필터 */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">가격 범위</h4>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="number"
            placeholder="최소"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="w-full border rounded-md px-3 py-1 text-sm"
            min="0"
          />
          <span className="text-gray-500">~</span>
          <input
            type="number"
            placeholder="최대"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="w-full border rounded-md px-3 py-1 text-sm"
            min="0"
          />
        </div>
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded-md text-sm transition"
          onClick={handleApplyPriceFilter}
        >
          적용
        </button>
      </div>

      {/* 재고 필터 */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="in-stock-filter"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="in-stock-filter" className="text-gray-700">
            재고 있는 상품만 보기
          </label>
        </div>
      </div>
    </div>
  )
}
