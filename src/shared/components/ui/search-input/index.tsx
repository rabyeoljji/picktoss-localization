import { forwardRef, useEffect, useRef, useState } from 'react'

import { IcClear, IcSearch } from '@/shared/assets/icon'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

import { Input } from '../input'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  clearKeyword?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, clearKeyword, className, ...props }: SearchInputProps, ref) => {
    const [internalValue, setValue] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)
    const { t } = useTranslation()

    const mergedRef = useMergedRef(ref, inputRef)

    useEffect(() => {
      setValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      onChange?.(e)
    }

    const handleClear = () => {
      setValue('')
      onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)

      // clear 후 input에 focus 설정
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }

    return (
      <div className={cn('bg-base-2 flex items-center rounded-full overflow-hidden', className)}>
        <IcSearch className="size-[20px] shrink-0 ml-[10px] text-icon-secondary" />
        <Input
          ref={mergedRef}
          value={internalValue}
          className={cn('h-[40px] border-none bg-base-2 pl-1 focus:border-none placeholder:text-caption', className)}
          placeholder={t('library.search_input.placeholder')}
          right={
            internalValue && (
              <IcClear
                className="size-5 text-icon-sub cursor-pointer"
                fill="var(--color-gray-300)" // ic_clear 클래스명으로 색상 적용이 안되고 있음
                onClick={clearKeyword ?? handleClear}
                role="button"
              />
            )
          }
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  },
)

// ✅ 여러 개의 ref를 병합하는 커스텀 훅
function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref && typeof ref === 'object') {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    })
  }
}
