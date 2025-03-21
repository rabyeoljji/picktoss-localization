import { forwardRef, useEffect, useRef, useState } from 'react'

import { IcClear, IcSearch } from '@/shared/assets/icon'

import { Input } from '../input'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  deleteKeyword?: () => void
  // onValueChange?: (value: string) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, deleteKeyword, ...props }: SearchInputProps, ref) => {
    const [internalValue, setValue] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

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
      <div className="bg-base-2 flex items-center rounded-full overflow-hidden">
        <IcSearch className="size-[20px] shrink-0 ml-[10px] text-icon-secondary" />
        <Input
          ref={mergedRef}
          value={internalValue}
          className="h-[40px] border-none bg-base-2 pl-1 focus:border-none"
          placeholder="검색어를 입력해주세요"
          right={
            internalValue && (
              <IcClear
                className="size-5 text-icon-sub cursor-pointer"
                onClick={deleteKeyword ?? handleClear}
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
