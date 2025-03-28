import * as React from 'react'

import { cn } from '@/shared/lib/utils'

interface SelectboxProps extends React.HTMLAttributes<HTMLLabelElement> {
  selected: boolean
  onSelect?: () => void

  relativeItem?: React.ReactNode
  htmlFor?: string
  disabled?: boolean
}

/**
 * 선택 가능한 UI 컴포넌트로, 라디오 버튼이나 체크박스와 연계하여 사용 가능
 *
 * @param selected 현재 선택 상태
 * @param onSelect 선택 시 호출되는 콜백 함수
 * @param relativeItem SelectBox와 연계할 라디오 버튼이나 체크박스 등의 아이템
 * @param htmlFor 연결된 요소의 ID
 * @param disabled 컴포넌트의 비활성화 상태
 *
 * @example
 * // 단일 선택 (라디오 버튼)
 * <Selectbox
 *   selected={selectedValue === 'option1'}
 *   onSelect={() => handleSelect('option1')}
 *   relativeItem={<RadioButton />}
 * >
 *   Option 1
 * </Selectbox>
 *
 * @example
 * // 다중 선택 (체크박스)
 * <Selectbox
 *   selected={isChecked}
 *   onSelect={handleToggle}
 *   relativeItem={<Checkbox />}
 * >
 *   Multiple Select Option
 * </Selectbox>
 */
export function Selectbox({
  className,
  children,
  selected,
  onSelect,
  relativeItem,
  htmlFor,
  disabled,
  ...props
}: SelectboxProps) {
  return (
    <>
      {relativeItem}
      <label
        htmlFor={htmlFor}
        aria-checked={selected}
        onClick={onSelect}
        className={cn(
          'flex-center w-full px-[16px] py-[14px] m-0 cursor-pointer rounded-[10px] border outline-none',
          disabled ? 'cursor-default border-gray-100 !bg-gray-50 !text-disabled' : '',
          selected
            ? 'border-accent bg-accent text-accent typo-body-1-bold'
            : 'border-outline bg-base-1 text-secondary typo-body-1-medium',
          className,
        )}
        {...props}
      >
        {children}
      </label>
    </>
  )
}
