import React from 'react'

import { ProductOption, ProductOptionType } from '../../model/type'

interface ProductOptionsProps {
  options: ProductOption[]
  selectedOptions: {
    color?: string
    size?: string
    material?: string
    storage?: string
    capacity?: string
  }
  onOptionChange: (type: ProductOptionType, value: string) => void
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({
  options,
  selectedOptions,
  onOptionChange,
}) => {
  // 옵션 타입별로 그룹화
  const optionsByType: Record<ProductOptionType, string[]> = {
    color: [],
    size: [],
    material: [],
    storage: [],
    capacity: [],
  }

  // 옵션 값 그룹화
  options.forEach(option => {
    if (option.type in optionsByType) {
      // 이미 존재하는 값은 추가하지 않음
      if (!optionsByType[option.type].includes(option.value)) {
        optionsByType[option.type].push(option.value)
      }
    }
  })

  // 옵션 타입별 표시 이름
  const getOptionTypeName = (type: ProductOptionType): string => {
    const typeNames: Record<ProductOptionType, string> = {
      color: '색상',
      size: '사이즈',
      material: '소재',
      storage: '저장 용량',
      capacity: '용량',
    }
    return typeNames[type]
  }

  // 실제 표시할 옵션 타입만 필터링
  const availableOptionTypes = Object.keys(optionsByType).filter(
    type => optionsByType[type as ProductOptionType].length > 0
  ) as ProductOptionType[]

  return (
    <div className="space-y-4">
      {availableOptionTypes.map(type => (
        <div key={type}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getOptionTypeName(type)}
          </label>
          
          <div className="flex flex-wrap gap-2">
            {optionsByType[type].map(value => {
              const isSelected = selectedOptions[type] === value
              
              // 색상 옵션은 특별한 스타일링 적용
              if (type === 'color') {
                // 색상값 매핑
                const colorMap: Record<string, string> = {
                  '블랙': 'bg-gray-900',
                  '화이트': 'bg-white border border-gray-300',
                  '레드': 'bg-red-500',
                  '블루': 'bg-blue-500',
                  '그린': 'bg-green-500',
                  '옐로우': 'bg-yellow-400',
                  '퍼플': 'bg-purple-500',
                  '핑크': 'bg-pink-400',
                  'Black': 'bg-gray-900',
                  'White': 'bg-white border border-gray-300',
                  'Red': 'bg-red-500',
                  'Blue': 'bg-blue-500',
                  'Green': 'bg-green-500',
                  'Yellow': 'bg-yellow-400',
                  'Purple': 'bg-purple-500',
                  'Pink': 'bg-pink-400',
                }
                
                const bgColorClass = colorMap[value] || 'bg-gray-300'
                const textClass = ['White', 'Yellow', '화이트', '옐로우'].includes(value) 
                  ? 'text-gray-800' 
                  : 'text-white'
                
                return (
                  <button
                    key={value}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColorClass} ${
                      isSelected 
                        ? 'ring-2 ring-offset-2 ring-blue-500' 
                        : 'hover:opacity-80'
                    }`}
                    onClick={() => onOptionChange(type, value)}
                    title={value}
                    aria-label={`${getOptionTypeName(type)}: ${value}`}
                  >
                    {isSelected && (
                      <span className={`text-xs ${textClass}`}>✓</span>
                    )}
                  </button>
                )
              }
              
              // 다른 옵션들은 일반 버튼으로 표시
              return (
                <button
                  key={value}
                  className={`px-4 py-2 rounded-md ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                      : 'bg-gray-100 text-gray-800 border-gray-200 border hover:bg-gray-200'
                  }`}
                  onClick={() => onOptionChange(type, value)}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      
      {/* 현재 선택된 옵션 요약 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-1">선택된 옵션:</p>
        <div className="space-y-1">
          {availableOptionTypes.map(type => (
            selectedOptions[type] && (
              <p key={type} className="text-sm text-gray-600">
                {getOptionTypeName(type)}: <span className="font-medium">{selectedOptions[type]}</span>
              </p>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
