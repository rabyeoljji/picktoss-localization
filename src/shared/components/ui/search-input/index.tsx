import { useRef, useState } from 'react'

import { IcClear, IcSearch } from '@/shared/assets/icon'

import { Input } from '../input'

interface SearchInputProps extends React.ComponentProps<'input'> {
  onValueChange?: (value: string) => void
  clear?: () => void
}

export const SearchInput = ({ onValueChange, clear, value: externalValue, onChange, ...props }: SearchInputProps) => {
  const [internalValue, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 제어 컴포넌트인지 확인
  const isControlled = externalValue !== undefined
  const value = isControlled ? externalValue : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setValue(e.target.value)
    }
    
    onValueChange?.(e.target.value)
    onChange?.(e)
  }

  const handleClear = () => {
    if (!isControlled) {
      setValue('')
    }
    
    clear?.()
  }

  return (
    <div className="bg-base-2 flex items-center rounded-full overflow-hidden">
      <IcSearch className="size-[20px] shrink-0 ml-[10px] text-icon-secondary" />
      <Input
        ref={inputRef}
        value={value}
        className="h-[40px] border-none bg-base-2 pl-1 focus:border-none"
        placeholder="검색어를 입력해주세요"
        right={value && <IcClear className="size-5 text-icon-sub cursor-pointer" onClick={handleClear} role="button" />}
        onChange={handleChange}
        clear={handleClear}
        {...props}
      />
    </div>
  )
}
