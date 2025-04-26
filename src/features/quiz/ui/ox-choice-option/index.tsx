import { HTMLMotionProps, motion } from 'framer-motion'
import { CircleIcon, XIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export interface OXChoiceOptionProps extends Omit<HTMLMotionProps<'button'>, 'onDrag'> {
  O: boolean
  X: boolean
  isCorrect: boolean
  selectedOption: string | null
  className?: HTMLButtonElement['className']
  animationDelay?: number
}

export const OXChoiceOption = ({
  O,
  X,
  isCorrect,
  selectedOption,
  className,
  animationDelay = 0,
  ...props
}: OXChoiceOptionProps) => {
  const isSelected = selectedOption === (O ? 'correct' : 'incorrect')

  // 컴포넌트 상태에 따른 스타일 계산
  const getStateStyles = () => {
    // 아직 선택되지 않은 상태
    if (selectedOption === null) {
      return O ? 'bg-blue-strong text-icon-inverse' : 'bg-orange-strong text-icon-inverse'
    }

    // 선택 완료된 상태
    if (isCorrect) {
      // 정답인 경우
      return '[&_svg]:text-icon-correct bg-correct'
    } else if (isSelected) {
      // 선택했지만 오답인 경우
      return '[&_svg]:text-icon-incorrect bg-incorrect'
    } else {
      // 선택하지 않았고 오답인 경우
      return '[&_svg]:text-icon-disabled bg-disabled'
    }
  }

  return (
    <motion.button
      className={cn('flex-center rounded-[20px] aspect-[165/126]', getStateStyles(), className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      {...props}
    >
      {O && <CircleIcon className="size-[80px] stroke-[4]" />}
      {X && <XIcon className="size-[80px] stroke-[3]" />}
    </motion.button>
  )
}
