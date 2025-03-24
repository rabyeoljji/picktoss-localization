import React from 'react'

import { ProductSortOption } from '../../model/type'

interface ProductSortProps {
  value: ProductSortOption
  onChange: (option: ProductSortOption) => void
}

export const ProductSort: React.FC<ProductSortProps> = ({ value, onChange }) => {
  // 정렬 옵션 목록
  const sortOptions: { value: ProductSortOption; label: string }[] = [
    { value: 'newest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'rating', label: '평점순' },
    { value: 'price-low-high', label: '가격 낮은순' },
    { value: 'price-high-low', label: '가격 높은순' },
  ]

  return (
    <div className="flex items-center">
      <label htmlFor="product-sort" className="text-sm text-gray-600 mr-2">
        정렬:
      </label>
      <select
        id="product-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSortOption)}
        className="border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
