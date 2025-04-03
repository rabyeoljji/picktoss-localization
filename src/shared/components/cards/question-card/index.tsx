import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { IcChevronDown, IcChevronUp, IcO, IcX } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

export const QuestionCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-5 rounded-[12px] bg-surface-1 border border-outline">{children}</div>
}

const QuestionCardHeader = ({ order, right }: { order: number; right?: React.ReactNode }) => {
  return (
    <div className="h-6 flex items-center justify-between px-4">
      <Text typo="subtitle-1-bold" color="accent">
        Q{order}.
      </Text>
      {right}
    </div>
  )
}

const QuestionCardQuestion = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-2 px-4">
      <Text typo="subtitle-2-bold" color="primary">
        {children}
      </Text>
    </div>
  )
}

const QuestionCardMultiple = ({
  options,
  answerIndex,
  showIndexs,
}: {
  options: string[]
  answerIndex?: number
  showIndexs?: number[]
}) => {
  return (
    <div className="px-4 mt-4 mb-3">
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div
              className={cn(
                'bg-base-2 rounded-[4px] shrink-0 size-5 flex-center',
                showIndexs?.includes(index) &&
                  (answerIndex === index ? 'bg-correct text-correct' : 'bg-incorrect text-incorrect'),
                showIndexs?.length && !showIndexs.includes(index) && 'bg-base-2 text-disabled',
              )}
            >
              <Text typo="body-2-bold">{String.fromCharCode(65 + index)}</Text>
            </div>
            <Text
              typo="body-1-medium"
              className={cn(
                'text-secondary',
                showIndexs?.includes(index) && (answerIndex === index ? 'text-correct' : 'text-incorrect'),
                showIndexs?.length && !showIndexs.includes(index) && 'text-disabled',
              )}
            >
              {option}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

const QuestionCardOX = ({
  userAnswer,
  answer,
  showIndexs,
  disabledIndexs,
}: {
  userAnswer?: 'correct' | 'incorrect'
  answer?: 'correct' | 'incorrect'
  showIndexs?: number[]
  disabledIndexs?: number[]
}) => {
  console.log('showIndexs', showIndexs)
  return (
    <div className="px-4 mt-4 mb-3">
      <div className="px-[11.5px] flex items-center gap-2 w-full">
        <div
          className={cn(
            'bg-surface-2 rounded-[8px] text-icon-secondary aspect-[140/44] flex-1 flex-center',
            showIndexs?.includes(0) &&
              (answer === 'correct'
                ? 'bg-correct text-green-500'
                : userAnswer === 'correct'
                  ? 'bg-incorrect text-red-500'
                  : ''),
            disabledIndexs?.includes(0) && 'bg-disabled text-icon-disabled',
          )}
        >
          <IcO className="size-6" />
        </div>
        <div
          className={cn(
            'bg-surface-2 rounded-[8px] text-icon-secondary aspect-[140/44] flex-1 flex-center',
            showIndexs?.includes(1) &&
              (answer === 'incorrect'
                ? 'bg-correct text-green-500'
                : userAnswer === 'incorrect'
                  ? 'bg-incorrect text-red-500'
                  : ''),
            disabledIndexs?.includes(1) && 'bg-disabled text-icon-disabled',
          )}
        >
          <IcX className="size-6" />
        </div>
      </div>
    </div>
  )
}

const QuestionCardExplanation = ({
  children,
  open,
  onOpenChange,
}: {
  children: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [innerOpen, setInnerOpen] = useState(false)
  const _openChange = onOpenChange ? onOpenChange : setInnerOpen
  const _open = open ?? innerOpen

  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, _open])

  return (
    <div>
      <motion.div
        initial={!contentRef.current && false}
        layout
        className={cn('px-4 overflow-hidden', _open && 'mt-6 mb-3')}
        animate={{ height: _open && contentHeight ? contentHeight : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div ref={contentRef} className="pl-3 border-l-2 border-divider">
          <Text typo="body-2-medium" color="sub">
            {children}
          </Text>
        </div>
      </motion.div>

      <button className="w-full flex-center border-t border-divider" onClick={() => _openChange(!_open)}>
        <div className="self-stretch h-11 flex-center gap-[4px]">
          <Text typo="body-2-medium" color="sub">
            {_open ? '닫기' : '해설 보기'}
          </Text>
          {_open ? (
            <IcChevronUp className="size-[12px] text-icon-sub" />
          ) : (
            <IcChevronDown className="size-[12px] text-icon-sub" />
          )}
        </div>
      </button>
    </div>
  )
}

QuestionCard.Header = QuestionCardHeader
QuestionCard.Question = QuestionCardQuestion
QuestionCard.Multiple = QuestionCardMultiple
QuestionCard.OX = QuestionCardOX
QuestionCard.Explanation = QuestionCardExplanation
