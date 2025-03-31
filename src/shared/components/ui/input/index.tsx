import { useId, useRef, useState } from 'react'

import { IcClear } from '@/shared/assets/icon'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'

import { Text } from '../text'

interface InputProps extends React.ComponentProps<'input'> {
  label?: string
  hasError?: boolean
  helperText?: string
  right?: React.ReactNode
  hasClear?: boolean
  width?: string | number
  onClearClick?: () => void
}

function Input({
  className,
  type,
  hasError = false,
  label,
  right,
  required = false,
  helperText,
  hasClear,
  ref,
  width,
  value,
  onChange,
  onClearClick,
  ...props
}: InputProps) {
  // 내부 상태로 value 관리 (비제어 컴포넌트를 위함)
  const [internalValue, setInternalValue] = useState('')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // ref 합치기 위한 함수
  const setInputRef = (node: HTMLInputElement) => {
    inputRef.current = node
    if (ref) {
      if (typeof ref === 'function') {
        ref(node)
      } else {
        ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    }
  }

  // 사용자 정의 스타일과 너비 속성을 결합
  const containerStyle = {
    ...(width ? { width } : {}),
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }

    // 기존 onChange 이벤트 유지
    onChange?.(e)
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')

      // 비제어 컴포넌트일 때 input value를 직접 변경하고 change 이벤트 발생시키기
      if (inputRef.current) {
        inputRef.current.value = ''
        const event = new Event('input', { bubbles: true })
        inputRef.current.dispatchEvent(event)
      }
    }

    // focus 다시 설정
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className="flex flex-col w-full" style={containerStyle}>
      {label && <InputLabel id={id} hasError={hasError} label={label} required={required} />}
      <div className="relative w-full" style={containerStyle}>
        <input
          id={id}
          ref={setInputRef}
          type={type}
          value={currentValue}
          onChange={handleChange}
          data-slot="input"
          className={cn(
            'bg-surface-1 border-outline placeholder:typo-subtitle-2-medium placeholder:text-caption text-primary typo-subtitle-2-medium focus:border-active disabled:text-disabled disabled:bg-disabled disabled:placeholder:text-disabled h-12 w-full rounded-[8px] border px-3 outline-none disabled:border-none',
            hasError && 'border-error focus:border-error',
            className,
          )}
          style={{
            paddingRight: rightRef.current?.offsetWidth ? rightRef.current.offsetWidth + 24 : 12,
          }}
          {...props}
        />
        {/* clear right 둘 중 하나만 사용된다. */}
        {hasClear && (
          <div
            ref={rightRef}
            role="button"
            className="text-icon-inverse-dim size-5 cursor-pointer absolute right-3 bottom-1/2 translate-y-1/2"
            onClick={() => onClearClick?.()}
          >
            <IcClear className="size-full" onClick={handleClear} />
          </div>
        )}
        {right && (
          <div ref={rightRef} className="absolute right-3 bottom-1/2 translate-y-1/2">
            {right}
          </div>
        )}
      </div>
      {helperText && <InputHelper hasError={hasError} helperText={helperText} />}
    </div>
  )
}

const InputLabel = ({
  id,
  hasError,
  label,
  required,
}: {
  id: string
  hasError: boolean
  label: string
  required: boolean
}) => {
  return (
    <div className="mb-2 flex items-start gap-0.5">
      <Label htmlFor={id} className={cn(hasError && 'text-error')} required={required}>
        {label}
      </Label>
    </div>
  )
}

const InputHelper = ({ hasError, helperText }: { hasError: boolean; helperText: string }) => {
  return (
    <div className={cn('text-caption mt-2 flex items-center gap-[5px]', hasError && 'text-error')}>
      {hasError && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="6" fill="#F4502C" />
          <path d="M4 8L8 4" stroke="white" strokeWidth="0.75" strokeLinecap="square" strokeLinejoin="round" />
          <path d="M4 4L8 8" stroke="white" strokeWidth="0.75" strokeLinecap="square" strokeLinejoin="round" />
        </svg>
      )}
      <Text typo="body-2-medium">{helperText}</Text>
    </div>
  )
}

export { Input }
