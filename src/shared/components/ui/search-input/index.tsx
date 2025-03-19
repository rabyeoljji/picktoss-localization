import { useRef, useState } from 'react'

import { IcClear, IcSearch } from '@/shared/assets/icon'

import { Input } from '../input'

interface SearchInputProps {
  onValueChange?: (value: string) => void
}

export const SearchInput = ({ onValueChange }: SearchInputProps) => {
  const [internalValue, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onValueChange?.(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onValueChange?.('')
    
    // clear 후 input에 focus 설정
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className="bg-base-2 flex items-center rounded-full overflow-hidden">
      <IcSearch className="size-[20px] shrink-0 ml-[10px] text-icon-secondary" />
      <Input
        ref={inputRef}
        value={internalValue}
        className="h-[40px] border-none bg-base-2 pl-1 focus:border-none"
        placeholder="검색어를 입력해주세요"
        right={
          internalValue && (
            <IcClear className="size-5 text-icon-sub cursor-pointer" onClick={handleClear} role="button" />
          )
        }
        onChange={handleChange}
      />
    </div>
  )
}
