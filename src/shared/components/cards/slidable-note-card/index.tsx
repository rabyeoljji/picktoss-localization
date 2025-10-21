import { useEffect, useRef, useState } from 'react'

import { PanInfo, motion, useAnimation, useMotionValue } from 'framer-motion'

import { IcBookmarkFilled, IcPlayFilled } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface Props {
  children: React.ReactNode
  id: number
  selectMode: boolean
  changeSelectMode: (value: boolean) => void
  // onSelect: () => void
  onClick: () => void
  swipeOptions: React.ReactNode[]
  className?: HTMLElement['className']
  defaultSlid?: boolean
}

export const SlidableNoteCard = ({
  children,
  id,
  className,
  selectMode,
  changeSelectMode,
  // onSelect,
  onClick,
  swipeOptions,
  defaultSlid,
}: Props) => {
  const totalSwipeOptionsWidth = swipeOptions.length * 65

  const [innerSelectMode, setInnerSelectMode] = useState(false)

  const _selectMode = selectMode ?? innerSelectMode
  const _onSelectModeChange = changeSelectMode ?? setInnerSelectMode

  const [isSwiped, setIsSwiped] = useState(defaultSlid ?? false)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(defaultSlid ? -totalSwipeOptionsWidth : 0)
  const controls = useAnimation()

  const [isLongPress, setIsLongPress] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressDuration = 700 // 0.7초 이상 누르면 selectMode로 전환

  useEffect(() => {
    if (selectMode !== undefined) {
      setInnerSelectMode(selectMode)
    }
  }, [selectMode])

  const handlePressStart = () => {
    if (isDragging) return

    setIsLongPress(false)

    longPressTimer.current = setTimeout(() => {
      _onSelectModeChange(true)
      setIsLongPress(true)
    }, longPressDuration)
  }

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -30) {
      setIsSwiped(true) // 30px 이상 드래그하면 스와이프
      await controls.start({ x: -totalSwipeOptionsWidth }) // 요소 왼쪽으로 이동
    } else {
      setIsSwiped(false) // 스와이프 취소
      await controls.start({ x: 0 }) // 원래 위치로 이동
    }
    setIsDragging(false)
  }

  const handleClickCard = (e: React.MouseEvent) => {
    if (isLongPress) {
      e.preventDefault()
    }

    // onSelect()

    if (!_selectMode && !isDragging && !isSwiped) {
      onClick()
    }
  }

  return (
    <label
      htmlFor={`note_${id}`}
      onClick={handleClickCard}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      className={cn(
        `relative flex h-[104px] max-w-full items-center overflow-hidden rounded-[16px] bg-white pl-[12px] pr-[16px] py-[19px] shrink-0 cursor-pointer`,
        className,
      )}
    >
      {/* Swipe 영역 */}
      <motion.div
        className="relative flex h-[104px] w-full items-center rounded-[16px]"
        drag={_selectMode ? false : 'x'}
        dragConstraints={{ left: -(swipeOptions.length * 65), right: 0 }}
        onDrag={() => {
          if (!_selectMode) {
            setIsDragging(true)
            // 드래그 중에 longPress감지되는 현상 방지
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current)
              longPressTimer.current = null
            }
          }
        }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}

        {/* Swipe로 보여지는 버튼 영역 */}
        <motion.div
          initial={false}
          animate={{ x: isSwiped ? swipeOptions.length * 72 : swipeOptions.length * 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-y-0 right-0 flex h-[calc(100%+2px)] flex-row overflow-hidden rounded-r-[16px]"
        >
          {swipeOptions.map((option) => option)}
        </motion.div>
      </motion.div>
    </label>
  )
}

const SlidableNoteCardLeft = ({
  content,
  checkBox,
  selectMode,
}: {
  content: string
  checkBox: React.ReactNode
  selectMode: boolean
}) => {
  return (
    <>
      {selectMode ? (
        <>{checkBox}</>
      ) : (
        <div className={cn('flex-center size-10 shrink-0 text-inverse')}>
          <Text typo="h3">{content}</Text>
        </div>
      )}
    </>
  )
}

const SlidableNoteCardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-[12px] flex w-[calc(100%-55px)] flex-col">{children}</div>
}

const SlidableNoteCardHeader = ({ title, tag }: { title: React.ReactNode; tag?: React.ReactNode }) => {
  return (
    <div className="mb-[2px] flex items-center gap-[8px]">
      <Text as="h4" typo="subtitle-2-bold" className="w-fit max-w-[calc(100%-100px)] overflow-x-hidden truncate">
        {title}
      </Text>

      {tag}
    </div>
  )
}

const SlidableNoteCardPreview = ({ content }: { content: React.ReactNode }) => {
  return (
    <Text typo="body-1-regular" color="sub" className="w-[calc(100%-40px)] truncate text-nowrap break-all">
      {content}
    </Text>
  )
}

const SlidableNoteCardDetail = ({
  quizCount,
  isPublic,
  playedCount,
  bookmarkCount,
}: {
  quizCount: number
  isPublic?: boolean
  playedCount?: number
  bookmarkCount?: number
}) => {
  const { t } = useTranslation()

  return (
    <Text typo="body-2-medium" color="sub" className="flex w-fit items-center mt-[4px]">
      <div className="inline-flex justify-start items-center gap-[2px]">
        <span>{t('common.quiz_card.question_count', { count: quizCount })}</span>
      </div>

      {isPublic && (
        <>
          <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />

          <div className="inline-flex justify-start items-center gap-[2px]">
            <IcPlayFilled className="size-[12px] text-icon-sub" />
            <span>{playedCount}</span>
          </div>

          <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />

          <div className="inline-flex justify-start items-center gap-[2px]">
            <IcBookmarkFilled className="size-[12px] text-icon-sub" />
            <span>{bookmarkCount}</span>
          </div>
        </>
      )}

      {!isPublic && (
        <>
          <div className="inline-block size-[3px] mx-[4px] bg-[var(--color-gray-100)] rounded-full" />
          <span>{t('common.quiz_card.private')}</span>
        </>
      )}
    </Text>
  )
}

SlidableNoteCard.Left = SlidableNoteCardLeft
SlidableNoteCard.Content = SlidableNoteCardContent
SlidableNoteCard.Header = SlidableNoteCardHeader
SlidableNoteCard.Preview = SlidableNoteCardPreview
SlidableNoteCard.Detail = SlidableNoteCardDetail
