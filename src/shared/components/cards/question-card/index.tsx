import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { IcChevronDown, IcChevronUp, IcO, IcX } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

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
export const QuestionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [isExplanationOpen, setExplanationOpen] = useState(false)
  return (
    <QuestionCardContext.Provider value={{ isExplanationOpen, setExplanationOpen }}>
      <div className={cn('pt-5 rounded-[12px] bg-surface-1', className)}>{children}</div>
    </QuestionCardContext.Provider>
  )
}

// 서브컴포넌트: Header, Question 등은 그대로 둡니다.
const QuestionCardHeader = ({
  order,
  right,
  className,
}: {
  order?: number
  right?: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('h-6 flex items-center justify-between px-4', className)}>
      <Text typo="subtitle-1-bold" color="accent">
        Q{order}.
      </Text>
      {right}
    </div>
  )
}

const QuestionCardQuestion = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('mt-2 px-4', className)}>
      <Text typo="subtitle-2-bold" color="primary">
        {children}
      </Text>
    </div>
  )
}

// 3. 정답 표시를 위한 Multiple 컴포넌트 수정 (answerIndex 필수, showAnswer prop 추가)
const QuestionCardMultiple = ({
  options,
  answerIndex,
  showIndexs,
  showAnswer,
  className,
}: {
  options: string[]
  answerIndex: number
  showIndexs?: number[]
  showAnswer?: boolean
  className?: string
}) => {
  const { isExplanationOpen } = useQuestionCardContext()
  // 해설이 열려있거나, showAnswer prop이 true이면 정답 인덱스를 자동으로 표시
  const finalShowIndexs = isExplanationOpen || showAnswer ? [...(showIndexs || []), answerIndex] : showIndexs || []
  return (
    <div className={cn('px-4 mt-4 mb-3', className)}>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div
              className={cn(
                'bg-base-2 rounded-[4px] shrink-0 size-5 flex-center text-sub',
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

// 4. OX 컴포넌트 수정 (answerIndex 필수, showAnswer prop 추가)
const QuestionCardOX = ({
  answerIndex,
  showIndexs,
  disabledIndexs,
  showAnswer,
  className,
}: {
  answerIndex: number
  showIndexs?: number[]
  disabledIndexs?: number[]
  showAnswer?: boolean
  className?: string
}) => {
  const { isExplanationOpen } = useQuestionCardContext()
  const finalShowIndexs = isExplanationOpen || showAnswer ? [...(showIndexs || []), answerIndex] : showIndexs || []
  return (
    <div className={cn('px-4 mt-4 mb-3', className)}>
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

// 5. Explanation 컴포넌트 수정: 외부에서 open, onOpenChange도 받을 수 있도록 하고 내부 상태와 동기화
const QuestionCardExplanation = ({
  children,
  open,
  hideToggle,
  onOpenChange,
  className,
}: {
  children: string
  open?: boolean
  hideToggle?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}) => {
  const { t } = useTranslation()

  const { isExplanationOpen, setExplanationOpen } = useQuestionCardContext()

  // 외부 prop open이 있다면 해당 값을 사용하고, 없으면 내부 상태를 사용
  const effectiveOpen = open !== undefined ? open : isExplanationOpen

  // 외부 open prop이 있을 경우 컨텍스트 상태와 동기화 (Multiple, OX 등에서 사용)
  useEffect(() => {
    if (open !== undefined) {
      setExplanationOpen(open)
    }
  }, [open, setExplanationOpen])

  // 토글 시 외부 onOpenChange가 있으면 호출, 아니면 내부 상태 변경
  const handleToggle = () => {
    if (onOpenChange) {
      onOpenChange(!effectiveOpen)
    } else {
      setExplanationOpen(!effectiveOpen)
    }
  }

  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, effectiveOpen])

  return (
    <div>
      <motion.div
        initial={false}
        layout
        className={cn('px-4 overflow-hidden', effectiveOpen && 'mt-6 mb-3', className)}
        animate={{ height: effectiveOpen && contentHeight ? contentHeight : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div ref={contentRef} className="pl-3 border-l-2 border-divider">
          <Text typo="body-2-medium" color="sub">
            {children}
          </Text>
        </div>
      </motion.div>
      {hideToggle ? null : (
        <button className="w-full flex-center" onClick={handleToggle}>
          <div className="self-stretch h-11 flex-center gap-[4px]">
            <Text typo="body-2-medium" color="sub">
              {effectiveOpen
                ? t('quizDetail.quiz_detail_list_page.close')
                : t('quizDetail.quiz_detail_list_page.view_explanation')}
            </Text>
            {effectiveOpen ? (
              <IcChevronUp className="size-[12px] text-icon-sub" />
            ) : (
              <IcChevronDown className="size-[12px] text-icon-sub" />
            )}
          </div>
        </button>
      )}
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
