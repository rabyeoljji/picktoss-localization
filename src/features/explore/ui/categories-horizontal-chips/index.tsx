import { useEffect, useRef } from 'react'

import { Category } from '@/entities/category/api'

import { Chip } from '@/shared/components/ui/chip'
import { useQueryParam } from '@/shared/lib/router'
import { cn } from '@/shared/lib/utils'

const CategoriesHorizontalChips = ({ categories }: { categories?: Category[] }) => {
  const [params, setParams] = useQueryParam('/explore')
  const activeCategory = params.category

  const setCategory = (categoryId: number) => {
    setParams({ ...params, category: categoryId })
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault() // ✅ preventDefault 이제 가능
        el.scrollLeft += e.deltaY
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false }) // ✅ 핵심

    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="sticky top-[var(--header-height-safe)] z-50 bg-base-2 flex gap-[6px] overflow-x-auto scrollbar-hide px-[8px] py-[8px]"
    >
      {/* 전체 */}
      <Chip
        variant={activeCategory === 0 ? 'selected' : 'darken'}
        left={activeCategory === 0 ? '💫' : undefined}
        onClick={() => setCategory(0)}
        className={cn('ml-[16px]')}
      >
        전체
      </Chip>

      {/* Chip 요소들 */}
      {categories &&
        categories.map((category, index) => (
          <Chip
            key={index}
            variant={category.id === activeCategory ? 'selected' : 'darken'}
            left={category.id === activeCategory ? category.emoji : undefined}
            onClick={() => setCategory(category.id)}
          >
            {category.name}
          </Chip>
        ))}
    </div>
  )
}

export default CategoriesHorizontalChips
