import { useEffect, useRef, useState } from 'react'

import { PanInfo, motion, useAnimation, useMotionValue } from 'framer-motion'

import { IcFolder } from '@/shared/assets/icon'
import { NoteIcon, NoteType } from '@/shared/components/bg-icons/note-icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

interface Props {
  children: React.ReactNode
  id: number
  selectMode: boolean
  changeSelectMode: (value: boolean) => void
  onSelect: () => void
  onClick: () => void
  swipeOptions: React.ReactNode[]
  className?: HTMLElement['className']
}

export const NoteCard = ({
  children,
  id,
  className,
  selectMode,
  changeSelectMode,
  onSelect,
  onClick,
  swipeOptions,
}: Props) => {
  const [innerSelectMode, setInnerSelectMode] = useState(false)

  const _selectMode = selectMode ?? innerSelectMode
  const _onSelectModeChange = changeSelectMode ?? setInnerSelectMode

  const [isSwiped, setIsSwiped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const controls = useAnimation()

  const [isLongPress, setIsLongPress] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressDuration = 800 // 0.8초 이상 누르면 selectMode로 전환

  useEffect(() => {
    if (selectMode !== undefined) {
      setInnerSelectMode(selectMode)
    }
  }, [selectMode])

  const handlePressStart = () => {
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
      await controls.start({ x: -(swipeOptions.length * 65) }) // 요소 왼쪽으로 이동
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

    onSelect()

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
        `relative flex h-[104px] max-w-full items-center overflow-hidden rounded-[16px] bg-white px-[16px] pb-[20px] pt-[17px] shrink-0 cursor-pointer`,
        className,
      )}
    >
      {/* Swipe 영역 */}
      <motion.div
        className="flex h-[104px] max-w-full items-center rounded-[16px] px-[16px] py-[17px]"
        drag={_selectMode ? false : 'x'}
        dragConstraints={{ left: -(swipeOptions.length * 65), right: 0 }}
        onDrag={() => !_selectMode && setIsDragging(true)}
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

const NoteCardLeft = ({
  type,
  checkBox,
  selectMode,
}: {
  // type: 'FILE' | 'TEXT' | 'NOTION'
  type: NoteType
  checkBox: React.ReactNode
  selectMode: boolean
}) => {
  return (
    <>
      {selectMode ? (
        <>{checkBox}</>
      ) : (
        <NoteIcon type={type} containerClassName="size-[36px]" iconClassName="size-[16px]" />
      )}
    </>
  )
}

const NoteCardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-[16px] flex w-full flex-col">{children}</div>
}

const NoteCardHeader = ({ title, tag }: { title: string; tag?: React.ReactNode }) => {
  return (
    <div className="mb-[2px] flex items-center gap-[8px]">
      <Text as="h4" typo="subtitle-2-bold" className="w-fit max-w-[calc(100%-100px)] overflow-x-hidden truncate">
        {title}
      </Text>

      {tag}
    </div>
  )
}

const NoteCardPreview = ({ content }: { content: string }) => {
  return (
    <Text typo="body-1-regular" color="sub" className="w-[calc(100%-55px)] truncate text-nowrap break-all">
      {content}
    </Text>
  )
}

const NoteCardDetail = ({
  quizCount,
  charCount,
  directory,
}: {
  quizCount: number
  charCount: number
  directory: string
}) => {
  return (
    <Text typo="body-2-medium" color="sub" className="flex w-fit items-center">
      <span>{quizCount}문제</span>
      <div className="inline-block size-fit mx-[8px] text-icon-sub">•</div>
      <span>{charCount}자</span>
      <div className="inline-block size-fit mx-[8px] text-icon-sub">•</div>
      <span className="flex items-center">
        <IcFolder className="size-[12px] mr-[2px] text-icon-tertiary" />
        {directory}
      </span>
    </Text>
  )
}

NoteCard.Left = NoteCardLeft
NoteCard.Content = NoteCardContent
NoteCard.Header = NoteCardHeader
NoteCard.Preview = NoteCardPreview
NoteCard.Detail = NoteCardDetail
