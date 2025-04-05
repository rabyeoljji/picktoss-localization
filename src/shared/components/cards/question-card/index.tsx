import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { IcChevronDown, IcChevronUp, IcO, IcX } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

// 1. 내부 컨텍스트 생성
const QuestionCardContext = createContext<{
  isExplanationOpen: boolean
  setExplanationOpen: (open: boolean) => void
}>({
  isExplanationOpen: false,
  setExplanationOpen: () => {},
})

// 커스텀 훅으로 쉽게 사용
const useQuestionCardContext = () => useContext(QuestionCardContext)

// 2. QuestionCard 컴포넌트 (Provider 적용)
export const QuestionCard = ({ children }: { children: React.ReactNode }) => {
  const [isExplanationOpen, setExplanationOpen] = useState(false)
  return (
    <QuestionCardContext.Provider value={{ isExplanationOpen, setExplanationOpen }}>
      <div className="pt-5 rounded-[12px] bg-surface-1 border border-outline">{children}</div>
    </QuestionCardContext.Provider>
  )
}

// 서브컴포넌트: Header, Question, 등은 그대로 둡니다.
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

// 3. 정답 표시를 위한 Multiple 컴포넌트 수정 (answerIndex 필수)
const QuestionCardMultiple = ({
  options,
  answerIndex,
  showIndexs,
}: {
  options: string[]
  answerIndex: number
  showIndexs?: number[]
}) => {
  const { isExplanationOpen } = useQuestionCardContext()
  // 해설이 열려있다면 정답 인덱스를 자동으로 표시
  const finalShowIndexs = isExplanationOpen ? [answerIndex] : showIndexs || []
  return (
    <div className="px-4 mt-4 mb-3">
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div
              className={cn(
                'bg-base-2 rounded-[4px] shrink-0 size-5 flex-center',
                finalShowIndexs.includes(index) &&
                  (answerIndex === index ? 'bg-correct text-correct' : 'bg-incorrect text-incorrect'),
                finalShowIndexs.length && !finalShowIndexs.includes(index) && 'bg-base-2 text-disabled',
              )}
            >
              <Text typo="body-2-bold">{String.fromCharCode(65 + index)}</Text>
            </div>
            <Text
              typo="body-1-medium"
              className={cn(
                'text-secondary',
                finalShowIndexs.includes(index) && (answerIndex === index ? 'text-correct' : 'text-incorrect'),
                finalShowIndexs.length && !finalShowIndexs.includes(index) && 'text-disabled',
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

// 4. OX 컴포넌트 수정 (answerIndex 필수)
const QuestionCardOX = ({
  answerIndex,
  showIndexs,
  disabledIndexs,
}: {
  answerIndex: number
  showIndexs?: number[]
  disabledIndexs?: number[]
}) => {
  const { isExplanationOpen } = useQuestionCardContext()
  const finalShowIndexs = isExplanationOpen ? [answerIndex] : showIndexs || []
  return (
    <div className="px-4 mt-4 mb-3">
      <div className="px-[11.5px] flex items-center gap-2 w-full">
        <div
          className={cn(
            'bg-surface-2 rounded-[8px] text-icon-secondary aspect-[140/44] flex-1 flex-center',
            finalShowIndexs.includes(0) &&
              (answerIndex === 0 ? 'bg-correct text-green-500' : 'bg-incorrect text-red-500'),
            disabledIndexs?.includes(0) && 'bg-disabled text-icon-disabled',
          )}
        >
          <IcO className="size-6" />
        </div>
        <div
          className={cn(
            'bg-surface-2 rounded-[8px] text-icon-secondary aspect-[140/44] flex-1 flex-center',
            finalShowIndexs.includes(1) &&
              (answerIndex === 1 ? 'bg-correct text-green-500' : 'bg-incorrect text-red-500'),
            disabledIndexs?.includes(1) && 'bg-disabled text-icon-disabled',
          )}
        >
          <IcX className="size-6" />
        </div>
      </div>
    </div>
  )
}

// 5. Explanation 컴포넌트 수정: 내부 state 대신 컨텍스트를 사용하여 open/close 상태를 공유
const QuestionCardExplanation = ({ children }: { children: string }) => {
  const { isExplanationOpen, setExplanationOpen } = useQuestionCardContext()
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isExplanationOpen])

  return (
    <div>
      <motion.div
        initial={false}
        layout
        className={cn('px-4 overflow-hidden', isExplanationOpen && 'mt-6 mb-3')}
        animate={{ height: isExplanationOpen && contentHeight ? contentHeight : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div ref={contentRef} className="pl-3 border-l-2 border-divider">
          <Text typo="body-2-medium" color="sub">
            {children}
          </Text>
        </div>
      </motion.div>
      <button
        className="w-full flex-center border-t border-divider"
        onClick={() => setExplanationOpen(!isExplanationOpen)}
      >
        <div className="self-stretch h-11 flex-center gap-[4px]">
          <Text typo="body-2-medium" color="sub">
            {isExplanationOpen ? '닫기' : '해설 보기'}
          </Text>
          {isExplanationOpen ? (
            <IcChevronUp className="size-[12px] text-icon-sub" />
          ) : (
            <IcChevronDown className="size-[12px] text-icon-sub" />
          )}
        </div>
      </button>
    </div>
  )
}

// 서브컴포넌트 할당
QuestionCard.Header = QuestionCardHeader
QuestionCard.Question = QuestionCardQuestion
QuestionCard.Multiple = QuestionCardMultiple
QuestionCard.OX = QuestionCardOX
QuestionCard.Explanation = QuestionCardExplanation

export default QuestionCard
